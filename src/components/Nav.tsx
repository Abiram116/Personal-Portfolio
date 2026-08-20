import { useState } from 'react';

const LINKS = [
  ['#story', 'Story'],
  ['#about', 'About'],
  ['#toolkit', 'Toolkit'],
  ['#projects', 'Projects'],
] as const;

/**
 * Floating nav: three separate objects sitting over the page rather than one
 * full-width bar — a logo chip, a link capsule, and the contact action.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <a href="#top" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          sree<span>abiram</span>
        </a>

        <nav className={`nav-links${open ? ' is-open' : ''}`}>
          {LINKS.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-end">
          <a href="#contact" className="nav-cta" onClick={() => setOpen(false)}>
            Contact
          </a>
          <button
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      <div className="scroll-rail" aria-hidden="true">
        <span />
      </div>
    </header>
  );
}
