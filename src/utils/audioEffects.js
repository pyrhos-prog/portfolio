// Web Audio API Synthesizer for retro terminal sound effects
class SoundFX {
  constructor() {
    this.enabled = localStorage.getItem('term_audio') === 'true';
    this.ctx = null;
  }

  initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('term_audio', this.enabled ? 'true' : 'false');
    if (this.enabled) {
      this.initCtx();
      this.beep(880, 0.05, 'sine');
    }
    return this.enabled;
  }

  beep(freq = 600, duration = 0.04, type = 'sine', volume = 0.03) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked before first user gesture
    }
  }

  key() {
    // Subtle typewriter click
    this.beep(1200 + Math.random() * 400, 0.015, 'triangle', 0.015);
  }

  enter() {
    this.beep(520, 0.06, 'square', 0.025);
  }

  error() {
    this.beep(220, 0.12, 'sawtooth', 0.03);
  }

  success() {
    if (!this.enabled) return;
    this.beep(659.25, 0.05, 'sine', 0.03);
    setTimeout(() => this.beep(880, 0.08, 'sine', 0.03), 60);
  }
}

export const soundFx = new SoundFX();
