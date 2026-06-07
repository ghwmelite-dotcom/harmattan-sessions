export type Tone = 'surf' | 'hum' | 'wind' | 'street' | 'rain';

export interface ToneConfig {
  filter: BiquadFilterType;
  freq: number;
  q: number;
  lfoRate: number;   // Hz — slow gain modulation
  lfoDepth: number;  // 0..1 — portion of gain swung by the LFO
  gain: number;      // base output level
  drone?: number;    // optional low sine (Hz)
}

export const TONE_CONFIG: Record<Tone, ToneConfig> = {
  surf:   { filter: 'lowpass',  freq: 600,  q: 0.7, lfoRate: 0.16, lfoDepth: 0.7,  gain: 0.5 },
  hum:    { filter: 'bandpass', freq: 420,  q: 0.8, lfoRate: 0.5,  lfoDepth: 0.3,  gain: 0.4, drone: 70 },
  wind:   { filter: 'highpass', freq: 1200, q: 0.6, lfoRate: 0.12, lfoDepth: 0.8,  gain: 0.35 },
  street: { filter: 'bandpass', freq: 900,  q: 0.9, lfoRate: 0.7,  lfoDepth: 0.35, gain: 0.35, drone: 110 },
  rain:   { filter: 'highpass', freq: 3000, q: 0.5, lfoRate: 1.4,  lfoDepth: 0.5,  gain: 0.28, drone: 90 },
};

export function toneConfig(key: string): ToneConfig {
  return (TONE_CONFIG as Record<string, ToneConfig>)[key] ?? TONE_CONFIG.wind;
}

let noiseBuffer: AudioBuffer | undefined;
function getNoise(ctx: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ctx.sampleRate) return noiseBuffer;
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  noiseBuffer = buf;
  return buf;
}

export interface Ambience {
  analyser: AnalyserNode;
  start(): void;
  stop(): void;
}

export function createAmbience(ctx: AudioContext, key: string): Ambience {
  const cfg = toneConfig(key);
  const src = ctx.createBufferSource();
  src.buffer = getNoise(ctx);
  src.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = cfg.filter;
  filter.frequency.value = cfg.freq;
  filter.Q.value = cfg.q;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = cfg.lfoRate;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = cfg.gain * cfg.lfoDepth;
  lfo.connect(lfoGain).connect(gain.gain);
  const analyser = ctx.createAnalyser();
  analyser.fftSize = 2048;
  src.connect(filter).connect(gain).connect(analyser).connect(ctx.destination);

  let drone: OscillatorNode | undefined;
  let droneGain: GainNode | undefined;
  if (cfg.drone) {
    drone = ctx.createOscillator();
    drone.type = 'sine';
    drone.frequency.value = cfg.drone;
    droneGain = ctx.createGain();
    droneGain.gain.value = 0;
    drone.connect(droneGain).connect(analyser);
  }

  const base = cfg.gain * (1 - cfg.lfoDepth);
  return {
    analyser,
    start() {
      const t = ctx.currentTime;
      src.start();
      lfo.start();
      drone?.start();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(base, t + 0.4);
      if (droneGain) droneGain.gain.linearRampToValueAtTime(cfg.gain * 0.25, t + 0.6);
    },
    stop() {
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.linearRampToValueAtTime(0, t + 0.25);
      if (droneGain) {
        droneGain.gain.cancelScheduledValues(t);
        droneGain.gain.linearRampToValueAtTime(0, t + 0.25);
      }
      const stopAt = t + 0.3;
      try { src.stop(stopAt); lfo.stop(stopAt); drone?.stop(stopAt); } catch { /* already stopped */ }
    },
  };
}
