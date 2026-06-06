import { cardHTML, type CardVideo } from './videoCard';

interface YtPayload { videos: CardVideo[]; nowPlaying: string }

async function hydrate(): Promise<void> {
  let data: YtPayload;
  try {
    const res = await fetch('/api/youtube');
    if (!res.ok) return;
    data = (await res.json()) as YtPayload;
  } catch {
    return; // keep the build-time seed
  }
  const videos = Array.isArray(data?.videos) ? data.videos : [];
  if (videos.length) {
    document.querySelectorAll<HTMLElement>('[data-yt-grid]').forEach((grid) => {
      const limit = Number(grid.getAttribute('data-yt-limit')) || videos.length;
      grid.innerHTML = videos.slice(0, limit).map((v) => cardHTML(v)).join('');
    });
    if (data.nowPlaying) {
      document.querySelectorAll<HTMLElement>('[data-now-playing]').forEach((el) => {
        el.textContent = data.nowPlaying;
      });
    }
  }
}

hydrate();
