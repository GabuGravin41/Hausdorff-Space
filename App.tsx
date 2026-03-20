import React, { useState, useEffect, useRef } from 'react';
import TopologyViz from './components/TopologyViz';
import AIColloquium from './components/AIColloquium';

declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options: any) => void;
  }
}

const ScrambleHeader: React.FC<{
  text: string,
  className?: string,
  refCallback?: (el: HTMLElement | null) => void
}> = ({ text, className, refCallback }) => {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef<HTMLHeadingElement>(null);
  const hasAnimated = useRef(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        startScramble();
      }
    }, { threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [text]);

  const startScramble = () => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split("").map((char, index) => {
          if (index < iteration) return text[index];
          if (char === " ") return " ";
          return chars[Math.floor(Math.random() * chars.length)];
        }).join("")
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 30);
  };

  return (
    <h2
      ref={(el) => {
        // @ts-ignore
        containerRef.current = el;
        if (refCallback) refCallback(el);
      }}
      className={className}
    >
      {displayText}
    </h2>
  );
};

// Ambient floating mathematical symbols
const FloatingSymbols: React.FC = () => {
  const symbols = ['∀', '∃', '∅', 'ℝ', '∞', '∑', '∂', '∇', '⊂', '∩', '∴', 'λ', 'π', 'φ', '∈', 'ℕ', '⊕', '∫', '≡', '⊗'];
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {symbols.map((sym, i) => (
        <span
          key={i}
          className="absolute font-serif select-none animate-float-symbol"
          style={{
            left: `${(i * 19 + 3) % 96}%`,
            top: `${(i * 23 + 8) % 88}%`,
            animationDelay: `${i * 0.9}s`,
            animationDuration: `${10 + (i % 5) * 4}s`,
            fontSize: `${1.2 + (i % 3) * 0.6}rem`,
            color: `rgba(99, 102, 241, ${0.03 + (i % 4) * 0.015})`,
          }}
        >
          {sym}
        </span>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  const contactEmail = "hausdorfspaceT2@gmail.com";
  const substackUrl = "https://substack.com";
  const membershipFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLScmdopUeMBSdi4KKrpbeohZWvrQAGJPDW7n-HtUORa-lXnq0w/viewform?usp=publish-editor";

  const socialLinks = {
    substack: substackUrl,
    linkedin: "https://www.linkedin.com",
    instagram: "https://www.instagram.com",
    tiktok: "https://www.tiktok.com",
    youtube: "https://www.youtube.com",
  };

  const publications = [
    {
      type: "Nature 2023 · Decomposition",
      title: "AlphaFold & the Protein Folding Revolution",
      summary: "A public breakdown of the AlphaFold2 landmark — what the algorithm actually does, where it still fails, and why this is one of the most consequential results in modern biology.",
      date: "Mar 2024",
    },
    {
      type: "WIPO Feb 2024 · Patent Analysis",
      title: "Next-Gen Battery Cathode Architecture",
      summary: "Decomposing a February WIPO patent on lithium-ion cathode materials. We examine the claims, prior art landscape, and what this means for the global energy transition.",
      date: "Feb 2024",
    },
    {
      type: "Nature 2023 · Decomposition",
      title: "Room-Temperature Superconductivity: Claims vs. Evidence",
      summary: "Critical anatomy of the controversial LK-99 and related papers from Nature 2023. A rigorous look at what the results showed, what was retracted, and what it tells us about scientific epistemology.",
      date: "Jan 2024",
    },
    {
      type: "WIPO Feb 2024 · Patent Analysis",
      title: "Neuromorphic Computing Architecture Patent",
      summary: "An analysis of a WIPO neuromorphic chip patent — tracing the gap between the theoretical model of computation and the engineering constraints of physical implementation.",
      date: "Feb 2024",
    },
  ];

  const activities = [
    {
      type: "Meetup",
      title: "Inaugural Session",
      location: "August 7th Memorial Park, Nairobi",
      desc: "First convergence of the Abstract Chamber. Topology warm-up, proof presentations on metric spaces, and structured critical debate with assigned roles.",
      status: "Upcoming",
      statusColor: "text-green-400 border-green-400/30 bg-green-400/5",
    },
    {
      type: "School Outreach",
      title: "Informatics Olympiad Talk",
      location: "Nairobi High School",
      desc: "Introducing high school students to competitive programming and Mathematical Olympiad culture. Planting seeds for the next generation of rigorous thinkers in Kenya.",
      status: "Planned",
      statusColor: "text-haus-accent border-haus-accent/30 bg-haus-accent/5",
    },
    {
      type: "Math Camp",
      title: "Open Mathematics Gathering",
      location: "Nairobi (TBD)",
      desc: "A public drop-in session covering category theory, logic puzzles, and number theory. Open to anyone with the curiosity to show up — no prerequisites required.",
      status: "Planned",
      statusColor: "text-haus-accent border-haus-accent/30 bg-haus-accent/5",
    },
    {
      type: "Philosophy Circle",
      title: "From Kant to Information Theory",
      location: "Nairobi (TBD)",
      desc: "A structured discussion bridging Kantian epistemology and modern information theory. What is knowledge? What is signal? What is entropy? Is certainty even coherent?",
      status: "Planned",
      statusColor: "text-haus-accent border-haus-accent/30 bg-haus-accent/5",
    },
  ];

  const team = [
    {
      initials: "T²",
      name: "Founder",
      role: "IMO Alumnus · Mathematics",
      desc: "International Mathematical Olympiad participant and the driving force behind Hausdorff Space. Passionate about topology, analysis, and building rigorous intellectual communities.",
    },
    {
      initials: "∀",
      name: "Core Member",
      role: "Mathematics · Physics",
      desc: "Leads the Research Colloquium initiative. Deep interest in the intersection of theoretical physics and abstract mathematics.",
    },
    {
      initials: "∂",
      name: "Core Member",
      role: "Computer Science · Logic",
      desc: "Specializes in formal logic, computation theory, and the philosophy of mathematics. Bridges the abstract and the implementable.",
    },
  ];

  const navLinks = [
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Team', href: '#team' },
    { label: 'Publications', href: '#publications' },
    { label: 'Activities', href: '#activities' },
    { label: 'Colloquium', href: '#colloquium' },
    { label: 'Support', href: '#support' },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });

    const renderLaTeX = () => {
      if (document.compatMode !== 'CSS1Compat') return;
      if (typeof window.renderMathInElement === 'function') {
        try {
          window.renderMathInElement(document.body, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false }
            ],
            throwOnError: false
          });
        } catch (e) {
          console.debug("KaTeX render suppressed.");
        }
      }
    };

    const initialRenderTimeout = setTimeout(renderLaTeX, 100);
    const mathObserver = new MutationObserver(() => renderLaTeX());
    mathObserver.observe(document.body, { childList: true, subtree: true });

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('reveal-visible');
      });
    }, { threshold: 0.08 });

    revealRefs.current.forEach(ref => { if (ref) revealObserver.observe(ref); });

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(initialRenderTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      revealObserver.disconnect();
      mathObserver.disconnect();
    };
  }, []);

  const addToReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el);
      el.classList.add('reveal-hidden');
    }
  };

  const handleNavClick = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-haus-black">

      <FloatingSymbols />

      {/* Cursor Neighborhood Halo */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.04), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled || mobileMenuOpen ? 'bg-haus-black/90 backdrop-blur-xl border-haus-gray py-4' : 'bg-haus-black/30 backdrop-blur-md border-transparent py-4 md:bg-transparent md:backdrop-blur-none md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 relative z-50">
            <div className="w-4 h-4 border border-haus-accent rounded-full bg-transparent"></div>
            <div className="w-4 h-4 border border-white rounded-full bg-transparent -ml-2 mix-blend-difference"></div>
            <a href="#" className="text-white font-serif font-bold tracking-tight text-xl ml-2 hover:text-haus-accent transition-colors">Hausdorff Space</a>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex gap-6 items-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href={socialLinks.substack} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors border border-gray-700 px-3 py-1.5 hover:border-white">
              Substack
            </a>
            <a href={membershipFormUrl} target="_blank" rel="noreferrer" className="text-haus-accent hover:text-white font-mono text-xs uppercase tracking-widest transition-colors border border-haus-accent px-3 py-1.5 hover:bg-haus-accent">
              Join
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white z-50 focus:outline-none border border-white/20 bg-black/40 backdrop-blur-md rounded-lg p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-transform duration-300 lg:hidden flex items-center justify-center ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-white/20 bg-haus-black/70 backdrop-blur-2xl px-5 py-6 shadow-2xl">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={handleNavClick}
                  className="text-gray-100 font-serif text-lg px-4 py-2 rounded-lg border border-transparent hover:border-white/20 hover:bg-white/10 hover:text-haus-accent transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <a href={socialLinks.substack} target="_blank" rel="noreferrer" className="mt-5 block text-center text-gray-200 border border-white/30 rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
              Read Substack
            </a>
            <a href={membershipFormUrl} target="_blank" rel="noreferrer" className="mt-3 block text-center text-haus-accent border border-haus-accent/70 rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-haus-accent hover:text-white transition-colors">
              Apply to Join
            </a>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden border-b border-haus-gray">
        <TopologyViz />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none">
          <p className="text-haus-accent font-mono text-sm tracking-[0.2em] mb-4 uppercase animate-fade-in-up">Nairobi Intellectual Collective</p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Topology of <span className="italic text-gray-400">Thought</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            A space where any two distinct points can be separated by disjoint open neighborhoods.
            <br /><span className="text-haus-accent">No noise. No ambiguity. Just rigorous structure.</span>
          </p>
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <a href="#manifesto" className="inline-block border border-white text-white px-7 py-3 font-mono text-sm hover:bg-white hover:text-black transition-all">
              READ THE MANIFESTO
            </a>
            <a href={socialLinks.substack} target="_blank" rel="noreferrer" className="inline-block border border-white/40 text-gray-100 px-7 py-3 font-mono text-sm hover:border-white hover:bg-white/10 transition-all">
              READ SUBSTACK
            </a>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </header>

      {/* ─── MANIFESTO ─── */}
      <section id="manifesto" className="py-24 px-6 max-w-3xl mx-auto scroll-mt-20">
        <div className="prose prose-invert prose-lg">
          <ScrambleHeader
            text="1. The Axiom of Separation"
            className="text-3xl font-serif text-white border-b border-haus-gray pb-4 mb-8"
            refCallback={addToReveal}
          />
          <p className="text-gray-300 font-light leading-relaxed mb-6">
            In topology, a <span className="text-white font-serif italic">Hausdorff space</span> is one where for any two different points $x$ and $y$, there exist open sets $U$ containing $x$ and $V$ containing $y$ such that $U \cap V = \emptyset$.
          </p>
          <p className="text-gray-300 font-light leading-relaxed mb-6">
            We borrow this name deliberately. Hausdorff Space is not just a group — it is an intentional environment where serious thought can flourish without collapsing into noise, shallowness, or apathy. We create a space where ideas are cleanly separated, debated with precision, and allowed to converge only when they deserve to.
          </p>

          <ScrambleHeader
            text="2. Why We Exist"
            className="text-3xl font-serif text-white border-b border-haus-gray pb-4 mb-8 mt-16"
            refCallback={addToReveal}
          />
          <p className="text-gray-300 font-light leading-relaxed mb-4">Hausdorff Space was born from:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 font-light">
            <li>Frustration with shallow discourse and intellectual entropy in our surroundings.</li>
            <li>Loneliness among serious thinkers who crave peers capable of depth and rigor.</li>
            <li>A desire to build competence, kill anhedonic apathy, and restore meaning through disciplined intellectual work.</li>
            <li>A commitment to disseminating niche, domain-specific knowledge — research papers, patents, mathematical ideas — made accessible to the broader public.</li>
            <li>Preparation for larger ambitions: personal mastery, collaborative invention, and contributing to Kenya's intellectual and technological future.</li>
          </ul>

          <ScrambleHeader
            text="3. Our Mission"
            className="text-3xl font-serif text-white border-b border-haus-gray pb-4 mb-8 mt-16"
            refCallback={addToReveal}
          />
          <ul className="list-none space-y-4 pl-0">
            {[
              "To cultivate clarity, competence, courage, and output in thinking.",
              "To decompose and democratize niche scientific and technical knowledge — research papers, patents, and emerging ideas — for the masses.",
              "To provide a structured space where serious minds can present ideas uninterrupted.",
              "To organize public meetups, math camps, and school outreach that bring intellectual culture to the streets of Nairobi.",
              "To combat intellectual apathy through rigorous mathematical and philosophical work.",
            ].map((item, i) => (
              <li key={i} className="flex gap-4" ref={addToReveal}>
                <span className="text-haus-accent font-mono text-sm shrink-0">0{i + 1}</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── COLLECTIVE ─── */}
      <section id="collective" className="py-24 bg-neutral-900/30 border-y border-haus-gray scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-12 items-start mb-16">
            <div className="md:w-1/3">
              <ScrambleHeader
                text="The Collective"
                className="text-3xl font-serif text-white mb-4"
                refCallback={addToReveal}
              />
              <div className="h-1 w-12 bg-haus-accent"></div>
            </div>
            <div className="md:w-2/3">
              <p className="text-xl text-gray-300 font-light leading-relaxed">
                Hausdorff Space is a decentralized intellectual collective rooted in Nairobi. We are small by design. <span className="text-white">Density and discipline matter more than size.</span> We reject passive consumption. We pursue the sublime and beautiful through mathematics, science, philosophy, literature, and innovation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Mathematical Abstraction", desc: "Formal rigor serving as our cleanest model of seriousness. From Olympiad problems to category theory." },
              { title: "Scientific Analysis", desc: "Deep deconstruction of papers, patents, and technical innovations — made accessible to the public." },
              { title: "Philosophical Exploration", desc: "The pursuit of meaning, aesthetics, ethics, and civilization — from Kant to contemporary epistemology." },
              { title: "High-Signal Socialization", desc: "Meetups, camps, and circles where interactions support — not dilute — serious thought." },
            ].map((item, idx) => (
              <div key={idx} className="p-6 border border-haus-gray bg-haus-black hover:bg-neutral-900 transition-all hover:border-haus-accent group" ref={addToReveal}>
                <span className="text-haus-accent font-mono text-xs mb-3 block">0{idx + 1}</span>
                <h3 className="text-lg text-white font-serif mb-3 group-hover:translate-x-1 transition-transform">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── STRUCTURE ─── */}
      <section id="structure" className="py-24 bg-haus-black scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <ScrambleHeader
              text="Structure: Nucleus + Orbit"
              className="text-3xl font-serif text-white mb-4"
              refCallback={addToReveal}
            />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">We start lean and focused</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-haus-black border border-haus-gray p-8 hover:border-haus-accent transition-colors group relative overflow-hidden" ref={addToReveal}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <div className="w-10 h-10 bg-haus-gray rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-haus-accent transition-colors relative z-10">
                <span className="font-serif italic">N</span>
              </div>
              <h3 className="text-xl text-white font-serif mb-3 relative z-10">The Abstract Chamber</h3>
              <p className="text-xs font-mono text-haus-accent uppercase tracking-widest mb-4 relative z-10">Physical Core</p>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                The nucleus. Olympiad problems, advanced topology, algebra, and logic. Monthly meetings at August 7th Memorial Park. Proof presentations and high-rigor debate.
              </p>
            </div>

            <div className="bg-haus-black border border-haus-gray p-8 hover:border-haus-accent transition-colors group relative overflow-hidden" ref={addToReveal}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div className="w-10 h-10 bg-haus-gray rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-haus-accent transition-colors relative z-10">
                <span className="font-serif italic">C</span>
              </div>
              <h3 className="text-xl text-white font-serif mb-3 relative z-10">Research Colloquium</h3>
              <p className="text-xs font-mono text-haus-accent uppercase tracking-widest mb-4 relative z-10">Paper Analysis</p>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                Deep analysis of scientific papers (Nature, arXiv) and WIPO patents. Requires 1-page summaries published to the public. No passive consumption — active deconstruction of new knowledge.
              </p>
            </div>

            <div className="bg-haus-black border border-haus-gray p-8 hover:border-haus-accent transition-colors group relative overflow-hidden" ref={addToReveal}>
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div className="w-10 h-10 bg-haus-gray rounded-full flex items-center justify-center mb-6 text-white group-hover:bg-haus-accent transition-colors relative z-10">
                <span className="font-serif italic">F</span>
              </div>
              <h3 className="text-xl text-white font-serif mb-3 relative z-10">Patent Forge</h3>
              <p className="text-xs font-mono text-haus-accent uppercase tracking-widest mb-4 relative z-10">Innovation</p>
              <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                Patent breakdowns and invention ideas. Starting with the first 100 WIPO patents filed in February. Preparation for larger ambitions — personal mastery and contribution to Kenya's technological future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TEAM ─── */}
      <section id="team" className="py-24 bg-neutral-900/30 border-y border-haus-gray scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <ScrambleHeader
              text="The Core Team"
              className="text-3xl font-serif text-white mb-4"
              refCallback={addToReveal}
            />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Architects of the Space</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {team.map((member, i) => (
              <div
                key={i}
                className="border border-haus-gray p-8 bg-haus-black hover:border-haus-accent transition-all group relative overflow-hidden"
                ref={addToReveal}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-haus-accent/0 to-haus-accent/0 group-hover:from-haus-accent/3 group-hover:to-transparent transition-all duration-500"></div>
                <div className="w-16 h-16 rounded-full border border-haus-gray group-hover:border-haus-accent flex items-center justify-center mb-6 transition-colors relative z-10">
                  <span className="text-haus-accent font-serif italic text-2xl">{member.initials}</span>
                </div>
                <h3 className="text-white font-serif text-xl mb-1 relative z-10">{member.name}</h3>
                <p className="text-haus-accent font-mono text-xs uppercase tracking-widest mb-4 relative z-10">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed relative z-10">{member.desc}</p>
              </div>
            ))}
          </div>

          <div className="border border-dashed border-haus-gray p-8 text-center hover:border-haus-accent/50 transition-colors" ref={addToReveal}>
            <p className="text-gray-600 font-mono text-xs uppercase tracking-widest mb-3">Open Seats</p>
            <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">The collective is small by design. If you think in symbols, argue in structures, and create rather than consume — there may be a seat at the table.</p>
            <a href={membershipFormUrl} target="_blank" rel="noreferrer" className="inline-block border border-haus-accent text-haus-accent font-mono text-xs px-6 py-3 hover:bg-haus-accent hover:text-white transition-all uppercase tracking-widest">
              Apply to Join
            </a>
          </div>
        </div>
      </section>

      {/* ─── PUBLICATIONS ─── */}
      <section id="publications" className="py-24 bg-haus-black border-b border-haus-gray scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="md:w-1/3 md:sticky md:top-28">
              <ScrambleHeader
                text="Publications"
                className="text-3xl font-serif text-white mb-4"
                refCallback={addToReveal}
              />
              <div className="h-1 w-12 bg-haus-accent mb-6"></div>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                We decompose the top 100 papers published in <span className="text-gray-300">Nature 2023</span> and the first 100 patents filed at <span className="text-gray-300">WIPO in February</span> — making niche, domain-specific knowledge accessible to the broader public.
              </p>
              <p className="text-gray-600 text-xs leading-relaxed mb-8">
                Full write-ups, reviews, and critical analyses published on Substack.
              </p>
              <a
                href={socialLinks.substack}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 border border-haus-accent text-haus-accent font-mono text-xs px-4 py-3 hover:bg-haus-accent hover:text-white transition-all uppercase tracking-widest"
              >
                Read on Substack
                <span>→</span>
              </a>
            </div>

            <div className="md:w-2/3 space-y-4">
              {publications.map((pub, i) => (
                <div
                  key={i}
                  className="border border-haus-gray p-6 bg-haus-black hover:border-haus-accent hover:bg-neutral-900/40 transition-all group cursor-pointer"
                  ref={addToReveal}
                  onClick={() => window.open(socialLinks.substack, '_blank')}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-haus-accent font-mono text-xs uppercase tracking-widest">{pub.type}</span>
                    <span className="text-gray-700 font-mono text-xs">{pub.date}</span>
                  </div>
                  <h3 className="text-white font-serif text-xl mb-3 group-hover:text-haus-accent transition-colors leading-snug">
                    {pub.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{pub.summary}</p>
                  <div className="mt-4 flex items-center gap-2 text-gray-700 group-hover:text-haus-accent transition-colors">
                    <span className="font-mono text-xs uppercase tracking-widest">Read Full Decomposition</span>
                    <span className="text-sm">→</span>
                  </div>
                </div>
              ))}

              <div className="border border-dashed border-haus-gray p-6 text-center" ref={addToReveal}>
                <p className="text-gray-700 font-mono text-xs uppercase tracking-widest">More decompositions in progress</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── ACTIVITIES ─── */}
      <section id="activities" className="py-24 bg-neutral-900/30 border-b border-haus-gray scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <ScrambleHeader
              text="Activities on the Ground"
              className="text-3xl font-serif text-white mb-4"
              refCallback={addToReveal}
            />
            <p className="text-gray-500 font-mono text-xs uppercase tracking-widest">Meetups · Outreach · Math Camps · Philosophy Circles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activities.map((activity, i) => (
              <div
                key={i}
                className="border border-haus-gray p-8 bg-haus-black hover:border-haus-accent transition-all group relative overflow-hidden"
                ref={addToReveal}
              >
                <div className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-haus-accent to-transparent transition-all duration-500"></div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gray-600 font-mono text-xs uppercase tracking-widest">{activity.type}</span>
                  <span className={`font-mono text-xs border px-2 py-0.5 ${activity.statusColor}`}>
                    {activity.status}
                  </span>
                </div>
                <h3 className="text-white font-serif text-xl mb-2 group-hover:text-haus-accent transition-colors">{activity.title}</h3>
                <p className="text-gray-600 font-mono text-xs mb-4 flex items-center gap-1">
                  <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {activity.location}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">{activity.desc}</p>
              </div>
            ))}
          </div>

          {/* Gallery placeholder */}
          <div className="mt-12 border border-dashed border-haus-gray p-12 text-center" ref={addToReveal}>
            <p className="text-gray-600 font-mono text-xs uppercase tracking-widest mb-3">Gallery</p>
            <p className="text-gray-700 text-sm max-w-md mx-auto">Photos and documentation from past events will appear here as the collective gathers.</p>
          </div>
        </div>
      </section>

      {/* ─── AXIOMS ─── */}
      <section id="axioms" className="py-24 bg-haus-black border-b border-haus-gray scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6">
          <ScrambleHeader
            text="Axioms of Interaction"
            className="text-3xl font-serif text-white mb-12 text-center"
            refCallback={addToReveal}
          />
          <div className="space-y-0">
            {[
              { title: "Separation of Ideas", text: "Critique arguments rigorously, not people. Intellectual humility is strength." },
              { title: "Output Required", text: "Consumption without production leads to entropy. Active members must contribute — presentations, summaries, proofs, essays." },
              { title: "High Signal Only", text: "No vague rants, no ego competitions, no unexamined politics." },
              { title: "Respect for Presentation", text: "Uninterrupted time for speakers (20–40 min). Followed by structured debate: clarification first, then critique." },
              { title: "Accountability", text: "Rotations for presenters and moderators. Passive attendance is discouraged." },
            ].map((axiom, i) => (
              <div key={i} className="flex flex-col md:flex-row border-b border-haus-gray py-8 last:border-0 hover:bg-white/5 transition-colors px-4" ref={addToReveal}>
                <div className="md:w-1/4 mb-2 md:mb-0">
                  <span className="font-mono text-haus-accent text-xs">AXIOM 0{i + 1}</span>
                </div>
                <div className="md:w-1/4 mb-2 md:mb-0">
                  <h4 className="text-white font-serif font-bold">{axiom.title}</h4>
                </div>
                <div className="md:w-1/2">
                  <p className="text-gray-400 text-sm leading-relaxed">{axiom.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI COLLOQUIUM ─── */}
      <AIColloquium />

      {/* ─── ROADMAP ─── */}
      <section id="roadmap" className="py-24 bg-haus-black border-b border-haus-gray scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <ScrambleHeader
            text="Initialization Sequence"
            className="text-3xl font-serif text-white mb-12 text-center"
            refCallback={addToReveal}
          />
          <div className="relative border-l border-haus-gray ml-3 md:ml-6 space-y-12 pb-4">
            {[
              { phase: "Phase 0", title: "Nucleus Formation", details: "Commit to 5–8 serious mathematicians for the Abstract Chamber core." },
              { phase: "Phase 1", title: "First Convergence", details: "Schedule first physical meeting at August 7th Memorial Park. Enforce output & presentation norms from day one." },
              { phase: "Phase 2", title: "Digital Presence", details: "Launch Substack (Hausdorff Letters) + website. Publish first paper decompositions and patent analyses." },
              { phase: "Phase 3", title: "Public Expansion", details: "Open math camps, school outreach, and philosophy circles to the public. Invite aligned thinkers." },
            ].map((step, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12" ref={addToReveal}>
                <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 bg-haus-black border border-haus-accent rounded-full"></div>
                <span className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1 block">{step.phase}</span>
                <h3 className="text-xl text-white font-serif mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.details}</p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-12 border-t border-haus-gray" ref={addToReveal}>
            <div className="text-center">
              <span className="font-mono text-haus-accent text-xs uppercase tracking-widest mb-3 block">Future Horizon</span>
              <h3 className="text-2xl text-white font-serif mb-6">Long-Term Vision</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {[
                { title: "Hybrid Rhythm", desc: "Consistent physical core meetings combined with online depth and asynchronous discourse." },
                { title: "Intellectual Archive", desc: "Monthly publications that become a respected Kenyan intellectual repository." },
                { title: "Strategic Collaborations", desc: "Partnerships with universities, IEEE Kenya, and startup ecosystems." },
                { title: "Innovation Node", desc: "Evolution into a broader salon or innovation hub, strictly after proving seriousness." },
              ].map((item, i) => (
                <div key={i} className="bg-neutral-900/30 p-6 border border-haus-gray hover:border-white transition-colors">
                  <h4 className="text-white font-serif mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── SUPPORT / DONATE ─── */}
      <section id="support" className="py-24 bg-neutral-900/50 border-b border-haus-gray scroll-mt-20">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <ScrambleHeader
              text="Support the Space"
              className="text-3xl font-serif text-white mb-4"
              refCallback={addToReveal}
            />
            <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
              Hausdorff Space is community-funded. Your contribution — however small — supports meetups, printed materials, school outreach, and keeping the intellectual spirit alive on the ground in Nairobi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" ref={addToReveal}>
            {[
              { amount: "KES 200", label: "Coffee Round", desc: "Fuel a session" },
              { amount: "KES 500", label: "Print Run", desc: "Fund materials" },
              { amount: "KES 1,000", label: "Event Support", desc: "Help a meetup" },
              { amount: "KES 2,500", label: "Camp Patron", desc: "Back a math camp" },
            ].map((tier, i) => (
              <a
                key={i}
                href={`mailto:${contactEmail}?subject=Donation - ${tier.label}&body=Hi Hausdorff Space, I would like to donate ${tier.amount} to support ${tier.desc}.`}
                className="border border-haus-gray p-4 text-center hover:border-haus-accent hover:bg-neutral-900/40 transition-all group"
              >
                <div className="text-white font-mono font-bold text-lg mb-1 group-hover:text-haus-accent transition-colors">{tier.amount}</div>
                <div className="text-gray-400 font-serif text-sm mb-1">{tier.label}</div>
                <div className="text-gray-700 text-xs">{tier.desc}</div>
              </a>
            ))}
          </div>

          <div className="text-center" ref={addToReveal}>
            <a
              href={`mailto:${contactEmail}?subject=Custom Donation - Hausdorff Space&body=Hi Hausdorff Space, I'd like to contribute a custom amount.`}
              className="inline-block border border-white/20 text-gray-400 font-mono text-xs px-6 py-3 hover:border-haus-accent hover:text-haus-accent transition-all uppercase tracking-widest"
            >
              Custom Amount — Email Us
            </a>
            <p className="text-gray-700 text-xs mt-4 font-mono">{contactEmail}</p>
          </div>
        </div>
      </section>

      {/* ─── UPCOMING EVENT ─── */}
      <section id="events" className="py-24 px-6 max-w-4xl mx-auto text-center scroll-mt-20">
        <ScrambleHeader
          text="Join the Next Convergence"
          className="text-3xl font-serif text-white mb-8"
          refCallback={addToReveal}
        />
        <div className="inline-block border border-haus-gray bg-haus-black p-8 text-left max-w-md w-full relative group hover:border-haus-accent transition-colors" ref={addToReveal}>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-haus-black via-haus-accent to-haus-black"></div>
          <p className="font-mono text-haus-accent text-xs mb-2">UPCOMING MEETING</p>
          <h3 className="text-2xl text-white font-serif mb-1">Inaugural Session</h3>
          <p className="text-gray-500 text-sm mb-6">Saturday Morning · August 7th Memorial Park, Nairobi</p>

          <div className="space-y-3 mb-8">
            {[
              { time: "09:00", label: "Warm-up Puzzle" },
              { time: "10:00", label: "Main Presentation (Topology)" },
              { time: "11:30", label: "Critique & Assignments" },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 text-sm text-gray-300">
                <span className="font-mono text-gray-600">{item.time}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          <a
            href={membershipFormUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-white text-black font-mono text-sm py-3 text-center hover:bg-gray-200 transition-colors uppercase tracking-widest"
          >
            Confirm Attendance
          </a>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-haus-gray py-16 bg-neutral-900/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 border border-haus-accent rounded-full"></div>
                <div className="w-3 h-3 border border-white rounded-full -ml-1.5 mix-blend-difference"></div>
                <span className="text-white font-serif font-bold ml-2">Hausdorff Space</span>
              </div>
              <p className="text-gray-600 font-mono text-xs uppercase tracking-widest mb-4">Topology of Thought · Nairobi</p>
              <p className="text-gray-700 text-xs leading-relaxed max-w-xs">
                Where any two distinct points can be separated by disjoint open neighborhoods. $T_2$ space. Nairobi, Kenya.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-4">Navigate</h4>
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} className="block text-gray-600 hover:text-white text-sm transition-colors font-mono">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-4">Follow the Work</h4>
              <div className="space-y-3">
                {[
                  { label: "Substack", url: socialLinks.substack, desc: "Essays & paper decompositions" },
                  { label: "LinkedIn", url: socialLinks.linkedin, desc: "Professional updates" },
                  { label: "Instagram", url: socialLinks.instagram, desc: "Behind the scenes" },
                  { label: "TikTok", url: socialLinks.tiktok, desc: "Short-form ideas" },
                  { label: "YouTube", url: socialLinks.youtube, desc: "Lectures & discussions" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between group"
                  >
                    <span className="text-gray-500 hover:text-white text-xs font-mono uppercase tracking-widest transition-colors group-hover:text-white">{s.label}</span>
                    <span className="text-gray-800 text-xs group-hover:text-gray-500 transition-colors">{s.desc}</span>
                  </a>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-haus-gray">
                <p className="text-gray-700 text-xs font-mono mb-1">Contact</p>
                <a href={`mailto:${contactEmail}`} className="text-gray-500 hover:text-haus-accent text-xs transition-colors font-mono">
                  {contactEmail}
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-haus-gray pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-800 text-xs font-mono">
              © {new Date().getFullYear()} Hausdorff Space Collective. All rights reserved.
            </p>
            <p className="text-gray-800 text-xs font-mono italic">
              ∀ x ≠ y ∈ X, ∃ U ∋ x, V ∋ y : U ∩ V = ∅
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;
