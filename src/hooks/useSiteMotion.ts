import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/**
 * The motion system for the whole site.
 *
 * Safety rule throughout: everything is visible in CSS by default and GSAP
 * sets the hidden state itself. If this never runs — JS fails, bundle blocked,
 * reduced motion — the page still reads completely.
 */
export default function useSiteMotion(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    /* ---------- Smooth scroll on the GSAP ticker ---------- */
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Anchor links have to go through Lenis or they fight it
    const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const onAnchor = (e: Event) => {
      const a = e.currentTarget as HTMLAnchorElement;
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      // The closing slab is the last thing on the page, so #contact has to run
      // to the very end of the document — an element-relative scroll stops
      // short and leaves a strip of the previous section on screen.
      if (id === '#contact') {
        // clamp to the real maximum: passing scrollHeight overshoots by a
        // viewport and lands past the footer on empty space
        const max = document.documentElement.scrollHeight - window.innerHeight;
        lenis.scrollTo(Math.max(max, 0), { duration: 1.3 });
        return;
      }
      lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.2 });
    };
    anchors.forEach((a) => a.addEventListener('click', onAnchor));

    const heroCleanup: Array<() => void> = [];

    // Hero pointer effects are the hottest handlers on the page. Switch them
    // off entirely once the hero has scrolled away rather than computing
    // rects for elements nobody can see.
    let heroVisible = true;
    const heroNode = document.querySelector('.hero');
    if (heroNode) {
      const heroIO = new IntersectionObserver(
        ([e]) => { heroVisible = e.isIntersecting; },
        { rootMargin: '80px' }
      );
      heroIO.observe(heroNode);
      heroCleanup.push(() => heroIO.disconnect());
    }

    const ctx = gsap.context(() => {
      /* ---------- Split section titles into per-word maskable spans ---------- */
      gsap.utils.toArray<HTMLElement>('.section-title').forEach((el) => {
        if (el.dataset.split === '1') return;
        const html = el.innerHTML;
        // Keep <br> and inline markup intact; only wrap bare text nodes
        el.innerHTML = html.replace(
          /([^\s<>]+)(?![^<]*>)/g,
          '<span class="word"><span>$1</span></span>'
        );
        el.dataset.split = '1';
      });


      /* ---------- Hero entrance ---------- */
      // clearProps on every entrance tween: a leftover inline transform both
      // overrides CSS hover states and leaves elements a few px out of line.
      const intro = gsap.timeline({ defaults: { ease: 'expo.out', clearProps: 'transform' } });
      intro
        // the whole hero rises as the intro panel clears, so the two read as
        // one continuous move rather than two separate animations
        .from('.hero', { scale: 0.965, opacity: 0, duration: 0.95, ease: 'expo.out' }, 0)
        .from('.hero-badge', { y: -14, opacity: 0, duration: 0.5 }, 0.12)
        .from('.hero-sub', { y: 24, opacity: 0, duration: 0.85 }, '-=0.7')
        .from('.hero-actions > *', { y: 20, opacity: 0, duration: 0.7, stagger: 0.09 }, '-=0.6')
        .from('.hero-portrait', { y: 40, opacity: 0, duration: 0.9 }, '-=0.8')
        ;



      /* ---------- Portrait follows the cursor ----------
         The frame tilts toward the pointer in 3D and the colour block behind
         it slides the opposite way, so the photo feels like a physical object
         being looked at rather than a flat image. */
      const portrait = document.querySelector<HTMLElement>('.hero-portrait');
      if (portrait) {
        const rx = gsap.quickTo(portrait, 'rotationX', { duration: 0.7, ease: 'power3.out' });
        const ry = gsap.quickTo(portrait, 'rotationY', { duration: 0.7, ease: 'power3.out' });
        const px = gsap.quickTo(portrait, 'x', { duration: 0.9, ease: 'power3.out' });
        const py = gsap.quickTo(portrait, 'y', { duration: 0.9, ease: 'power3.out' });

        gsap.set(portrait, { transformPerspective: 900, transformOrigin: 'center' });

        const onMove = (e: PointerEvent) => {
          if (!heroVisible) return;
          const r = portrait.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          // distance from the photo decides how strongly it reacts
          const dx = (e.clientX - cx) / window.innerWidth;
          const dy = (e.clientY - cy) / window.innerHeight;
          const near = e.clientX > r.left - 240 && e.clientX < r.right + 240 &&
                       e.clientY > r.top - 240 && e.clientY < r.bottom + 240;
          const gain = near ? 1 : 0.35;
          ry(dx * 26 * gain);
          rx(-dy * 20 * gain);
          px(dx * 14 * gain);
          py(dy * 10 * gain);
        };
        const reset = () => { rx(0); ry(0); px(0); py(0); };

        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerleave', reset);
        heroCleanup.push(() => {
          window.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerleave', reset);
        });
      }

      /* ---------- Hero depth: parallax layers at different depths ----------
         The copy sits nearest the viewer and the black hole further back, so
         moving the pointer separates them the way real depth would. */
      const stage = document.querySelector<HTMLElement>('.ascii-stage');
      const copy = document.querySelector<HTMLElement>('.hero-copy');
      const heroEl = document.querySelector<HTMLElement>('.hero');
      if (heroEl && (stage || copy)) {
        const sx = stage ? gsap.quickTo(stage, 'x', { duration: 1.1, ease: 'power3.out' }) : null;
        const sy = stage ? gsap.quickTo(stage, 'y', { duration: 1.1, ease: 'power3.out' }) : null;
        const cx = copy ? gsap.quickTo(copy, 'x', { duration: 1.3, ease: 'power3.out' }) : null;
        const cy = copy ? gsap.quickTo(copy, 'y', { duration: 1.3, ease: 'power3.out' }) : null;

        const onPointer = (e: PointerEvent) => {
          if (!heroVisible) return;
          const nx = (e.clientX / window.innerWidth) * 2 - 1;
          const ny = (e.clientY / window.innerHeight) * 2 - 1;
          // far layer travels more, near layer barely moves — that is the depth cue
          sx?.(nx * -10);
          sy?.(ny * -7);
          cx?.(nx * 9);
          cy?.(ny * 6);
        };
        window.addEventListener('pointermove', onPointer, { passive: true });
        heroCleanup.push(() => window.removeEventListener('pointermove', onPointer));

        // and it recedes as you scroll away
        gsap.to(stage, {
          scale: 1.08,
          opacity: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
        });
      }

      /* ---------- Hero parallax out ---------- */
      gsap.to('.hero .container', {
        y: 120,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
      });

      /* ---------- Section titles wipe up, word by word ---------- */
      gsap.utils.toArray<HTMLElement>('.section-title').forEach((title) => {
        gsap.from(title.querySelectorAll('.word > span'), {
          yPercent: 118,
          duration: 0.95,
          ease: 'expo.out',
          stagger: 0.04,
          scrollTrigger: { trigger: title, start: 'top 86%', once: true },
        });
      });

      /* ---------- Batched reveals ---------- */
      const reveals = gsap.utils.toArray<HTMLElement>('.reveal:not(.section-title)');
      gsap.set(reveals, { y: 34, opacity: 0 });
      ScrollTrigger.batch(reveals, {
        start: 'top 90%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'expo.out',
            stagger: 0.07,
            overwrite: true,
            clearProps: 'transform',
          }),
      });

      /* ---------- Photographs drift against the scroll ---------- */
      gsap.utils.toArray<HTMLElement>('.photo-card img, .shelf-item img').forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -8, scale: 1.14 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: {
              trigger: img.closest('figure') ?? img,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      /* ---------- Feature cards rise, then tilt to the pointer ---------- */
      gsap.utils.toArray<HTMLElement>('.feature-card').forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: 'expo.out',
          clearProps: 'transform',
          scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        });

        const rotX = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3.out' });
        const rotY = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3.out' });

        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          rotY(((e.clientX - r.left) / r.width - 0.5) * 7);
          rotX(-(((e.clientY - r.top) / r.height - 0.5) * 5));
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
        });
        card.addEventListener('pointerleave', () => {
          rotX(0);
          rotY(0);
        });
      });

      /* ---------- Archive + shelf cascade in ---------- */
      [
        ['.archive-grid', '.archive-card'],
        ['.shelf', '.shelf-item'],
        ['.trust-bar', '.proof'],
      ].forEach(([wrap, item]) => {
        const host = document.querySelector(wrap);
        if (!host) return;
        gsap.from(host.querySelectorAll(item), {
          y: 46,
          opacity: 0,
          duration: 0.85,
          ease: 'expo.out',
          stagger: 0.08,
          clearProps: 'transform',
          scrollTrigger: { trigger: host, start: 'top 88%', once: true },
        });
      });

      /* ---------- Milestones slide in as they unlock ---------- */
      const milestones = gsap.utils.toArray<HTMLElement>('.milestones li');
      if (milestones.length) {
        gsap.from(milestones, {
          x: -40,
          opacity: 0,
          duration: 0.75,
          ease: 'expo.out',
          stagger: 0.11,
          clearProps: 'transform',
          scrollTrigger: { trigger: '.milestones', start: 'top 84%', once: true },
        });
      }

      /* ---------- Section tints slide their background up ---------- */
      gsap.utils.toArray<HTMLElement>('.section-tint').forEach((sec) => {
        gsap.fromTo(
          sec,
          { backgroundPositionY: '-40px' },
          {
            backgroundPositionY: '40px',
            ease: 'none',
            scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });

      /* ---------- Closing lock ----------
         When the last section's end line reaches the bottom of the screen the
         whole page freezes and only the contact + footer slab keeps moving,
         climbing up over it. The freeze is done by translating <main> down by
         exactly the distance the page scrolls up — freezing only the final
         section would let everything above it keep sliding, which is the bug
         this replaced. */
      const closingEl = document.querySelector<HTMLElement>('.closing');
      const mainEl = document.querySelector<HTMLElement>('main');

      if (closingEl && mainEl) {
        gsap.fromTo(
          mainEl,
          { y: 0 },
          {
            y: () => closingEl.offsetHeight,
            ease: 'none',
            scrollTrigger: {
              trigger: mainEl,
              start: 'bottom bottom',
              endTrigger: closingEl,
              end: 'bottom bottom',
              scrub: true,
              invalidateOnRefresh: true,
            },
          }
        );

        // the slab tips up into place as it arrives
        gsap.fromTo(
          closingEl,
          { rotateX: 7, transformPerspective: 1500, transformOrigin: 'center top' },
          {
            rotateX: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: closingEl,
              start: 'top bottom',
              end: 'top top',
              scrub: 0.5,
            },
          }
        );
      }

      /* ---------- Scroll-velocity skew ----------
         Content skews a degree or two with scroll momentum and settles back to
         zero at rest, so the page reads as having weight. Clamped hard: past
         about 2.5deg it stops feeling physical and starts looking broken.

         Deliberately excludes .feature-card and .milestones li: both already
         carry their own scroll-position-locked transforms (the card stack's
         scale, the closing lock's main-column translate). Skew decays on its
         own 0.55s timer, independent of scroll — stacked on top of a
         scroll-locked element, that timer visibly outlives the scroll gesture
         and reads as the card lagging or "settling" after the user has
         already stopped. Archive cards, proof tiles and the hero portrait have
         no competing scroll-locked transform, so skew is harmless texture
         there. */
      const skewTargets = gsap.utils.toArray<HTMLElement>(
        '.archive-card, .proof, .hero-portrait'
      );
      if (skewTargets.length) {
        const setSkew = gsap.quickTo(skewTargets, 'skewY', {
          duration: 0.4,
          ease: 'power3.out',
        });
        ScrollTrigger.create({
          onUpdate: (self) => {
            const v = gsap.utils.clamp(-2.5, 2.5, self.getVelocity() / 320);
            setSkew(v);
          },
        });
        // settle back to flat quickly once the scroll stops
        let idle: number | undefined;
        const rest = () => {
          window.clearTimeout(idle);
          idle = window.setTimeout(() => setSkew(0), 80);
        };
        lenis.on('scroll', rest);
      }

      /* ---------- Variable font axis on scroll ----------
         Archivo carries real wght and wdth axes, so section titles genuinely
         interpolate weight and width as they cross the viewport rather than
         faking it with a transform. */
      gsap.utils.toArray<HTMLElement>('.section-title').forEach((title) => {
        gsap.fromTo(
          title,
          { fontVariationSettings: '"wdth" 96, "wght" 640' },
          {
            fontVariationSettings: '"wdth" 118, "wght" 900',
            ease: 'none',
            scrollTrigger: {
              trigger: title,
              start: 'top 92%',
              end: 'top 42%',
              scrub: 0.6,
            },
          }
        );
      });

      /* ---------- Sticky-stacked project cards ----------
         Each project card holds position while the next one slides over it,
         scaling back and dimming as it goes under — a deck being dealt. Done
         with transforms rather than position:sticky, which does not engage
         reliably inside this Lenis-driven layout. */
      const featureCards = gsap.utils.toArray<HTMLElement>('.feature-card');
      featureCards.forEach((card, i) => {
        if (i === featureCards.length - 1) return;
        const next = featureCards[i + 1];
        gsap.fromTo(
          card,
          { scale: 1, filter: 'brightness(1)' },
          {
            scale: 0.93,
            filter: 'brightness(0.9)',
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top bottom',
              end: 'top center',
              scrub: 0.4,
            },
          }
        );
      });

      /* ---------- Navbar condenses; progress rail fills ---------- */
      ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: { className: 'is-stuck', targets: '.navbar' },
      });

      /* ---------- Nav Contact button swaps off the blue section's own colour
         The fixed nav sits on top of every section including the blue contact
         block; a blue button there would vanish into it. Swap discretely for
         exactly the span the blue section is behind the fixed nav — the
         trigger's start/end are offset by the navbar's own height so the class
         toggles right as the section's background reaches the button, not
         whenever the section merely enters the viewport. */
      const contactSection = document.querySelector('.contact');
      if (contactSection) {
        ScrollTrigger.create({
          trigger: contactSection,
          start: 'top 90px',
          end: 'bottom 90px',
          toggleClass: { className: 'on-contact', targets: '.navbar' },
        });
      }

      const rail = document.querySelector<HTMLElement>('.scroll-rail span');
      if (rail) {
        // Computed straight from scroll position rather than a ScrollTrigger
        // range: the closing freeze changes the effective end, so a cached
        // 'max' left the rail short of the right edge.
        const paint = () => {
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
          rail.style.setProperty('--p', String(p));
        };
        paint();
        lenis.on('scroll', paint);
        window.addEventListener('resize', paint);
        heroCleanup.push(() => window.removeEventListener('resize', paint));
      }

      /* ---------- Magnetic buttons ---------- */
      gsap.utils.toArray<HTMLElement>('.btn').forEach((btn) => {
        const mx = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' });
        const my = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' });
        btn.addEventListener('pointermove', (e) => {
          const r = btn.getBoundingClientRect();
          mx((e.clientX - (r.left + r.width / 2)) * 0.28);
          my((e.clientY - (r.top + r.height / 2)) * 0.4);
        });
        btn.addEventListener('pointerleave', () => {
          mx(0);
          my(0);
        });
      });

      // Release compositor layers once the entrance has played; leaving
      // will-change on permanently keeps memory pinned for no benefit.
      gsap.delayedCall(2.5, () => {
        document.querySelectorAll<HTMLElement>('.hero-load, .reveal').forEach((el) => {
          el.style.willChange = 'auto';
        });
      });

      ScrollTrigger.refresh();
    });

    return () => {
      ctx.revert();
      heroCleanup.forEach((fn) => fn());
      anchors.forEach((a) => a.removeEventListener('click', onAnchor));
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [enabled]);
}
