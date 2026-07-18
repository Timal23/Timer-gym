import { getState, setState, startSession } from '../state.js';
import { PROGRAM_IDS, LEVELS, getProgramMeta, resolveExercises } from '../programs.js';
import { navigate } from '../router.js';
import { bottomNavHTML, bindBottomNav } from '../components/bottomNav.js';

const MODES = ['Salle', 'Maison', 'PDC'];

export default function renderHome(root) {
  const state = getState();

  const programs = PROGRAM_IDS.map((id) => {
    const meta = getProgramMeta(id);
    const count = resolveExercises(state.mode, id, state.level).length;
    return { id, ...meta, count };
  });

  root.innerHTML = `
    <div class="screen">
      <div class="screen-body">
        <div>
          <div class="eyebrow">Prêt à charger</div>
          <div class="headline">Choisis ton prog.</div>
        </div>
        <div class="tabs">
          ${MODES.map((m) => `<button class="tab ${m === state.mode ? 'active' : ''}" data-mode="${m}">${m}</button>`).join('')}
        </div>
        <div class="tabs">
          ${LEVELS.map((l) => `<button class="tab ${l.id === state.level ? 'active' : ''}" data-level="${l.id}">${l.label}</button>`).join('')}
        </div>
        <div class="card-list">
          ${programs
            .map(
              (p, i) => `
            <button class="program-card ${i === 0 ? 'is-accent' : ''}" data-program="${p.id}">
              <div>
                <div class="name">${p.label}</div>
                <div class="muscles">${p.muscles}</div>
              </div>
              <div class="count">
                <div class="n">${p.count}</div>
                <div class="label">exos</div>
              </div>
            </button>
          `
            )
            .join('')}
          <button class="free-timer-card" data-free>+ Timer libre</button>
        </div>
      </div>
      ${bottomNavHTML('home')}
    </div>
  `;

  root.querySelectorAll('[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setState({ mode: btn.dataset.mode });
      renderHome(root);
    });
  });

  root.querySelectorAll('[data-level]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setState({ level: btn.dataset.level });
      renderHome(root);
    });
  });

  root.querySelectorAll('[data-program]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const programId = btn.dataset.program;
      const current = getState();
      const exercises = resolveExercises(current.mode, programId, current.level);
      startSession(programId, current.mode, exercises);
      navigate('/workout');
    });
  });

  root.querySelector('[data-free]').addEventListener('click', () => navigate('/free'));

  bindBottomNav(root);
}
