let toastEl;
let hideTimeoutId;

export function showToast(message) {
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.className = 'toast';
    document.body.appendChild(toastEl);
  }
  toastEl.textContent = message;
  toastEl.classList.add('show');
  clearTimeout(hideTimeoutId);
  hideTimeoutId = setTimeout(() => toastEl.classList.remove('show'), 1800);
}
