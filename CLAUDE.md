# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (add `-- --host` to expose it on the local network for testing on a phone).
- `npm run build` — production build. **Do not change this to a plain `vite build`** — it runs `scripts/build.mjs`, which redirects `TMPDIR`/`TEMP`/`TMP` to a project-local `.vite-tmp` directory before invoking Vite. This works around a real bug on this machine: `vite-plugin-pwa`'s `generateSW` step bundles the service worker via Rollup inside the OS temp dir, and Rollup's module-resolution walk-up hits a stray, non-JSON `package.json` sitting directly in the Windows Temp folder (unrelated tooling, not part of this project), which crashes the build with a JSON parse error. If the build ever fails with `Unable to write the service worker file... is not valid JSON`, this is why — fix it by keeping/adjusting the temp-dir redirect, not by fighting Rollup.
- `npm run preview` — serve the production build locally.
- `npm run generate-pwa-assets` — regenerate all PWA icon sizes (`public/pwa-*.png`, `maskable-icon-512x512.png`, `apple-touch-icon-180x180.png`, `favicon.ico`) from `public/logo.svg` via `@vite-pwa/assets-generator`. Run this after changing `public/logo.svg`.

There is no test suite and no linter configured.

## Deployment

Static site on GitHub (`Timal23/Timer-gym`, branch `main`) auto-deployed by Netlify (build command `npm run build`, publish directory `dist`). Pushing to `main` triggers a redeploy.

## Architecture

Vanilla JS + Vite PWA — no framework, no bundler-managed component tree. Each screen is a plain function that strings together an HTML template and manually wires `addEventListener` calls; there is no virtual DOM, so re-rendering a view means fully rebuilding its `innerHTML` and re-binding listeners (see any file in `src/views/`).

**Router** (`src/router.js`): a minimal hash router. `registerRoute(path, renderFn)` maps a path to a view function; `navigate(path)` sets `location.hash`. On every `hashchange` the router clears `#app`, calls the matching `renderFn(root)`, and — critically — first invokes the *previous* view's returned cleanup function if it had one. Views that own a running `Timer` (`rest.js`, `freeTimer.js`) return a cleanup closure that calls `timer.stop()`; forgetting this on a new timer-owning view will leak intervals/wake locks across navigations.

**State** (`src/state.js`): a single in-memory object persisted to `localStorage` (`gymtimer:v1`) on every `setState`. No reducer/actions — `setState` takes either a patch object or `(prevState) => nextState`. Holds: current `mode` (`Salle`/`Maison`/`PDC`), current `level` (`deb`/`int`/`exp`), the in-progress workout `session`, `lastSummary` (read once by the summary screen then cleared), and `history` (streak tracking). `subscribe()` exists but nothing currently uses it — views re-render by calling their own render function directly after a state change, not via subscription.

**Program data & session resolution** (`src/programs.js`) — the core domain logic, spanning `home.js`, `workout.js`, and `rest.js`:
- The program is a fixed Push/Pull/Legs plan keyed `PROGRAM[location][day][level]` (`location` is `salle`/`maison`/`pdc`, mapped from `state.mode` via `MODE_TO_LOCATION`; `level` is `deb`/`int`/`exp`, straight from `state.level`). There is no per-item equipment filtering — each location/day/level combination is a hand-authored, fixed exercise list.
- `resolveExercises(mode, programId, level)` builds the full session list by concatenating, in order: warm-up steps (`WARMUPS[programId]`, turned into single-set pseudo-exercises with a fixed 20s rest so they flow through the normal workout/rest screens like any other exercise), the day's main lifts (`PROGRAM[location][programId][level]`), and that day's dedicated ab exercises (`ABS[programId]`). Each raw entry's `sets` string (e.g. `"4 × 6-8/jambe"`) is parsed by `parseSets()` into a numeric `sets` count and a free-text `reps` string; `rest` is flattened from `{sec, label}` down to plain seconds.
- The resolved exercise array is computed *once*, at session start, and stored directly on `session.exercises` — `workout.js`/`rest.js` read from `session.exercises`, never from `programs.js` directly.
- `home.js` also calls `resolveExercises` purely to show a live "N exos" count per program card (this count includes warm-up + abs entries, not just the main lifts).

**Session flow** (state machine spanning `home.js` → `workout.js` → `rest.js` → `summary.js`):
- Home has two independent tab rows — mode (Salle/Maison/PDC) and level (Débutant/Intermédiaire/Expert) — both stored directly on `state`. Picking a program card calls `resolveExercises(state.mode, programId, state.level)` then `startSession()` immediately; there is no intermediate equipment-checklist screen.
- Completing a set in `workout.js` doesn't advance `exerciseIndex`/`setIndex` immediately — it computes the *next* position into `session.nextExerciseIndex`/`session.nextSetIndex` and `session.restDuration`, then navigates to `/rest`. The rest screen's `Timer` applies that pending position to `exerciseIndex`/`setIndex` only on completion or skip. This indirection exists so the rest countdown always knows the upcoming set for its "prochaine série" preview.
- Finishing the last set of the last exercise skips `/rest` entirely, calls `recordWorkoutCompleted()` (streak logic in `state.js`), writes `lastSummary`, and clears `session`.

**Timer engine** (`src/timer.js`): a single `Timer` class shared by `rest.js` and `freeTimer.js`. It's deadline-based (`Date.now() + seconds*1000`), not a naive decrementing counter, so it can't drift under `setTimeout` jitter and survives tab throttling. On completion it fires a Web Audio beep, `navigator.vibrate`, and releases a Screen Wake Lock it acquired in `start()` — all best-effort (wrapped in try/catch, since Safari/iOS lacks Wake Lock and vibration support).
