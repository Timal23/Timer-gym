import './style.css';
import { applyTheme } from './state.js';
import { registerRoute, startRouter } from './router.js';
import renderHome from './views/home.js';
import renderWorkout from './views/workout.js';
import renderRest from './views/rest.js';
import renderFreeTimer from './views/freeTimer.js';
import renderSummary from './views/summary.js';

registerRoute('/', renderHome);
registerRoute('/workout', renderWorkout);
registerRoute('/rest', renderRest);
registerRoute('/free', renderFreeTimer);
registerRoute('/summary', renderSummary);

applyTheme();
startRouter();
