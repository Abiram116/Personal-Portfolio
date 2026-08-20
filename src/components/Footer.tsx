import { useEffect, useRef, useState } from 'react';

/**
 * A footer that is actually alive rather than a copyright line.
 *
 * It shows the real time in Hyderabad ticking every second, works out whether
 * he is plausibly awake, and lets you drag the giant wordmark around — the
 * letters spring back when released. Nothing here is decorative-only: the clock
 * tells a recruiter in another timezone when they'd reach him.
 */
const TZ = 'Asia/Kolkata';

function useHyderabadTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now);

  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, hour: '2-digit', hour12: false }).format(now)
  );

  // Availability only — no invented daily routine. These are the hours he is
  // actually reachable, nothing more.
  let status: string;
  let live = false;
  if (hour >= 11 && hour < 20) {
    status = 'available';
    live = true;
  } else if (hour >= 23 || hour < 8) {
    status = 'probably asleep';
  } else {
    status = 'unavailable';
  }

  return { time, status, live };
}

const LETTERS = 'SREEABIRAM'.split('');

export default function Footer() {
  const { time, status, live } = useHyderabadTime();
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = wrap.current;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const letters = Array.from(host.querySelectorAll<HTMLElement>('.f-letter'));

    // Letters lean away from the cursor, then settle back.
    const onMove = (e: PointerEvent) => {
      const hostRect = host.getBoundingClientRect();
      if (e.clientY < hostRect.top - 120) return;
      letters.forEach((l) => {
        const r = l.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - dist / 320);
        l.style.transform =
          `translate(${(-dx / 12) * force}px, ${(-dy / 14) * force}px) rotate(${(-dx / 40) * force}deg)`;
      });
    };
    const reset = () => letters.forEach((l) => { l.style.transform = ''; });

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', reset);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', reset);
    };
  }, []);

  return (
    <footer className="site-footer" ref={wrap}>
      <div className="container">
        <div className="f-top">
          <p className="f-line">
            Built from scratch in Hyderabad — no template, no page builder.
          </p>

          <div className="f-status">
            <span className="f-dot-cell" aria-hidden="true">
              <span className={`f-dot${live ? ' is-awake' : ''}`} />
            </span>
            <span className="f-time">{time}</span>
            <span className="f-tz">IST</span>
            <span className="f-note">{status}</span>
          </div>
        </div>

        <div className="f-wordmark" aria-label="Sree Abiram">
          {LETTERS.map((ch, i) => (
            <span className="f-letter" key={`${ch}-${i}`} aria-hidden="true">
              {ch}
            </span>
          ))}
        </div>

        <div className="f-bottom">
          <span>© {new Date().getFullYear()} Sree Abiram Mandava</span>
          <a href="#top">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
