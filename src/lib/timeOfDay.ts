export type Phase = 'dawn' | 'day' | 'dusk' | 'night';
export type TodSetting = 'auto' | Phase;

export function phaseForHour(hour: number): Phase {
  if (hour >= 5 && hour <= 8) return 'dawn';
  if (hour >= 9 && hour <= 16) return 'day';
  if (hour >= 17 && hour <= 20) return 'dusk';
  return 'night';
}

export function resolveTod(stored: string | null, hour: number): Phase {
  if (stored === 'dawn' || stored === 'day' || stored === 'dusk' || stored === 'night') return stored;
  return phaseForHour(hour);
}

export function nextSetting(current: TodSetting): TodSetting {
  const order: TodSetting[] = ['auto', 'dawn', 'day', 'dusk', 'night'];
  const i = order.indexOf(current);
  return order[(i + 1) % order.length] ?? 'auto';
}

// Inline, render-blocking IIFE (like themeInitScript). Sets data-tod before first paint.
// Thresholds are duplicated here as inline JS; the test guards against silent drift.
export const todInitScript = `(function(){try{var s=localStorage.getItem('hs-tod');
var p=(s==='dawn'||s==='day'||s==='dusk'||s==='night')?s:(function(h){return h>=5&&h<=8?'dawn':h>=9&&h<=16?'day':h>=17&&h<=20?'dusk':'night';})(new Date().getHours());
document.documentElement.setAttribute('data-tod',p);}catch(e){document.documentElement.setAttribute('data-tod','dusk');}})();`;
