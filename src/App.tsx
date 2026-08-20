import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import Nav from './components/Nav';
import Reveal from './components/Reveal';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';
import SafeBoundary from './components/SafeBoundary';
import Footer from './components/Footer';
import Contact from './components/Contact';
import Odometer from './components/Odometer';
import useSiteMotion from './hooks/useSiteMotion';

// React Bits (ts-default variant — TypeScript + plain CSS, no Tailwind)
import SplitText from './reactbits/SplitText';
import DecryptedText from './reactbits/DecryptedText';
import ShinyText from './reactbits/ShinyText';

// Three.js is heavy; keep the ASCII pass out of the main bundle.
const AsciiScene = lazy(() => import('./components/AsciiScene'));

const PROOF: Array<[string, string, string]> = [
  ['AWS', 'Certified Cloud Practitioner', 'Amazon Web Services'],
  ['AWS', 'Certified Developer — Associate', 'Amazon Web Services'],
  ['7th', 'Rank across Hyderabad', 'LogIQids Reasoning Olympiad'],
  ['GWR', 'Guinness World Record', "Kalam portrait — volunteer"],
];

const EMAIL = 'sreeabirammandava@gmail.com';

const TOOLKIT = [
  'Python', 'LLMs', 'RAG', 'LangChain', 'Agent orchestration', 'MCPs',
  'Agent memory', 'System design for AI agents', 'Prompt engineering',
  'FAISS & vector search', 'Embeddings', 'Ollama', 'FastAPI', 'Streamlit',
  'AWS', 'Git', 'React',
];

const ARCHIVE = [
  {
    title: 'Image Colorization',
    desc: 'Grayscale-to-color deep learning with autoencoders + U-Net skip connections, CUDA-trained on an RTX 4060.',
    href: 'https://github.com/nandhithr6/Image-Colorization',
  },
  {
    title: 'Handwritten Digit Recognition',
    desc: 'MNIST model wired into a Django app — upload a digit, get a prediction.',
    href: 'https://github.com/Abiram116/mlproject2',
  },
  {
    title: 'LinSolverX',
    desc: 'Linear programming solver — simplex, graphical, fractional and transportation methods.',
    href: 'https://github.com/Abiram116/MathCourse',
  },
  {
    title: 'Recipeasy',
    desc: 'Recipe manager with Google sign-in, meal calendar and GSAP-animated UI.',
    href: 'https://github.com/Abiram116/Recipeasy',
  },
];

const MILESTONES = [
  'AWS Certified Cloud Practitioner & Developer — Associate',
  '7th rank across Hyderabad — LogIQids Logical Reasoning Olympiad',
  "Volunteered in a Guinness World Record — Dr. APJ Abdul Kalam's portrait, built from Rubik's cubes",
  'Linguaskill English Proficiency — B2, Cambridge',
];

/** Gmail compose on desktop, native mail app on mobile — as in the original script.js. */
function useMailHref() {
  const [href, setHref] = useState(`mailto:${EMAIL}`);
  const [external, setExternal] = useState(false);

  useEffect(() => {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      setHref(`https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}`);
      setExternal(true);
    }
  }, []);

  return { href, external };
}

