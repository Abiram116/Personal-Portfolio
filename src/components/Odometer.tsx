import { useEffect, useRef } from 'react';

/**
 * Digit-by-digit roll, like a fuel pump — each column spins its own 0-9 strip
 * and lands on the target digit, with a stagger so the columns settle left to
 * right. A plain count-up reads as a number changing; this reads as a machine
 * arriving at a total.
 */
export default function Odometer({
  value,
  label,
  duration = 1.4,
}: {
  value: string;
  label: string;
  duration?: number;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cols = Array.from(el.querySelectorAll<HTMLElement>('.odo-strip'));

    if (reduced) {
      cols.forEach((c) => {
        const d = Number(c.dataset.digit ?? '0');
        c.style.transform = `translateY(${-d * 10}%)`;
      });
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        cols.forEach((c, i) => {
          const d = Number(c.dataset.digit ?? '0');
          // one full extra rotation so it visibly spins rather than nudging
          c.style.transition = `transform ${duration + i * 0.12}s cubic-bezier(0.16, 1, 0.3, 1)`;
          c.style.transform = `translateY(${-(d + 10) * (100 / 21)}%)`;
        });
        io.disconnect();
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [duration]);

  const digits = value.split('');

  return (
    <div className="odo" ref={host}>
      <div className="odo-value" aria-label={value}>
        {digits.map((ch, i) =>
          /\d/.test(ch) ? (
            <span className="odo-col" key={i} aria-hidden="true">
              <span className="odo-strip" data-digit={ch}>
                {/* 0-9, then 0-9 again, then the landing digit */}
                {Array.from({ length: 21 }, (_, n) => (
                  <span key={n}>{n < 20 ? n % 10 : ch}</span>
                ))}
              </span>
            </span>
          ) : (
            <span className="odo-static" key={i} aria-hidden="true">
              {ch}
            </span>
          )
        )}
      </div>
      <span className="odo-label">{label}</span>
    </div>
  );
}
