export function clampVolume(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.min(1, Math.max(0, n));
}

function readStoredVolume(): number {
  try {
    const raw = localStorage.getItem('hs-volume');
    if (raw === null) return 0.7;
    const n = Number(raw);
    return Number.isFinite(n) ? clampVolume(n) : 0.7;
  } catch {
    return 0.7;
  }
}

function init(): void {
  const root = document.getElementById('hs-player');
  if (!root || root.dataset.ready) return; // singleton: survive astro:page-load without rebuilding
  root.dataset.ready = 'true';

  const audio = document.getElementById('hs-audio') as HTMLAudioElement | null;
  const pill = root.querySelector<HTMLButtonElement>('.hs-listen');
  const playBtn = root.querySelector<HTMLButtonElement>('.hs-play');
  const closeBtn = root.querySelector<HTMLButtonElement>('.hs-close');
  const vol = root.querySelector<HTMLInputElement>('.hs-vol');
  const canvas = root.querySelector<HTMLCanvasElement>('.hs-wave');
  if (!audio || !pill || !playBtn || !closeBtn || !vol || !canvas) return;

  const v0 = readStoredVolume();
  audio.volume = v0;
  vol.value = String(v0);

  let ctx: AudioContext | undefined;
  let analyser: AnalyserNode | undefined;
  let raf = 0;

  function setupGraph(): void {
    if (ctx) return;
    const AC: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AC();
    const srcNode = ctx.createMediaElementSource(audio!);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    srcNode.connect(analyser);
    analyser.connect(ctx.destination);
  }

  function drawLoop(): void {
    if (!analyser || !canvas) return;
    const c = canvas.getContext('2d');
    if (!c) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const W = canvas.width;
    const H = canvas.height;
    const tick = (): void => {
      analyser!.getByteTimeDomainData(buf);
      c.clearRect(0, 0, W, H);
      c.lineWidth = 2;
      c.strokeStyle = '#E8B04B';
      c.beginPath();
      const step = W / buf.length;
      for (let i = 0; i < buf.length; i++) {
        const y = (buf[i] / 255) * H;
        const x = i * step;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function setPlaying(on: boolean): void {
    root!.classList.toggle('hs-playing', on);
    playBtn!.setAttribute('aria-pressed', String(on));
    playBtn!.setAttribute('aria-label', on ? 'Pause' : 'Play');
  }

  async function play(): Promise<void> {
    try {
      setupGraph();
      if (ctx && ctx.state === 'suspended') await ctx.resume();
      await audio!.play();
      setPlaying(true);
      cancelAnimationFrame(raf);
      drawLoop();
    } catch {
      setPlaying(false);
      root!.classList.remove('hs-open'); // failed (missing file / blocked) → back to pill
    }
  }
  function pause(): void {
    audio!.pause();
    setPlaying(false);
    cancelAnimationFrame(raf);
  }

  pill.addEventListener('click', () => { root.classList.add('hs-open'); void play(); });
  playBtn.addEventListener('click', () => { void (audio.paused ? play() : Promise.resolve(pause())); });
  closeBtn.addEventListener('click', () => { pause(); root.classList.remove('hs-open'); });
  vol.addEventListener('input', () => {
    const v = clampVolume(Number(vol.value));
    audio.volume = v;
    try { localStorage.setItem('hs-volume', String(v)); } catch { /* ignore */ }
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', init);
}
