// Procedural Web Audio API Space Sound Synthesizer
// Generates deep atmospheric space drone, subtle orbital resonances, and technical UI clicks

class SpaceAudioSystem {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private masterGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private listeners: Set<(playing: boolean) => void> = new Set();

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  public subscribe(cb: (playing: boolean) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isPlaying));
  }

  public getStatus() {
    return this.isPlaying;
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public start() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      if (this.isPlaying) return;

      const now = this.ctx.currentTime;

      // Master output gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, now);
      this.masterGain.gain.linearRampToValueAtTime(0.35, now + 3.0);
      this.masterGain.connect(this.ctx.destination);

      // Low-pass resonance filter for deep cinematic space feel
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.setValueAtTime(140, now);
      this.filter.Q.setValueAtTime(4.0, now);
      this.filter.connect(this.masterGain);

      // 1. Deep Sub Drone (55 Hz - A1)
      this.subOsc = this.ctx.createOscillator();
      this.subOsc.type = 'sine';
      this.subOsc.frequency.setValueAtTime(55, now);
      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.6, now);
      this.subOsc.connect(subGain);
      subGain.connect(this.filter);
      this.subOsc.start();

      // 2. Harmonic Drone (110 Hz - A2) with subtle detune
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(110, now);
      this.droneOsc1.detune.setValueAtTime(-4, now);
      const osc1Gain = this.ctx.createGain();
      osc1Gain.gain.setValueAtTime(0.2, now);
      this.droneOsc1.connect(osc1Gain);
      osc1Gain.connect(this.filter);
      this.droneOsc1.start();

      // 3. Shimmer Drone (165 Hz - E3) with subtle detune
      this.droneOsc2 = this.ctx.createOscillator();
      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(164.81, now);
      this.droneOsc2.detune.setValueAtTime(5, now);
      const osc2Gain = this.ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.18, now);
      this.droneOsc2.connect(osc2Gain);
      osc2Gain.connect(this.filter);
      this.droneOsc2.start();

      // 4. Subtle Solar Wind Pink/White Noise
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.04;
      }
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(260, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      this.noiseNode.connect(noiseFilter);
      noiseFilter.connect(this.masterGain);
      this.noiseNode.start();

      this.isPlaying = true;
      this.notify();
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  public stop() {
    if (!this.ctx || !this.isPlaying) return;
    const now = this.ctx.currentTime;
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(0.001, now + 1.2);
    }
    setTimeout(() => {
      try {
        this.subOsc?.stop();
        this.droneOsc1?.stop();
        this.droneOsc2?.stop();
        this.noiseNode?.stop();
      } catch {}
      this.isPlaying = false;
      this.notify();
    }, 1200);
  }

  // Technical UI telemetry blip sound
  public playTelemetryClick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }
}

export const spaceAudio = new SpaceAudioSystem();
