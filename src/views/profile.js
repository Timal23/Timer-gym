import { getState, setProfile, setOneRM } from '../state.js';
import { EQUIPMENT_MAISON } from '../programs.js';
import { fmtKg } from '../oneRm.js';
import { bottomNavHTML, bindBottomNav } from '../components/bottomNav.js';

const SEXES = [
  { id: 'homme', label: 'Homme' },
  { id: 'femme', label: 'Femme' },
  { id: 'autre', label: 'Autre' }
];

const GOALS = [
  { id: 'force', label: 'Force' },
  { id: 'hypertrophie', label: 'Muscle' },
  { id: 'seche', label: 'Sèche' }
];

function numOrNull(v) {
  if (v === '' || v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export default function renderProfile(root) {
  const state = getState();
  const p = state.profile;
  const oneRMEntries = Object.entries(p.oneRM || {}).sort((a, b) => a[0].localeCompare(b[0]));

  root.innerHTML = `
    <div class="screen">
      <div class="screen-header">
        <span class="screen-title">Mon profil</span>
      </div>
      <div class="screen-body">
        <div>
          <div class="eyebrow">Ton compte</div>
          <div class="headline headline--sm">${p.name ? `Salut ${p.name} 👋` : 'Crée ton profil'}</div>
          <div class="subtext">Tes infos et tes 1RM restent sur cet appareil. Elles servent à te conseiller un poids de travail sur chaque exercice.</div>
        </div>

        <div class="form-list">
          <div class="field">
            <label for="pf-name">Nom / pseudo</label>
            <input class="text-input" id="pf-name" type="text" autocomplete="name" placeholder="Ton nom" value="${p.name || ''}" data-field="name" />
          </div>

          <div class="field-row">
            <div class="field">
              <label for="pf-bw">Poids de corps (kg)</label>
              <input class="text-input" id="pf-bw" type="number" inputmode="decimal" step="0.5" min="0" placeholder="—" value="${p.bodyweight ?? ''}" data-field="bodyweight" data-num />
            </div>
            <div class="field">
              <label for="pf-height">Taille (cm)</label>
              <input class="text-input" id="pf-height" type="number" inputmode="numeric" min="0" placeholder="—" value="${p.height ?? ''}" data-field="height" data-num />
            </div>
            <div class="field">
              <label for="pf-age">Âge</label>
              <input class="text-input" id="pf-age" type="number" inputmode="numeric" min="0" placeholder="—" value="${p.age ?? ''}" data-field="age" data-num />
            </div>
          </div>

          <div class="field">
            <label>Sexe</label>
            <div class="tabs">
              ${SEXES.map((s) => `<button class="tab ${s.id === p.sex ? 'active' : ''}" data-sex="${s.id}">${s.label}</button>`).join('')}
            </div>
          </div>

          <div class="field">
            <label>Objectif</label>
            <div class="tabs">
              ${GOALS.map((g) => `<button class="tab ${g.id === p.goal ? 'active' : ''}" data-goal="${g.id}">${g.label}</button>`).join('')}
            </div>
          </div>

          <div class="field">
            <label>Matériel à la maison</label>
            <div class="subtext" style="margin:-2px 0 8px">Décoche ce que tu n'as pas : le mode Maison ne te proposera que des exercices réalisables.</div>
            <div class="equip-grid">
              ${EQUIPMENT_MAISON.map((tag) => {
                const on = p.equipment?.[tag];
                return `<button class="equip-chip ${on ? 'checked' : ''}" data-equip="${tag}">
                  <span class="equip-mark">${on ? '✓' : ''}</span>
                  <span class="equip-name">${tag}</span>
                </button>`;
              }).join('')}
            </div>
          </div>
        </div>

        <div>
          <div class="eyebrow">Mes 1RM enregistrés</div>
          ${
            oneRMEntries.length
              ? `<div class="onerm-list">
                  ${oneRMEntries
                    .map(
                      ([name, kg]) => `
                    <div class="onerm-row">
                      <span class="nm">${name}</span>
                      <input class="text-input onerm-input" type="number" inputmode="decimal" step="2.5" min="0" value="${fmtKg(kg)}" data-onerm="${encodeURIComponent(name)}" />
                      <span class="unit">kg</span>
                      <button class="onerm-del" data-del="${encodeURIComponent(name)}" aria-label="Supprimer">✕</button>
                    </div>`
                    )
                    .join('')}
                </div>`
              : `<div class="subtext">Aucun 1RM pour l'instant. Ouvre un exercice pendant une séance et appuie sur « Définir mon 1RM » : il apparaîtra ici et l'app te conseillera un poids.</div>`
          }
        </div>
      </div>
      ${bottomNavHTML('profil')}
    </div>
  `;

  // Champs texte / numériques : on persiste à la volée sans re-render (préserve le focus).
  root.querySelectorAll('[data-field]').forEach((input) => {
    input.addEventListener('input', () => {
      const key = input.dataset.field;
      const value = input.hasAttribute('data-num') ? numOrNull(input.value) : input.value;
      setProfile({ [key]: value });
    });
  });

  root.querySelectorAll('[data-sex]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setProfile({ sex: btn.dataset.sex === state.profile.sex ? '' : btn.dataset.sex });
      renderProfile(root);
    });
  });

  root.querySelectorAll('[data-goal]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setProfile({ goal: btn.dataset.goal === state.profile.goal ? '' : btn.dataset.goal });
      renderProfile(root);
    });
  });

  root.querySelectorAll('[data-equip]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const tag = btn.dataset.equip;
      const equipment = getState().profile.equipment || {};
      setProfile({ equipment: { ...equipment, [tag]: !equipment[tag] } });
      renderProfile(root);
    });
  });

  root.querySelectorAll('[data-onerm]').forEach((input) => {
    input.addEventListener('change', () => {
      setOneRM(decodeURIComponent(input.dataset.onerm), input.value);
    });
  });

  root.querySelectorAll('[data-del]').forEach((btn) => {
    btn.addEventListener('click', () => {
      setOneRM(decodeURIComponent(btn.dataset.del), null);
      renderProfile(root);
    });
  });

  bindBottomNav(root);
}
