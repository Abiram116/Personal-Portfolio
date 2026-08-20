# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React + TypeScript, compiled to a fully static bundle and deployed to
GitHub Pages from `dist/`. **Hard constraint: no backend, no server runtime, no
hosting cost.** The user's requirement is a static GitHub Pages deploy; React is
present only because React Flow requires it. Libraries requested by the user:
React Flow, GSAP (+ScrollTrigger), Three.js / react-three-fiber.

Higgsfield (via MCP) is the image/video generation source for site assets.

## Users

**Primary:** hiring managers, founders and engineers at AI-first startups and
product teams, screening a final-year candidate for an AI engineering role. They
skim fast, they care whether the candidate has actually shipped a working system,
and they want to see architecture judgment — not a credential list.

**Secondary:** recruiters doing a first pass, and peers arriving from GitHub or
LinkedIn.

## Product Purpose

A personal portfolio whose only job is to build trust and preference so that the
visitor wants to hire Sree Abiram as an AI engineer. Success = the visitor
understands who he is, what he builds, and how to contact him, and comes away
believing he can own an AI feature end to end.

## Positioning

A final-year undergraduate who builds complete, local-first AI systems rather
than notebook demos: structure-aware ingestion, retrieval, an agentic loop that
chooses its own tools, durable memory, and an auditable trail of every agent
decision — shipped as a working product with a real frontend.

The honest differentiator is the trajectory: unremarkable on paper, obsessive in
practice. Curiosity arrived before the marks did.

## Operating Context

Visitors arrive from a résumé link, LinkedIn, GitHub, or a recruiter's message,
usually on desktop during a screening pass, sometimes on a phone. They spend well
under a minute before deciding whether to keep reading. They will open GitHub in a
new tab if the work looks credible.

## Capabilities and Constraints

- Single-owner personal site; content changes are infrequent and hand-authored.
- Must remain deployable by `git push` to `main` with no manual steps.
- Must stay responsive; mobile is a real share of traffic from LinkedIn.
- Motion and 3D are explicitly requested by the owner, but must never block
  comprehension or reading, and must be fully disabled under
  `prefers-reduced-motion`.
- Domain is currently `Abiram116.github.io`; a custom domain is undecided.

### Terminology

RAG, agentic loop / ReAct, MCP, agent memory, vector store, embeddings — the
audience knows these words. Use them precisely rather than explaining them.

## Brand Commitments

- Name: **Sree Abiram Mandava**. Contact: sreeabirammandava@gmail.com.
- GitHub `Abiram116`, LinkedIn `sree-abiram-mandava-86b5a528b`.
- Voice: plain, specific, a little dry; confident without inflation. Willing to
  admit the unflattering parts of the story because they are true.
- The owner has explicitly released the previous visual identity (palette, type,
  tri-stripe motif, layout) — **nothing visual is pinned.** Content, facts and
  personality carry over; the old look is evidence and anti-reference only.

## Evidence on Hand

Real and verified:

- **Jignasa** — local-first AI assistant. Qwen3 via Ollama, FAISS, bge
  embeddings, Docling structure-aware PDF parsing, agentic ReAct tool loop,
  durable memory, queryable audit trail of agent decisions. FastAPI +
  React 19/TypeScript. `github.com/Abiram116/Jignasa`
- **SpaceLearn** — React Native study app: spaces/subspaces, AI tutor chat, PDF
  summarization, performance-based suggestions. Supabase.
  `github.com/Abiram116/SpaceLearn`
- Archive (second-year): Image Colorization (autoencoder + U-Net, CUDA/RTX 4060),
  Handwritten Digit Recognition (MNIST + Django), LinSolverX (simplex/graphical/
  transportation solvers), Recipeasy (Google auth, meal calendar, GSAP).
- **AWS Certified Cloud Practitioner** and **AWS Certified Developer — Associate**.
- **7th rank across Hyderabad**, LogIQids Logical Reasoning Olympiad.
- Volunteered on a **Guinness World Record** — Dr. APJ Abdul Kalam's portrait
  built from Rubik's cubes.
- **Linguaskill B2** (Cambridge) English proficiency.
- B.Tech AI & Data Science, KL University, 2023–2027. Based in Hyderabad, India.
- Personal photography in `assets/photos/` (Kalam, Nambi Narayanan, BMW M4,
  Defender, cat/cow/monkey, six game covers).

Absences that must never be fabricated:

- **No testimonials, recommendations or written quotes** from anyone.
- **No internship, freelance or client work.** No shipped-to-users metrics, no
  user counts, no revenue, no company logos.
- **No professional photograph of the owner exists yet.** The plan is to generate
  one with Higgsfield **from the owner's own real reference photos**, so it is his
  genuine likeness. A synthesized person who is not him must never be presented as
  him.

## Product Principles

1. **Trust over decoration.** Every section must move the visitor toward
   believing he can do the job. Effects that do not serve that are cut.
2. **Demonstrate, don't assert.** Show the architecture, the decisions and the
   trade-offs. "Built a RAG system" is a claim; a walkable agent graph is proof.
3. **Curate ruthlessly.** Four to six projects at most, best first. The archive
   exists to show growth, not volume.
4. **Honesty is the differentiator.** The average-marks origin story and the
   absence of client work are stated plainly, never dressed up or invented around.
5. **Fast to comprehend, deep on demand.** Who/what/why in the first viewport;
   depth lives one click away in case studies.

## Accessibility & Inclusion

- Full keyboard operability and visible focus for all interactive elements,
  including the React Flow diagram, which needs a non-pointer path to its content.
- `prefers-reduced-motion` must disable scroll-driven motion, 3D animation and
  autoplaying video, leaving a complete static experience.
- Real alt text on all imagery; decorative elements hidden from assistive tech.
- Colour contrast to WCAG AA against whatever palette the new world commits to.
