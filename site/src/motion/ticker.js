// A frame loop that only runs while an effect is moving, so the page is idle
// (and costs nothing) when everything has settled.
// step(dt) is called every frame with the time since the last frame in ms.
// It returns true while there is still movement, false once settled.
export function createTicker(step) {
  let raf = 0;
  let last = 0;
  const frame = (now) => {
    const dt = Math.min(64, last ? now - last : 16.7);
    last = now;
    raf = step(dt) ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  };
  return {
    wake() {
      if (!raf) raf = requestAnimationFrame(frame);
    },
    stop() {
      cancelAnimationFrame(raf);
      raf = 0;
      last = 0;
    },
  };
}

// Eases a value toward its target by a per-frame rate, corrected for frame
// time so the feel is the same at 60Hz and 120Hz.
export function approach(value, target, rate, dt) {
  const k = 1 - Math.pow(1 - rate, dt / 16.7);
  return value + (target - value) * k;
}

// 1 at the centre, falling smoothly to 0 at the radius.
export function falloff(distance, radius) {
  const t = Math.abs(distance) / radius;
  return t >= 1 ? 0 : 0.5 + 0.5 * Math.cos(Math.PI * t);
}
