import { EQUIPMENT_MAISON } from './programs.js';

const STORAGE_KEY = 'gymtimer:v1';
const DEFAULT_WEIGHT = 20;

/** Par défaut, tout le matériel est considéré comme dispo (aucun filtrage). */
function defaultEquipment() {
  return Object.fromEntries(EQUIPMENT_MAISON.map((tag) => [tag, true]));
}

function systemPrefersDark() {
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
}

function defaultProfile() {
  return {
    name: '',
    bodyweight: null, // kg
    height: null, // cm
    age: null,
    sex: '', // 'homme' | 'femme' | 'autre'
    goal: '', // 'force' | 'hypertrophie' | 'seche'
    oneRM: {}, // { [exerciseName]: kg }
    equipment: defaultEquipment() // { [matériel]: bool } — filtre le mode Maison
  };
}

function defaultState() {
  return {
    mode: 'Salle',
    level: 'int',
    theme: systemPrefersDark() ? 'dark' : 'light',
    profile: defaultProfile(),
    session: null,
    lastSummary: null,
    history: {
      lastWorkoutDate: null,
      streak: 0
    }
  };
}

function load() {
  const base = defaultState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw);
    return {
      ...base,
      ...parsed,
      history: { ...base.history, ...(parsed.history || {}) },
      profile: {
        ...base.profile,
        ...(parsed.profile || {}),
        oneRM: { ...base.profile.oneRM, ...(parsed.profile?.oneRM || {}) },
        equipment: { ...base.profile.equipment, ...(parsed.profile?.equipment || {}) }
      }
    };
  } catch {
    return base;
  }
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage unavailable (private mode / quota) — app still works in-memory
  }
}

export function getState() {
  return state;
}

export function setState(patch) {
  state = typeof patch === 'function' ? patch(state) : { ...state, ...patch };
  persist();
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const THEME_COLORS = { light: '#f2f0eb', dark: '#14130f' };

/** Reflect the current theme onto <html> and the PWA theme-color meta. */
export function applyTheme(theme = state.theme) {
  const t = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = t;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', THEME_COLORS[t]);
}

export function toggleTheme() {
  const next = state.theme === 'dark' ? 'light' : 'dark';
  setState({ theme: next });
  applyTheme(next);
  return next;
}

export function startSession(programId, mode, exercises) {
  setState((s) => ({
    ...s,
    session: {
      programId,
      mode,
      exercises,
      exerciseIndex: 0,
      setIndex: 1,
      weights: {},
      setsCompletedTotal: 0,
      startedAt: Date.now(),
      restDuration: null,
      nextExerciseIndex: null,
      nextSetIndex: null
    }
  }));
}

export function setProfile(patch) {
  setState((s) => ({ ...s, profile: { ...s.profile, ...patch } }));
}

export function getOneRM(name) {
  return state.profile?.oneRM?.[name] ?? null;
}

/** Enregistre (ou supprime, si valeur vide/nulle) le 1RM d'un exercice. */
export function setOneRM(name, kg) {
  const value = kg == null || kg === '' ? null : Number(kg);
  setState((s) => {
    const oneRM = { ...s.profile.oneRM };
    if (value == null || Number.isNaN(value) || value <= 0) delete oneRM[name];
    else oneRM[name] = value;
    return { ...s, profile: { ...s.profile, oneRM } };
  });
}

export function getSessionWeight(exerciseIndex) {
  const { session } = state;
  if (!session) return DEFAULT_WEIGHT;
  return session.weights?.[exerciseIndex] ?? DEFAULT_WEIGHT;
}

export function setSessionWeight(exerciseIndex, value) {
  setState((s) => ({
    ...s,
    session: { ...s.session, weights: { ...s.session.weights, [exerciseIndex]: value } }
  }));
}

export function recordWorkoutCompleted() {
  const today = todayStr();
  const { lastWorkoutDate, streak } = state.history;
  let newStreak = 1;
  if (lastWorkoutDate === today) {
    newStreak = streak || 1;
  } else if (lastWorkoutDate) {
    const diffDays = Math.round((new Date(today) - new Date(lastWorkoutDate)) / 86400000);
    newStreak = diffDays === 1 ? (streak || 0) + 1 : 1;
  }
  setState((s) => ({ ...s, history: { lastWorkoutDate: today, streak: newStreak } }));
  return newStreak;
}
