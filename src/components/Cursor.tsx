import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * One shape, not two drifting apart: a reticle ring with an accent-coloured
 * core nested inside it, both moved by the same tween so they're always
 * concentric. The ring stays mix-blend difference (reads against any
 * background); the core is a plain solid colour that swaps per hover
 * target — a small, legible "what am I over" readout in the site's palette.
 */
const ACCENTS: Record<string, string> = {
  nav: '#c9f31d',
  link: '#2f5cff',
  button: '#c9f31d',
  card: '#ff3d8b',
  portrait: '#ff6b1a',
  proof: '#06b6d4',
  default: '#14110f',
};

export default function Cursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    if (!ringRef.current || !coreRef.current || !labelRef.current) return;

    const ring: HTMLDivElement = ringRef.current;
    const core: HTMLDivElement = coreRef.current;
    const label: HTMLDivElement = labelRef.current;

    document.body.classList.add('has-custom-cursor');

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.18, ease: 'power3.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.18, ease: 'power3.out' });
    const labX = gsap.quickTo(label, 'x', { duration: 0.18, ease: 'power3.out' });
    const labY = gsap.quickTo(label, 'y', { duration: 0.18, ease: 'power3.out' });

    let magnet: HTMLElement | null = null;

    const SELECTOR =
      'a, button, .chip, .feature-card, .archive-card, .milestones li, .proof, .hero-portrait';

    function labelFor(el: HTMLElement): string {
      if (el.matches('.hero-portrait')) return "That's me";
      if (el.matches('.chip, .milestones li, .proof')) return '';
      if (el.matches('.feature-card, .archive-card')) return 'Open';
      const anchor = el.closest('a');
      const href = anchor?.getAttribute('href') ?? '';
      if (href.startsWith('mailto') || href.includes('mail.google')) return 'Mail';
      if (href.startsWith('#')) return 'Jump';
      if (anchor?.getAttribute('target') === '_blank') return 'Visit';
      if (el.tagName === 'BUTTON') return 'Copy';
      return '';
    }

    function accentFor(el: HTMLElement, isNav: boolean): string {
      if (isNav) return ACCENTS.nav;
      if (el.matches('.hero-portrait')) return ACCENTS.portrait;
      if (el.matches('.feature-card, .archive-card')) return ACCENTS.card;
      if (el.matches('.chip, .milestones li, .proof')) return ACCENTS.proof;
      if (el.matches('button, a')) return ACCENTS.button;
      return ACCENTS.link;
    }

    function place(x: number, y: number) {
      ringX(x);
      ringY(y);
      labX(x);
      labY(y);
    }

    function onMove(e: PointerEvent) {
      if (magnet) {
        const r = magnet.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const pull = r.width > 320 ? 0.82 : 0.45;
        place(cx + (e.clientX - cx) * pull, cy + (e.clientY - cy) * pull);
      } else {
        place(e.clientX, e.clientY);
      }
    }

    function onOver(e: PointerEvent) {
      const el = (e.target as HTMLElement)?.closest?.(SELECTOR) as HTMLElement | null;
      if (!el) {
        if (magnet) {
          magnet = null;
          label.textContent = '';
          ring.classList.remove('is-active', 'is-nav');
          label.classList.remove('is-on');
          core.style.background = ACCENTS.default;
        }
        return;
      }
      if (el === magnet) return;
      magnet = el;

      const isNav = Boolean(el.closest('.navbar'));
      // Links, buttons and chips are small targets — the full 70px "spotlight"
      // ring overshoots their edges and, blended against a solid fill, reads
      // as a garish blob instead of a highlight. Only genuinely large targets
      // (cards, the portrait) earn the big ring.
      const isCompact = isNav || Boolean(el.closest('a, button, .chip'));
      const text = isNav ? '' : labelFor(el);
      const accent = accentFor(el, isNav);
      label.textContent = text;
      ring.classList.add('is-active');
      ring.classList.toggle('is-nav', isCompact);
      label.classList.toggle('is-on', Boolean(text));
      core.style.background = accent;
    }

    function onDown() {
      gsap.to(ring, { scale: 0.85, duration: 0.16, ease: 'power2.out' });
    }
    function onUp() {
      gsap.to(ring, { scale: 1, duration: 0.32, ease: 'expo.out' });
    }

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <div aria-hidden="true">
      <div className="cursor-ring" ref={ringRef}>
        <div className="cursor-core" ref={coreRef} />
      </div>
      <div className="cursor-label" ref={labelRef} />
    </div>
  );
}
