import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

/**
 * Comic-book cold open, in the Spider-Verse register: halftone ground, a
 * misregistered SA monogram, a burst, and caption boxes that snap in on beats
 * rather than easing. Runs once per tab.
 */
// Comic caption narration rather than a list of facts.
const BEATS = [
  'MEANWHILE, IN HYDERABAD…',
  'ONE FINAL-YEAR STUDENT',
  'DECIDES TO SHIP ANYWAY',
];

export default function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [skip] = useState(
    () =>
      typeof window !== 'undefined' &&
      (sessionStorage.getItem('seen-intro') === '1' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  );

  useEffect(() => {
    if (skip) {
      document.documentElement.classList.add('is-live');
      onDone();
      return;
    }

    // Hold the intro until the page behind it is genuinely painted: fonts
    // resolved and the hero scene mounted. Capped so a slow GPU or a blocked
    // font never traps the visitor on the loading screen.
    const backgroundReady = Promise.all([
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        const done = () => resolve();
        window.addEventListener('scene-ready', done, { once: true });
        setTimeout(done, 4500);
      }),
    ]);

    // Wait for the display face before animating: a font swapping mid-timeline
    // reflows the monogram and reads as a stutter. Capped so a blocked font
    // can never stall the intro.
    const fontsSettled = Promise.race([
      (document as Document & { fonts?: FontFaceSet }).fonts?.ready ?? Promise.resolve(),
      new Promise((r) => setTimeout(r, 900)),
    ]);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ paused: true });
      fontsSettled.then(() => tl.play());

      // Comic timing: things arrive on the beat, they don't drift in.
      tl.from('.pl-burst', { scale: 0, rotate: -45, duration: 0.6, ease: 'back.out(2.2)' })
        .from('.pl-mono', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(2.8)' }, '-=0.2')
        .from('.pl-mono-ghost', { x: 0, y: 0, duration: 0.5, ease: 'power2.out' }, '<')
        .from('.pl-panel', { yPercent: 130, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.15 }, '-=0.15')
        // a slow breath on the burst so the screen has life while it holds
        .to('.pl-burst', { rotate: 8, duration: 3.2, ease: 'none' }, 0.4);

      // Caption swaps, hard cuts. Step by one line height in em — yPercent
      // here would move by the whole three-line track, not a single beat.
      BEATS.forEach((_, i) => {
        if (i === 0) return;
        tl.set('.pl-beat', { y: `${-1.4 * i}em` }, 0.85 + i * 0.78);
      });

      tl.to({ v: 0 }, {
        v: 100,
        duration: 2.6,
        ease: 'power1.inOut',
        onUpdate() {
          const el = root.current?.querySelector('.pl-count');
          if (el) el.textContent = String(Math.round(this.targets()[0].v)).padStart(3, '0');
        },
      }, 0.5)
        // Everything above is the guaranteed minimum on screen (~3.1s). The
        // exit only starts once the page behind is actually ready.
        .call(() => {
          tl.pause();
          backgroundReady.then(() => tl.play());
        })
        .to('.pl-halftone', { scale: 1.3, opacity: 0, duration: 0.5, ease: 'power2.in' })
        .to(['.pl-burst', '.pl-mono-wrap', '.pl-panel'], {
          scale: 0.85, opacity: 0, duration: 0.35, ease: 'power2.in', stagger: 0.05,
        }, '-=0.4')
        // Curtain: the panel is cut away by an expanding clip-path instead of
        // sliding off, so the hero is revealed through it rather than behind it.
        .fromTo(
          root.current,
          { clipPath: 'inset(0% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.9, ease: 'expo.inOut' },
          '<'
        )
        .to(root.current, {
          yPercent: -100,
          duration: 0.85,
          ease: 'expo.inOut',
          // fire the handoff as the wipe starts, not when it lands: the hero
          // then rises into the gap the panel is leaving behind
          onStart: () => {
            sessionStorage.setItem('seen-intro', '1');
            document.documentElement.classList.add('is-live');
            onDone();
          },
        }, '-=0.1');
    }, root);

    return () => ctx.revert();
  }, [skip, onDone]);

  if (skip) return null;

  return (
    <div className="preloader" ref={root}>
      <div className="pl-halftone" aria-hidden="true" />

      <svg className="pl-burst" viewBox="0 0 200 200" aria-hidden="true">
        <polygon
          points="100,2 118,44 163,26 152,72 198,80 162,110 194,146 148,148 152,194 112,170 100,198
                  86,170 46,194 50,148 6,146 38,110 2,80 48,72 37,26 82,44"
          fill="#2f5cff"
          stroke="#14110f"
          strokeWidth="5"
        />
      </svg>

      <div className="pl-mono-wrap">
        <span className="pl-mono-ghost pl-ghost-a" aria-hidden="true">SA</span>
        <span className="pl-mono-ghost pl-ghost-b" aria-hidden="true">SA</span>
        <span className="pl-mono">SA</span>
      </div>

      <div className="pl-panel pl-caption">
        <div className="pl-beat-window">
          <span className="pl-beat">
            {BEATS.map((b) => (
              <span key={b}>{b}</span>
            ))}
          </span>
        </div>
      </div>

      <div className="pl-panel pl-count-panel">
        <span className="pl-count">000</span>
      </div>
    </div>
  );
}
