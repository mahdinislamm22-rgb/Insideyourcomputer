// Synthesized ambient sci-fi sound engine — no audio assets needed.
class AmbientEngine {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.enabled = false;
  }

  _build() {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    // Deep drone: two detuned oscillators through a lowpass filter
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.connect(this.master);

    const osc1 = this.ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.value = 55;
    const osc2 = this.ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.value = 110.4;
    const g1 = this.ctx.createGain();
    g1.gain.value = 0.5;
    const g2 = this.ctx.createGain();
    g2.gain.value = 0.12;
    osc1.connect(g1).connect(filter);
    osc2.connect(g2).connect(filter);
    osc1.start();
    osc2.start();

    // Slow breathing LFO on the filter
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 140;
    lfo.connect(lfoGain).connect(filter.frequency);
    lfo.start();

    // Faint airy noise
    const len = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.15;
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 2400;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.05;
    noise.connect(noiseFilter).connect(noiseGain).connect(this.master);
    noise.start();
  }

  toggle() {
    if (!this.ctx) this._build();
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.enabled = !this.enabled;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.linearRampToValueAtTime(this.enabled ? 0.06 : 0, t + 0.8);
    return this.enabled;
  }

  click(freq = 1400) {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    osc.type = "square";
    osc.frequency.value = freq;
    const g = this.ctx.createGain();
    const t = this.ctx.currentTime;
    g.gain.setValueAtTime(0.04, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
    osc.connect(g).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.09);
  }

  whoosh() {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    const t = this.ctx.currentTime;
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 1.1);
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(3000, t + 1.1);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.05, t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.3);
    osc.connect(f).connect(g).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 1.4);
  }
}

export const audio = new AmbientEngine();
