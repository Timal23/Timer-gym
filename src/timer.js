let audioCtx;

function ensureAudioCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function beep() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // audio unsupported/blocked — non-fatal
  }
}

export function vibrate(pattern = [200, 100, 200]) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

export function fmt(totalSeconds) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export class Timer {
  constructor({ onTick, onComplete } = {}) {
    this.onTick = onTick;
    this.onComplete = onComplete;
    this.deadline = null;
    this.remaining = 0;
    this.duration = 0;
    this.running = false;
    this._timeoutId = null;
    this._wakeLock = null;
  }

  start(seconds) {
    this.duration = seconds;
    this.remaining = seconds;
    this.deadline = Date.now() + seconds * 1000;
    this.running = true;
    ensureAudioCtx();
    this._requestWakeLock();
    this._tick();
  }

  pause() {
    if (!this.running) return;
    this.running = false;
    this.remaining = Math.max(0, Math.round((this.deadline - Date.now()) / 1000));
    clearTimeout(this._timeoutId);
    this._releaseWakeLock();
  }

  resume() {
    if (this.running) return;
    this.deadline = Date.now() + this.remaining * 1000;
    this.running = true;
    this._requestWakeLock();
    this._tick();
  }

  addSeconds(delta) {
    this.deadline += delta * 1000;
    this.remaining = Math.max(0, Math.round((this.deadline - Date.now()) / 1000));
    this.duration = Math.max(this.duration + delta, this.remaining);
    if (this.onTick) this.onTick(this.remaining, this.duration);
  }

  stop() {
    this.running = false;
    clearTimeout(this._timeoutId);
    this._releaseWakeLock();
  }

  _tick = () => {
    if (!this.running) return;
    const remaining = Math.max(0, Math.round((this.deadline - Date.now()) / 1000));
    if (remaining !== this.remaining) {
      this.remaining = remaining;
      if (this.onTick) this.onTick(this.remaining, this.duration);
    }
    if (remaining <= 0) {
      this.running = false;
      this._releaseWakeLock();
      beep();
      vibrate();
      if (this.onComplete) this.onComplete();
      return;
    }
    this._timeoutId = setTimeout(this._tick, 200);
  };

  async _requestWakeLock() {
    try {
      if ('wakeLock' in navigator) {
        this._wakeLock = await navigator.wakeLock.request('screen');
      }
    } catch {
      // unsupported or denied — non-fatal
    }
  }

  _releaseWakeLock() {
    if (this._wakeLock) {
      this._wakeLock.release().catch(() => {});
      this._wakeLock = null;
    }
  }
}
