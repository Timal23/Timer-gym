import { getState, setState } from '../state.js';
import { navigate } from '../router.js';
import { showToast } from '../toast.js';

function fmtDuration(ms) {
  const totalSec = Math.round(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function renderSummary(root) {
  const state = getState();
  const summary = state.lastSummary;
  if (!summary) {
    navigate('/');
    return;
  }

  root.innerHTML = `
    <div class="screen screen--dark">
      <div class="screen-body">
        <div class="eyebrow" style="letter-spacing:3px">💪 Terminé</div>
        <div class="headline" style="color:var(--accent);font-size:52px;margin-top:20px">Séance<br>bouclée</div>
        <div style="display:flex;flex-direction:column;gap:12px;margin-top:10px">
          <div class="summary-row"><span class="label">Durée</span><span class="value">${fmtDuration(summary.durationMs)}</span></div>
          <div class="summary-row"><span class="label">Séries</span><span class="value">${summary.sets}</span></div>
        </div>
        <div class="streak-card">
          <span class="fire">🔥</span>
          <div>
            <div class="n">${summary.streak} jour${summary.streak > 1 ? 's' : ''}</div>
            <div class="sub">D'affilée${summary.streak > 1 ? ' — bravo !' : ''}</div>
          </div>
        </div>
        <div style="margin-top:20px;display:flex;flex-direction:column;gap:12px">
          <button class="btn btn-primary" id="home">Retour accueil</button>
          <button class="btn btn-ghost" id="recap" style="border-color:var(--bg)">Récap détaillé</button>
        </div>
      </div>
    </div>
  `;

  root.querySelector('#home').addEventListener('click', () => {
    setState((s) => ({ ...s, lastSummary: null }));
    navigate('/');
  });

  root.querySelector('#recap').addEventListener('click', () => showToast('Bientôt disponible'));
}
