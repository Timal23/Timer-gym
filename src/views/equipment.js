import { getState, setState, startSession } from '../state.js';
import { navigate } from '../router.js';
import { EQUIPMENT_MAISON, EQUIPMENT_PDC, resolveExercises } from '../programs.js';

const CONFIG = {
  Maison: {
    stateKey: 'equipmentMaison',
    items: EQUIPMENT_MAISON,
    eyebrow: 'Mode Maison',
    title: 'Ton matériel',
    subtext: 'Coche ce que tu as sous la main.'
  },
  PDC: {
    stateKey: 'equipmentPdc',
    items: EQUIPMENT_PDC,
    eyebrow: 'Poids du corps',
    title: 'Équipement extérieur',
    subtext: "As-tu accès à une barre de traction ou des barres parallèles (extérieur, park, etc.) ? Sinon, c'est 100% poids du corps."
  }
};

export default function renderEquipment(root) {
  const state = getState();
  const mode = state.pendingMode || 'Maison';
  const config = CONFIG[mode];
  const equipment = state[config.stateKey];

  root.innerHTML = `
    <div class="screen">
      <div class="screen-header">
        <button class="pill-btn" id="back">‹ Retour</button>
      </div>
      <div class="screen-body">
        <div>
          <div class="eyebrow">${config.eyebrow}</div>
          <div class="headline">${config.title}</div>
          <div class="subtext">${config.subtext}</div>
        </div>
        <div class="card-list">
          ${config.items
            .map(
              (name) => `
            <button class="check-item" data-item="${name}">
              <span class="check-mark ${equipment[name] ? 'checked' : ''}">${equipment[name] ? '✓' : ''}</span>
              <span class="name">${name}</span>
            </button>
          `
            )
            .join('')}
        </div>
        <button class="btn btn-primary" style="margin-top:auto" id="validate">Valider</button>
      </div>
    </div>
  `;

  root.querySelector('#back').addEventListener('click', () => navigate('/'));

  root.querySelectorAll('[data-item]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.item;
      setState((s) => ({ ...s, [config.stateKey]: { ...s[config.stateKey], [name]: !s[config.stateKey][name] } }));
      renderEquipment(root);
    });
  });

  root.querySelector('#validate').addEventListener('click', () => {
    const current = getState();
    if (current.pendingProgramId) {
      const exercises = resolveExercises(mode, current.pendingProgramId, current[config.stateKey]);
      startSession(current.pendingProgramId, mode, exercises);
      navigate('/workout');
    } else {
      navigate('/');
    }
  });
}
