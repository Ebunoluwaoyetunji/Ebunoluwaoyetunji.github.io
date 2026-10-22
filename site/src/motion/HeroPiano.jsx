import { useEffect, useRef, useState } from 'react';
import { createPiano } from './piano.js';

// Piano notes in the hero: each letter of the heading plays one note when the
// mouse passes over it. Notes rise from left to right on a 5-note scale, so
// any sweep sounds in tune. The top line starts a little higher.
//
// On touch screens a tap plays the letter under the finger and a sideways
// slide plays each letter it crosses. A swipe up or down (scrolling) plays
// nothing.
//
// Sound is off until the visitor turns it on with the small "Sound" switch
// (browsers also need that click before any sound). It is not remembered:
// every visit starts silent.
//
// Which letter is under the pointer is read from the letters' resting places,
// not from where Spread has pushed them, so parting letters never re-strike.
//
// headingId: the Spread heading. settings: motion.piano.

export default function HeroPiano({ headingId, settings: s }) {
  const [sound, setSound] = useState('off'); // 'off' | 'loading' | 'on'
  const piano = useRef(null);

  // Close the sound when the page goes away.
  useEffect(() => () => { piano.current?.close(); piano.current = null; }, []);

  const toggle = async () => {
    if (sound === 'loading') return;
    if (sound === 'on') {
      piano.current.pause();
      setSound('off');
      return;
    }
    if (!piano.current) piano.current = createPiano(s);
    setSound('loading');
    try {
      await piano.current.resume();
      await piano.current.ready;
      setSound('on');
    } catch (err) {
      console.error(err);
      piano.current?.close();
      piano.current = null;
      setSound('off');
    }
  };

  // Play a note each time the pointer moves onto a new letter.
  useEffect(() => {
    if (sound !== 'on') return undefined;
    const heading = document.getElementById(headingId);
    if (!heading) return undefined;
    const area = heading.closest('section') || heading;
    let last = null; // { line, index }
    let lastTime = 0;

    const letterAt = (e) => {
      const lines = [...heading.querySelectorAll('.big__line')];
      for (let li = 0; li < lines.length; li++) {
        const r = lines[li].getBoundingClientRect();
        if (e.clientY < r.top || e.clientY >= r.bottom) continue;
        const x = e.clientX - r.left;
        const letters = [...lines[li].querySelectorAll(':scope > .l')];
        const index = letters.findIndex((l) => x >= l.offsetLeft && x < l.offsetLeft + l.offsetWidth);
        return index < 0 ? null : { line: li, index, letters };
      }
      return null;
    };

    // The note for a letter: its place among the letters of its line (spaces
    // do not count), moved up by where that line starts.
    const noteFor = (line, index, letters) => {
      let place = 0;
      for (let i = 0; i < index; i++) if (letters[i].textContent.trim()) place++;
      const step = Math.min(s.notes.length - 1, (s.lineStart[line] || 0) + place);
      return s.notes[step];
    };

    const strike = (line, index, letters, delay, quick) => {
      const ch = letters[index].querySelector('.l__glyph')?.textContent ?? letters[index].textContent;
      if (!ch.trim()) return; // a space is a rest
      const loud = (quick ? s.runVolume : 1) * (1 - s.humanise / 2 + Math.random() * s.humanise);
      piano.current.play(noteFor(line, index, letters), loud, delay);
    };

    const onMove = (e) => {
      const hit = letterAt(e);
      if (!hit) { last = null; return; }
      if (last && last.line === hit.line && last.index === hit.index) return;
      const now = performance.now() / 1000;
      const quick = now - lastTime < s.runGap;
      // A quick sweep can jump over letters between two mouse events: play
      // the ones it skipped too, a moment apart, like a run on the keys.
      if (last && last.line === hit.line && Math.abs(hit.index - last.index) > 1) {
        const dir = Math.sign(hit.index - last.index);
        const skipped = [];
        for (let i = last.index + dir; i !== hit.index; i += dir) skipped.push(i);
        skipped.slice(-s.maxSkipped).forEach((i, k) => strike(hit.line, i, hit.letters, k * s.runSpacing, true));
        strike(hit.line, hit.index, hit.letters, Math.min(skipped.length, s.maxSkipped) * s.runSpacing, true);
      } else {
        strike(hit.line, hit.index, hit.letters, 0, quick);
      }
      last = { line: hit.line, index: hit.index };
      lastTime = now;
    };
    // A finger: wait to see what it does. A tap plays the letter when the
    // finger lifts; a sideways slide plays from the first letter on; a scroll
    // (the browser cancels the touch) plays nothing.
    let touch = null; // { x, y, sliding, scrolling, down }
    const isFinger = (e) => e.pointerType !== 'mouse';
    const onDown = (e) => {
      if (!isFinger(e)) return;
      last = null;
      touch = { x: e.clientX, y: e.clientY, sliding: false, scrolling: false, down: e };
    };
    const onFingerMove = (e) => {
      if (!touch) return;
      if (!touch.sliding) {
        const dx = Math.abs(e.clientX - touch.x), dy = Math.abs(e.clientY - touch.y);
        if (dy >= s.slideStart && dy > dx) touch.scrolling = true;
        if (touch.scrolling || dx < s.slideStart || dx < dy) return;
        touch.sliding = true;
        onMove(touch.down);
      }
      onMove(e);
    };
    const onUp = (e) => {
      if (!isFinger(e) || !touch) return;
      if (touch.sliding) onMove(e); // the letter where the finger lifts
      else if (!touch.scrolling) onMove(touch.down);
      touch = null;
      last = null;
    };
    const onCancel = () => { touch = null; last = null; };
    const onPointerMove = (e) => (isFinger(e) ? onFingerMove(e) : onMove(e));
    const onLeave = (e) => { if (!isFinger(e)) last = null; };
    area.addEventListener('pointermove', onPointerMove);
    area.addEventListener('pointerdown', onDown);
    area.addEventListener('pointerup', onUp);
    area.addEventListener('pointercancel', onCancel);
    area.addEventListener('pointerleave', onLeave);
    return () => {
      area.removeEventListener('pointermove', onPointerMove);
      area.removeEventListener('pointerdown', onDown);
      area.removeEventListener('pointerup', onUp);
      area.removeEventListener('pointercancel', onCancel);
      area.removeEventListener('pointerleave', onLeave);
    };
  }, [sound, headingId, s]);

  return (
    <button type="button" className="facts sound-switch" aria-pressed={sound === 'on'} aria-busy={sound === 'loading'} onClick={toggle}
      title="Piano notes as you move over the heading">
      Sound <span className="sound-switch__state" aria-hidden="true">{sound === 'on' ? 'on' : sound === 'loading' ? '...' : 'off'}</span>
    </button>
  );
}
