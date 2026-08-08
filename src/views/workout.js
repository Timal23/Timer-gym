import { getState, setState, recordWorkoutCompleted, getSessionWeight, setSessionWeight, getOneRM, setOneRM } from '../state.js';
import { getProgramMeta } from '../programs.js';
import { navigate } from '../router.js';
import { Timer, fmt } from '../timer.js';
import { suggestedWeight, parseTargetReps, fmtKg } from '../oneRm.js';

let holdTimer = null;

function stopHoldTimer() {
  if (holdTimer) {
    holdTimer.stop();
    holdTimer = null;
  }
}

export default function renderWorkout(root) {
  stopHoldTimer();
  const state = getState();
  const session = state.session;
  if (!session) {
    navigate('/');
    return;
  }

  const meta = getProgramMeta(session.programId);
  const exercises = session.exercises;
  const exercise = exercises[session.exerciseIndex];

  // Poids conseillé à partir du 1RM enregistré pour cet exercice (si présent).
  const oneRM = getOneRM(exercise.name);
  const targetReps = parseTargetReps(exercise.reps);
  const suggested = suggestedWeight(oneRM, exercise.reps);
  const storedWeight = session.weights?.[session.exerciseIndex];
  // Si l'utilisateur n'a pas encore ajusté la charge, on pré-remplit avec le conseil.
  const weight = storedWeight != null ? storedWeight : (suggested != null ? suggested : getSessionWeight(session.exerciseIndex));
  // Le coaching de charge n'a de sens que pour un exercice chargé (ni maintien, ni échauffement).
  const showCoach = !exercise.hold && exercise.muscle !== 'Échauffement';

  const dots = exercises
    .map((_, i) => `<span class="${i <= session.exerciseIndex ? 'done' : ''}"></span>`)
    .join('');

  root.innerHTML = `
    <div class="screen">
      <div class="screen-header">
        <span class="screen-title">${meta.label}</span>
        <button class="pill-btn" id="quit">Quitter</button>
      </div>
      <div class="screen-body">
        <div>
          <div class="exercise-progress"><span>Exercice</span><span>${session.exerciseIndex + 1} / ${exercises.length}</span></div>
          <div class="dot-track">${dots}</div>
        </div>
        <div>
          <span class="muscle-badge">${exercise.muscle}</span>
          <div class="headline headline--sm" style="margin-top:10px;color:var(--accent)">${exercise.name}</div>
          ${exercise.note ? `<div class="subtext">${exercise.note}</div>` : ''}
        </div>
        <div class="set-panel">
          <div class="label">Série</div>
          <div class="value">${session.setIndex}/${exercise.sets}</div>
        </div>
        <div class="rest-line">
          <span class="label">Repos entre séries</span>
          <span class="value">${exercise.restLabel || fmt(exercise.rest)}</span>
        </div>
        ${exercise.hold ? `
        <div class="hold-panel">
          <div class="label">Maintien · objectif ${exercise.reps === '—' ? fmt(exercise.hold) : exercise.reps}</div>
          <div class="timer-clock timer-clock--sm" id="holdClock">${fmt(exercise.hold)}</div>
          <div class="progress-track"><div class="progress-fill" id="holdFill" style="width:0%"></div></div>
          <button class="btn btn-dark" id="holdBtn" style="margin-top:12px">Démarrer le maintien ▸</button>
        </div>
        ` : `
        <div class="btn-row">
          <div class="stat-tile">
            <div class="label">Reps cible</div>
            <div class="value">${exercise.reps}</div>
          </div>
          <div class="load-tile">
            <div class="label">Charge</div>
            <div class="row">
              <span class="step-btn" data-step="-2.5">−</span>
              <span class="value">${weight}<span style="font-size:12px"> KG</span></span>
              <span class="step-btn" data-step="2.5">+</span>
            </div>
          </div>
        </div>
        ${showCoach ? `
        <div class="coach">
          ${suggested != null ? `
          <div class="coach-hint">
            <span class="lbl">💡 Poids conseillé${targetReps ? ` · ${targetReps} reps` : ''}</span>
            <span class="coach-val">${fmtKg(suggested)} kg</span>
          </div>
          <div class="coach-sub">Estimé d'après ton 1RM de ${fmtKg(oneRM)} kg · <button class="linkbtn" data-toggle-1rm>modifier</button></div>
          ` : `
          <button class="coach-add" data-toggle-1rm>➕ Définir mon 1RM pour un poids conseillé</button>
          `}
          <form class="onerm-form" data-1rm-form hidden>
            <input class="text-input" type="number" inputmode="decimal" step="2.5" min="0" placeholder="Ton 1RM sur cet exo (kg)" value="${oneRM ?? ''}" data-1rm-input />
            <button class="btn-square" type="submit" aria-label="Enregistrer le 1RM">✓</button>
          </form>
        </div>
        ` : ''}
        `}
        <div class="btn-row" style="margin-top:auto">
          <button class="btn-square" id="prev" ${session.exerciseIndex === 0 ? 'disabled' : ''}>‹</button>
          <button class="btn btn-dark" id="done">Série faite ✓</button>
          <button class="btn-square" id="next" ${session.exerciseIndex >= exercises.length - 1 ? 'disabled' : ''}>›</button>
        </div>
      </div>
    </div>
  `;

  root.querySelector('#quit').addEventListener('click', () => {
    setState((s) => ({ ...s, session: null }));
    navigate('/');
  });

  root.querySelectorAll('[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const delta = parseFloat(btn.dataset.step);
      setSessionWeight(session.exerciseIndex, Math.max(0, weight + delta));
      renderWorkout(root);
    });
  });

  const oneRmForm = root.querySelector('[data-1rm-form]');
  root.querySelectorAll('[data-toggle-1rm]').forEach((btn) => {
    btn.addEventListener('click', () => {
      oneRmForm.hidden = !oneRmForm.hidden;
      if (!oneRmForm.hidden) oneRmForm.querySelector('[data-1rm-input]').focus();
    });
  });
  if (oneRmForm) {
    oneRmForm.addEventListener('submit', (e) => {
      e.preventDefault();
      setOneRM(exercise.name, oneRmForm.querySelector('[data-1rm-input]').value);
      renderWorkout(root);
    });
  }

  if (exercise.hold) {
    const holdClock = root.querySelector('#holdClock');
    const holdFill = root.querySelector('#holdFill');
    const holdBtn = root.querySelector('#holdBtn');
    let holdRunning = false;

    const resetHold = () => {
      holdRunning = false;
      holdClock.textContent = fmt(exercise.hold);
      holdClock.classList.remove('warn');
      holdFill.style.width = '0%';
      holdBtn.textContent = 'Démarrer le maintien ▸';
    };

    holdBtn.addEventListener('click', () => {
      if (holdRunning) {
        stopHoldTimer();
        resetHold();
        return;
      }
      holdRunning = true;
      holdBtn.textContent = 'Stop ■';
      holdTimer = new Timer({
        onTick: (remaining) => {
          holdClock.textContent = fmt(remaining);
          const total = exercise.hold || 1;
          holdFill.style.width = `${Math.min(100, ((total - remaining) / total) * 100)}%`;
          holdClock.classList.toggle('warn', remaining <= 5 && remaining > 0);
        },
        onComplete: () => {
          holdRunning = false;
          holdTimer = null;
          holdClock.textContent = 'Terminé';
          holdClock.classList.remove('warn');
          holdFill.style.width = '100%';
          holdBtn.textContent = 'Refaire ↻';
        }
      });
      holdTimer.start(exercise.hold);
    });
  }

  const prevBtn = root.querySelector('#prev');
  if (!prevBtn.disabled) {
    prevBtn.addEventListener('click', () => {
      setState((s) => ({ ...s, session: { ...s.session, exerciseIndex: s.session.exerciseIndex - 1, setIndex: 1 } }));
      renderWorkout(root);
    });
  }

  const nextBtn = root.querySelector('#next');
  if (!nextBtn.disabled) {
    nextBtn.addEventListener('click', () => {
      setState((s) => ({ ...s, session: { ...s.session, exerciseIndex: s.session.exerciseIndex + 1, setIndex: 1 } }));
      renderWorkout(root);
    });
  }

  root.querySelector('#done').addEventListener('click', () => {
    stopHoldTimer();
    completeSet(session, exercises, exercise);
  });

  return () => stopHoldTimer();
}

function completeSet(session, exercises, exercise) {
  const isLastSetOfExercise = session.setIndex >= exercise.sets;
  const isLastExercise = session.exerciseIndex >= exercises.length - 1;
  const setsCompletedTotal = session.setsCompletedTotal + 1;

  if (isLastSetOfExercise && isLastExercise) {
    const streak = recordWorkoutCompleted();
    const durationMs = Date.now() - session.startedAt;
    setState((s) => ({
      ...s,
      session: null,
      lastSummary: { durationMs, sets: setsCompletedTotal, streak }
    }));
    navigate('/summary');
    return;
  }

  let nextExerciseIndex = session.exerciseIndex;
  let nextSetIndex = session.setIndex + 1;
  if (isLastSetOfExercise) {
    nextExerciseIndex += 1;
    nextSetIndex = 1;
  }

  setState((s) => ({
    ...s,
    session: {
      ...s.session,
      setsCompletedTotal,
      restDuration: exercise.rest,
      nextExerciseIndex,
      nextSetIndex
    }
  }));

  navigate('/rest');
}
