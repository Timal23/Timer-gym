import { navigate } from '../router.js';
import { Timer, fmt } from '../timer.js';

const PRESETS = [
  { label: '30s', seconds: 30 },
  { label: '1min', seconds: 60 },
  { label: '1min30', seconds: 90 },
  { label: '2min', seconds: 120 }
];

export default function renderFreeTimer(root) {
  let duration = 90;
  let rounds = 0;
  let running = false;
  let timer = null;

  root.innerHTML = `
    <div class="screen">
      <div class="screen-header">
        <button class="pill-btn" id="back">‹ Retour</button>
      </div>
      <div class="screen-body">
        <div class="headline">Timer libre</div>
        <div class="preset-grid" id="presets">
          ${PRESETS.map(
            (p) => `<button class="preset-chip ${p.seconds === duration ? 'active' : ''}" data-seconds="${p.seconds}">${p.label}</button>`
          ).join('')}
        </div>
        <div class="free-clock-wrap">
          <div class="timer-clock" id="clock">${fmt(duration)}</div>
          <div style="display:flex;gap:14px">
            <button class="circle-btn" id="minus">−</button>
            <button class="circle-btn" id="plus">+</button>
          </div>
          <div class="round-badge" id="rounds">Séries : ${rounds}</div>
        </div>
        <button class="btn btn-primary" id="go">GO ▸</button>
      </div>
    </div>
  `;

  const clockEl = root.querySelector('#clock');
  const roundsEl = root.querySelector('#rounds');
  const goBtn = root.querySelector('#go');
  const presetsWrap = root.querySelector('#presets');
  const minusBtn = root.querySelector('#minus');
  const plusBtn = root.querySelector('#plus');

  root.querySelector('#back').addEventListener('click', () => {
    stopTimer();
    navigate('/');
  });

  presetsWrap.querySelectorAll('[data-seconds]').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (running) return;
      duration = parseInt(chip.dataset.seconds, 10);
      clockEl.textContent = fmt(duration);
      presetsWrap.querySelectorAll('.preset-chip').forEach((c) => {
        c.classList.toggle('active', c === chip);
      });
    });
  });

  minusBtn.addEventListener('click', () => {
    if (running) return;
    duration = Math.max(5, duration - 5);
    clockEl.textContent = fmt(duration);
    presetsWrap.querySelectorAll('.preset-chip').forEach((c) => c.classList.remove('active'));
  });

  plusBtn.addEventListener('click', () => {
    if (running) return;
    duration += 5;
    clockEl.textContent = fmt(duration);
    presetsWrap.querySelectorAll('.preset-chip').forEach((c) => c.classList.remove('active'));
  });

  function startRound() {
    timer = new Timer({
      onTick: (remaining) => {
        clockEl.textContent = fmt(remaining);
      },
      onComplete: () => {
        rounds += 1;
        roundsEl.textContent = `Séries : ${rounds}`;
        if (running) startRound();
      }
    });
    timer.start(duration);
  }

  function stopTimer() {
    running = false;
    if (timer) timer.stop();
    goBtn.textContent = 'GO ▸';
    goBtn.classList.remove('btn-dark');
    goBtn.classList.add('btn-primary');
    clockEl.textContent = fmt(duration);
  }

  goBtn.addEventListener('click', () => {
    if (running) {
      stopTimer();
      return;
    }
    running = true;
    rounds = 0;
    roundsEl.textContent = `Séries : ${rounds}`;
    goBtn.textContent = 'Arrêter ■';
    goBtn.classList.remove('btn-primary');
    goBtn.classList.add('btn-dark');
    startRound();
  });

  return () => {
    if (timer) timer.stop();
  };
}
