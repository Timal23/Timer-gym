import { navigate } from '../router.js';
import { showToast } from '../toast.js';

const ITEMS = [
  { key: 'home', label: 'Accueil' },
  { key: 'timer', label: 'Timer' },
  { key: 'stats', label: 'Stats' },
  { key: 'profil', label: 'Profil' }
];

export function bottomNavHTML(active) {
  return `
    <div class="bottom-nav">
      ${ITEMS.map(
        (it) => `
        <button class="nav-item ${it.key === active ? 'active' : ''}" data-nav="${it.key}">
          <span class="dot"></span>
          <span class="label">${it.label.toUpperCase()}</span>
        </button>
      `
      ).join('')}
    </div>
  `;
}

export function bindBottomNav(root) {
  root.querySelectorAll('[data-nav]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.nav;
      if (key === 'home') navigate('/');
      else if (key === 'timer') navigate('/free');
      else showToast('Bientôt disponible');
    });
  });
}
