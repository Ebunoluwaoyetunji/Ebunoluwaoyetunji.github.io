// A small piano made from recorded notes (public/sounds/piano/<note>.mp3).
// Browsers only allow sound after the visitor clicks, so createPiano() must be
// called from inside a click.
//
// settings: motion.piano.

export function createPiano(s) {
  // iPhones mute web sound when the phone is on silent, unless the page asks
  // to play like a music player. The visitor pressed "Sound on", so it does.
  if ('audioSession' in navigator) {
    try { navigator.audioSession.type = 'playback'; } catch { /* not supported */ }
  }
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  // Some phones only open the sound after something plays inside the click:
  // a moment of silence is enough.
  const unlock = ctx.createBufferSource();
  unlock.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  unlock.connect(ctx.destination);
  unlock.start();
  const out = ctx.createGain();
  out.gain.value = s.volume;
  // Keeps quick sweeps from getting harsh when many notes ring together.
  const soften = ctx.createDynamicsCompressor();
  soften.threshold.value = -14;
  soften.ratio.value = 4;
  out.connect(soften).connect(ctx.destination);

  const buffers = new Map();
  const base = `${import.meta.env.BASE_URL}sounds/piano/`;
  const ready = Promise.all(s.notes.map(async (note) => {
    const res = await fetch(`${base}${note}.mp3`);
    if (!res.ok) throw new Error(`Piano note not found: ${note}`);
    buffers.set(note, await ctx.decodeAudioData(await res.arrayBuffer()));
  }));

  const ringing = []; // { note, source, gain }
  const fadeOut = (v, at) => {
    v.gain.gain.cancelScheduledValues(at);
    v.gain.gain.setValueAtTime(v.gain.gain.value, at);
    v.gain.gain.linearRampToValueAtTime(0, at + s.fade);
    v.source.stop(at + s.fade + 0.02);
  };

  // loudness: 0 to 1. delay: seconds from now.
  const play = (note, loudness, delay = 0) => {
    const buffer = buffers.get(note);
    if (!buffer || ctx.state !== 'running') return;
    const at = ctx.currentTime + delay;
    // The same key struck again: the old sound stops as the new one starts.
    ringing.filter((v) => v.note === note).forEach((v) => fadeOut(v, at));
    while (ringing.length >= s.maxNotes) fadeOut(ringing.shift(), at);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = loudness;
    source.connect(gain).connect(out);
    source.start(at);
    const voice = { note, source, gain };
    ringing.push(voice);
    source.onended = () => {
      const i = ringing.indexOf(voice);
      if (i >= 0) ringing.splice(i, 1);
    };
  };

  let on = true;
  return {
    ready,
    play,
    resume: () => { on = true; return ctx.resume(); },
    pause: () => {
      on = false;
      ringing.splice(0).forEach((v) => fadeOut(v, ctx.currentTime));
      setTimeout(() => { if (!on) ctx.suspend(); }, s.fade * 1000 + 60);
    },
    close: () => ctx.close(),
  };
}
