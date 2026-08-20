import { useRef, useState } from 'react';

/**
 * The contact section, deliberately unlike the rest of the page.
 *
 * Everywhere else is bone paper with black rules; this is a single saturated
 * field with a rotating comic burst behind it. The email is the interface —
 * clicking it copies to the clipboard and fires a comic "COPIED!" pop, so the
 * one action the page exists for has real feedback.
 */
const EMAIL = 'sreeabirammandava@gmail.com';

export default function Contact({ mailHref, external }: { mailHref: string; external: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked (insecure context, permissions) — the mailto link
      // beside it still works, so fail quietly rather than alerting
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact-burst" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <polygon
            points="100,2 118,44 163,26 152,72 198,80 162,110 194,146 148,148 152,194 112,170 100,198
                    86,170 46,194 50,148 6,146 38,110 2,80 48,72 37,26 82,44"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="container contact-inner">
        <p className="contact-kicker">
          <span className="contact-n">07</span> Say hello
        </p>

        <h2 className="contact-title">
          Got something
          <br />
          worth building?
        </h2>

        <p className="contact-lede">
          Internships, graduate roles, or someone who wants a second pair of hands on an
          agent that keeps losing its memory. All good.
        </p>

        <div className="contact-actions">
          <button type="button" className="contact-mail" onClick={copy}>
            <span className="contact-mail-text">{EMAIL}</span>
            <span className="contact-mail-hint">{copied ? 'copied' : 'click to copy'}</span>
            {copied && <span className="contact-pop" aria-hidden="true">COPIED!</span>}
          </button>

          <a
            className="contact-send"
            href={mailHref}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            Open mail →
          </a>
        </div>

        <div className="contact-links">
          <a href="https://github.com/Abiram116" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/sree-abiram-mandava-86b5a528b/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
