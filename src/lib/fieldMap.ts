import { createAmbience, type Ambience } from './fieldTones';

function init(): void {
  const map = document.getElementById('hs-fieldmap');
  if (!map || map.dataset.ready) return;
  map.dataset.ready = 'true';

  const pins = Array.from(map.querySelectorAll<HTMLButtonElement>('.fr-pin'));
  const pop = map.querySelector<HTMLElement>('.fr-pop');
  const popName = pop?.querySelector<HTMLElement>('.fr-pop-name');
  const popDesc = pop?.querySelector<HTMLElement>('.fr-pop-desc');
  const canvas = pop?.querySelector<HTMLCanvasElement>('.fr-wave');
  if (!pop || !popName || !popDesc || !canvas) return;

  let ctx: AudioContext | undefined;
  let amb: Ambience | undefined;
  let audioEl: HTMLAudioElement | undefined;
  let activePin: HTMLButtonElement | undefined;
  let raf = 0;

  function stopAll(): void {
    cancelAnimationFrame(raf);
    if (amb) { amb.stop(); amb = undefined; }
    if (audioEl) { audioEl.pause(); audioEl = undefined; }
    if (activePin) {
      activePin.classList.remove('is-playing');
      activePin.setAttribute('aria-pressed', 'false');
      activePin = undefined;
    }
    pop!.hidden = true;
  }

  function draw(analyser: AnalyserNode): void {
    const c = canvas!.getContext('2d');
    if (!c) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);
    const W = canvas!.width;
    const H = canvas!.height;
    const tick = (): void => {
      analyser.getByteTimeDomainData(buf);
      c.clearRect(0, 0, W, H);
      c.lineWidth = 2;
      c.strokeStyle = '#E8B04B';
      c.beginPath();
      const stepX = W / buf.length;
      for (let i = 0; i < buf.length; i++) {
        const y = (buf[i] / 255) * H;
        const x = i * stepX;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  function showPop(pin: HTMLButtonElement): void {
    popName!.textContent = pin.dataset.name ?? '';
    popDesc!.textContent = pin.dataset.desc ?? '';
    pop!.style.left = pin.style.left;
    pop!.style.top = pin.style.top;
    pop!.hidden = false;
  }

  async function playPin(pin: HTMLButtonElement): Promise<void> {
    if (!ctx) {
      const AC: typeof AudioContext =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') await ctx.resume();
    if (activePin === pin) { stopAll(); return; }
    stopAll();
    activePin = pin;
    pin.classList.add('is-playing');
    pin.setAttribute('aria-pressed', 'true');
    showPop(pin);

    const url = pin.dataset.audio;
    let analyser: AnalyserNode;
    if (url) {
      audioEl = new Audio(url);
      audioEl.loop = true;
      const node = ctx.createMediaElementSource(audioEl);
      analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      node.connect(analyser).connect(ctx.destination);
      try { await audioEl.play(); } catch { stopAll(); return; }
    } else {
      amb = createAmbience(ctx, pin.dataset.tone ?? 'wind');
      analyser = amb.analyser;
      amb.start();
    }
    draw(analyser);
  }

  pins.forEach((pin) => pin.addEventListener('click', () => void playPin(pin)));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => { for (const e of entries) if (!e.isIntersecting) stopAll(); },
      { threshold: 0 },
    );
    io.observe(map);
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('astro:page-load', init);
}
