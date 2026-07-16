const routes = {};
let currentCleanup = null;

export function registerRoute(path, renderFn) {
  routes[path] = renderFn;
}

export function navigate(path) {
  if (location.hash.slice(1) === path) {
    render();
  } else {
    location.hash = path;
  }
}

function parseHash() {
  return location.hash.slice(1) || '/';
}

function render() {
  const path = parseHash();
  const renderFn = routes[path] || routes['/'];
  const root = document.getElementById('app');

  if (typeof currentCleanup === 'function') {
    currentCleanup();
  }
  currentCleanup = null;

  const cleanup = renderFn(root);
  if (typeof cleanup === 'function') currentCleanup = cleanup;
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  render();
}
