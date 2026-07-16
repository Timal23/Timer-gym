const STORAGE_KEY = 'gymtimer:v1';
const DEFAULT_WEIGHT = 20;

function defaultState() {
  return {
    mode: 'Salle',
    equipmentMaison: {
      Haltères: true,
      Barre: false,
      'Barre EZ': false,
      'Barre de traction': true,
      Kettlebell: false,
      'Chaise romaine': false
    },
    equipmentPdc: {
      'Barre de traction': false,
      'Barres parallèles': false
    },
    pendingProgramId: null,
    pendingMode: null,
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
      equipmentMaison: { ...base.equipmentMaison, ...(parsed.equipmentMaison || {}) },
      equipmentPdc: { ...base.equipmentPdc, ...(parsed.equipmentPdc || {}) },
      history: { ...base.history, ...(parsed.history || {}) }
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