export default function App() {
  const mail = useMailHref();
  const [ready, setReady] = useState(false);
  const onIntroDone = useCallback(() => setReady(true), []);
  useSiteMotion(ready);

  return (
    <>
      <Preloader onDone={onIntroDone} />
      <div className="grain" aria-hidden="true" />
      <Cursor />

      <div className="stripe-top" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <Nav />

      <main id="top">
        {/* ============ HERO ============ */}
        <section className="hero">
          <div className="container">
            <div className="hero-grid">
              <div className="hero-copy">
                <p className="hero-badge hero-load">
                  <span className="dot" aria-hidden="true" />
                  <DecryptedText
                    text="Final year · Hyderabad"
                    animateOn="view"
                    sequential
                    speed={38}
                    maxIterations={12}
                    revealDirection="start"
                  />
                </p>

                <h1 className="hero-title">
                  <SplitText
                    tag="span"
                    className="hero-line"
                    text="Still a student."
                    splitType="chars"
                    delay={26}
                    duration={0.9}
                    ease="expo.out"
                    textAlign="left"
                    from={{ opacity: 0, y: 60 }}
                    to={{ opacity: 1, y: 0 }}
                  />
                  <SplitText
                    tag="span"
                    className="hero-line"
                    text="Already shipping."
                    splitType="chars"
                    delay={26}
                    duration={0.9}
                    ease="expo.out"
                    textAlign="left"
                    from={{ opacity: 0, y: 60 }}
                    to={{ opacity: 1, y: 0 }}
                  />
                </h1>

                <p className="hero-sub hero-load">
                  I'm Sree Abiram — final-year B.Tech in AI &amp; Data Science at KL
                  University. No job title yet, no client list. Just systems I built to
                  find out how they actually break.
                </p>

                <div className="hero-actions hero-load">
                  <a href="#contact" className="btn btn-solid"><ShinyText text="Contact" speed={3} color="#fdfbf5" shineColor="#c9f31d" /></a>
                  <a href="#projects" className="btn btn-line">View my work →</a>
                </div>
              </div>

              <SafeBoundary>
                <Suspense fallback={null}>
                  <AsciiScene />
                </Suspense>
              </SafeBoundary>

              <figure className="hero-portrait hero-load">
                <picture>
                  <source
                    type="image/webp"
                    srcSet="/assets/photos/abiram-500.webp 500w, /assets/photos/abiram.webp 1000w"
                    sizes="(max-width: 900px) 60vw, 400px"
                  />
                  <img
                    src="/assets/photos/abiram.jpg"
                    alt="Sree Abiram Mandava"
                    width={1000}
                    height={1333}
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </figure>
            </div>

          </div>
        </section>

        {/* ============ PROOF ============ */}
        <section className="section section-tint" id="proof">
          <div className="container">
            <Reveal className="chapter">
              <span className="chapter-n">01</span>
              <span>Receipts</span>
            </Reveal>
            <Reveal as="h2" className="section-title">Small, but real.</Reveal>

            <div className="odo-row">
              <Odometer value="02" label="AWS certifications" />
              <Odometer value="07" label="Hyderabad rank, LogIQids" />
              <Odometer value="06" label="Projects shipped" />
              <Odometer value="2027" label="Graduating" />
            </div>

            <div className="trust-bar">
              {PROOF.map(([k, title, sub]) => (
                <div className="proof" key={title}>
                  <div className="proof-ico">{k}</div>
                  <div>
                    <div className="proof-t">{title}</div>
                    <span className="proof-s">{sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ STORY ============ */}
        <section id="story" className="section">
          <div className="container">
            <Reveal className="chapter">
              <span className="chapter-n">02</span>
              <span>The story so far</span>
            </Reveal>
            <Reveal as="h2" className="section-title">
              Coursework taught<br />me the words.
            </Reveal>
            <div className="story-grid">
              <Reveal className="story-text">
                <p>
                  My degree pointed me at large language models. Building with them is what
                  actually taught me anything: retrieval pipelines, agents that pick their own
                  tools, and the unglamorous work of making all of it hold together.
                </p>
                <p>
                  Jignasa started as a question I couldn't answer from lecture notes: could a
                  genuinely useful assistant run entirely on your own machine, with nothing
                  leaving it? Answering it took structure-aware ingestion, a vector store, an
                  agentic loop and a memory that survives a restart.
                </p>
                <p>
                  I graduate in 2027. The goal between now and then is to become the kind of
                  engineer whose systems are as dependable as they are clever.
                </p>
              </Reveal>
              <Reveal className="story-facts">
                <div className="fact">
                  <span className="fact-k">Now</span>
                  <span className="fact-v">
                    Final-year B.Tech, AI &amp; DS<br />KL University · 2023–2027
                  </span>
                </div>
                <div className="fact">
                  <span className="fact-k">Building with</span>
                  <span className="fact-v">LLMs, RAG &amp; agentic systems</span>
                </div>
                <div className="fact">
                  <span className="fact-k">Fueled by</span>
                  <span className="fact-v">
                    Rocket stories, German engineering<br />&amp; relentless curiosity
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ ABOUT ============ */}
        <section id="about" className="section">
          <div className="container">
            <Reveal className="chapter">
              <span className="chapter-n">03</span>
              <span>Who you'd be hiring</span>
            </Reveal>
            <Reveal as="h2" className="section-title">I'm early. That's the point.</Reveal>
            <div className="about-grid about-grid-solo">
              <Reveal className="about-text">
                <p>
                  I like problems where the answer isn't in the documentation yet: getting a
                  model to pick the right tool, keeping retrieval honest, deciding what a system
                  should still remember three sessions later.
                </p>
                <p>
                  I build the whole thing rather than a notebook slice of it, because the
                  interesting failures only appear end to end — in the parsing, in the retrieval,
                  in the bit where somebody is waiting for an answer.
                </p>
                <p>
                  What I'm after is a first role — an internship or a graduate position — where
                  I can own a feature end to end and learn from people who've shipped far more
                  than I have. I'd rather be the least experienced person in a good team than the
                  most experienced in a weak one.
                </p>
                <a href="#contact" className="btn btn-line">Get in touch</a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ============ TOOLKIT ============ */}
        <section id="toolkit" className="section section-tint">
          <div className="container">
            <Reveal className="chapter">
              <span className="chapter-n">04</span>
              <span>Toolkit</span>
            </Reveal>
            <Reveal as="h2" className="section-title">What I reach for.</Reveal>
            <Reveal as="p" className="section-lede">
              Not a laundry list — just the things I actually reach for while chasing AI
              engineering.
            </Reveal>
            <Reveal className="chip-row">
              {TOOLKIT.map((t) => (
                <span className="chip" key={t}>{t}</span>
              ))}
            </Reveal>
            <Reveal className="cert-row">
              <div className="cert-card">
                <span className="cert-badge">AWS Certified</span>
                <h3>Cloud Practitioner</h3>
              </div>
              <div className="cert-card">
                <span className="cert-badge">AWS Certified</span>
                <h3>Developer — Associate</h3>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ PROJECTS ============ */}
        <section id="projects" className="section">
          <div className="container">
            <Reveal className="chapter">
              <span className="chapter-n">05</span>
              <span>Projects</span>
            </Reveal>
            <Reveal as="h2" className="section-title">Things I've built.</Reveal>

            <Reveal as="article" className="feature-card">
              <div className="feature-tags">
                <span className="tag tag-hot">Primary showcase</span>
                <span className="tag">Local-first AI</span>
              </div>
              <h3 className="feature-title">Jignasa</h3>
              <p className="feature-desc">
                A fully local AI assistant — document Q&amp;A, live web search and reasoning, with
                every byte processed on your own machine. Structure-aware PDF parsing feeds a FAISS
                vector store, an agentic ReAct loop decides per-turn which tools to reach for, and a
                durable memory system remembers your preferences. Every agent decision lands in a
                queryable audit trail.
              </p>
              <p className="feature-stack">
                Qwen3 via Ollama · FAISS · bge embeddings · Docling · FastAPI · React 19 + TypeScript
              </p>
              <a
                className="project-link"
                href="https://github.com/Abiram116/Jignasa"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub →
              </a>
            </Reveal>

            <Reveal as="article" className="feature-card feature-card-second">
              <div className="feature-tags">
                <span className="tag">AI product</span>
                <span className="tag">Mobile</span>
              </div>
              <h3 className="feature-title">SpaceLearn</h3>
              <p className="feature-desc">
                An AI-powered productivity app for students — organize study material into spaces
                and subspaces, chat with an AI tutor, summarize PDFs, and get performance-based
                improvement suggestions.
              </p>
              <p className="feature-stack">React Native · JavaScript · Supabase · AI APIs</p>
              <a
                className="project-link"
                href="https://github.com/Abiram116/SpaceLearn"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub →
              </a>
            </Reveal>

            <Reveal className="archive-head">
              <h3>From the archive</h3>
              <p>
                Second-year era — before AI engineering was the plan. Kept here because every one of
                them taught me something.
              </p>
            </Reveal>

            <div className="archive-grid">
              {ARCHIVE.map((p) => (
                <Reveal as="article" className="archive-card" key={p.title}>
                  <h4>{p.title}</h4>
                  <p>{p.desc}</p>
                  <a href={p.href} target="_blank" rel="noopener noreferrer">GitHub →</a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ MILESTONES ============ */}
        <section className="section section-tint closing-under">
          <div className="container">
            <Reveal className="chapter">
              <span className="chapter-n">06</span>
              <span>Milestones</span>
            </Reveal>
            <Reveal as="h2" className="section-title">Along the way.</Reveal>
            <ul className="milestones">
              {MILESTONES.map((m) => (
                <Reveal as="li" key={m}>
                  <span className="mile-mark" />
                  {m}
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

      </main>

      <div className="closing-clip">
        <div className="closing">
          <Contact mailHref={mail.href} external={mail.external} />
          <Footer />
        </div>
      </div>
    </>
  );
}
