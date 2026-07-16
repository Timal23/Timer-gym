import { getState, setState } from '../state.js';
import { navigate } from '../router.js';
import { Timer, fmt } from '../timer.js';

export default function renderRest(root) {
  const state = getState();
  const session = state.session;
  if (!session || session.restDuration == null) {
    navigate('/workout');
    return;
  }

  const nextExercise = session.exercises[session.nextExerciseIndex];

  root.innerHTML = `
    <div class="screen screen--accent">
      <div class="timer-hero">
        <div class="eyebrow eyebrow--onaccent" style="letter-spacing:3px;margin-top:14px">Repos 🔥</div>
        <div class="timer-clock" id="clock">${fmt(session.restDuration)}</div>
        <div class="progress-track"><div class="progress-fill" id="fill" style="width:0%"></div></div>
        <div class="adjust-row">
          <button class="adjust-chip" data-delta="-15">−15</button>
          <button class="adjust-chip" data-delta="-5">−5</button>
          <button class="adjust-chip" data-delta="5">+5</button>
          <button class="adjust-chip" data-delta="15">+15</button>
        </div>
        <div class="next-set-card">
          <div class="label">Prochaine série</div>
          <div class="value">Série ${session.nextSetIndex}/${nextExercise.sets} · ${nextExercise.name}</div>
        </div>
        <button class="btn" style="margin-top:14px;background:#fff;color:#0a0a0a" id="skip">Passer ▸</button>
      </div>
    </div>
  `;

  const clockEl = root.querySelector('#clock');
  const fillEl = root.querySelector('#fill');

  const timer = new Timer({
    onTick: (remaining) => {
      clockEl.textContent = fmt(remaining);
      const total = timer.duration || 1;
      fillEl.style.width = `${Math.min(100, ((total - remaining) / total) * 100)}%`;
      clockEl.classList.toggle('warn', remaining <= 10 && remaining > 0);
    },
    onComplete: () => advance()
  });

  timer.start(session.restDuration);

  function advance() {
    timer.stop();
    setState((s) => ({
      ...s,
      session: {
        ...s.session,
        exerciseIndex: s.session.nextExerciseIndex,
        setIndex: s.session.nextSetIndex,
        restDuration: null,
        nextExerciseIndex: null,
        nextSetIndex: null
      }
    }));
    navigate('/workout');
  }

  root.querySelectorAll('[data-delta]').forEach((btn) => {
    btn.addEventListener('click', () => {
      timer.addSeconds(parseInt(btn.dataset.delta, 10));
    });
  });

  root.querySelector('#skip').addEventListener('click', advance);

  return () => timer.stop();
}
