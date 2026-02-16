import React, { useState, useEffect, useRef } from 'react';
import TopologyViz from './components/TopologyViz';
import AIColloquium from './components/AIColloquium';

declare global {
  interface Window {
    renderMathInElement: (element: HTMLElement, options: any) => void;
  }
}

/**
 * ScrambleHeader: Cycles through random characters and settles them from left to right.
 * Fulfills the "puzzle sorting" requirement for topic headers.
 */
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
        text.split("")
          .map((char, index) => {
            if (index < iteration) return text[index];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3; // Controls speed of resolution (roughly 3 frames per letter)
    }, 30);
  };

  return (
    <h2 
      ref={(el) => {
        // Maintain local ref for the observer
        // @ts-ignore
        containerRef.current = el;
        // Support parent's reveal-hidden logic
        if (refCallback) refCallback(el);
      }} 
      className={className}
    >
      {displayText}
    </h2>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // LaTeX Rendering Observer: Automatically finds and renders math as content appears
    const renderLaTeX = () => {
      // KaTeX specifically requires standards mode (CSS1Compat) to avoid "quirks mode" errors
      if (document.compatMode !== 'CSS1Compat') {
        return;
      }

      if (typeof window.renderMathInElement === 'function') {
        try {
          window.renderMathInElement(document.body, {
            delimiters: [
              {left: '$$', right: '$$', display: true},
              {left: '$', right: '$', display: false}
            ],
            throwOnError: false
          });
        } catch (e) {
          // Gracefully catch any internal KaTeX parsing errors
          console.debug("KaTeX Render suppressed during transition.");
        }
      }
    };

    // Minor timeout to ensure the DOM is ready and the browser has confirmed standards mode
    const initialRenderTimeout = setTimeout(renderLaTeX, 100);
    const mathObserver = new MutationObserver(() => renderLaTeX());
    mathObserver.observe(document.body, { childList: true, subtree: true });

    // Intersection Observer for Scroll Reveals
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
        }
      });
    }, { threshold: 0.1 });

    revealRefs.current.forEach(ref => {
      if (ref) revealObserver.observe(ref);
    });

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

  const navLinks = [
    { label: 'Manifesto', href: '#manifesto' },
    { label: 'Collective', href: '#collective' },
    { label: 'Structure', href: '#structure' },
    { label: 'Axioms', href: '#axioms' },
    { label: 'Colloquium', href: '#colloquium' },
    { label: 'Roadmap', href: '#roadmap' },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-haus-black">
      
      {/* Cursor Neighborhood Halo */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.04), transparent 80%)`
        }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${scrolled || mobileMenuOpen ? 'bg-haus-black/85 backdrop-blur-xl border-haus-gray py-4' : 'bg-haus-black/30 backdrop-blur-md border-transparent py-4 md:bg-transparent md:backdrop-blur-none md:py-6'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 relative z-50">
            <div className="w-4 h-4 border border-haus-accent rounded-full bg-transparent"></div>
            <div className="w-4 h-4 border border-white rounded-full bg-transparent -ml-2 mix-blend-difference"></div>
            <a href="#" className="text-white font-serif font-bold tracking-tight text-xl ml-2 hover:text-haus-accent transition-colors">Hausdorff Space</a>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="text-gray-400 hover:text-white font-mono text-xs uppercase tracking-widest transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScmdopUeMBSdi4KKrpbeohZWvrQAGJPDW7n-HtUORa-lXnq0w/viewform?usp=publish-editor" target="_blank" rel="noreferrer" className="text-haus-accent hover:text-white font-mono text-xs uppercase tracking-widest transition-colors border border-haus-accent px-3 py-1 hover:bg-haus-accent">
                Join
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white z-50 focus:outline-none border border-white/20 bg-black/40 backdrop-blur-md rounded-lg p-2"
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
        <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-transform duration-300 md:hidden flex items-center justify-center ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="w-[calc(100%-3rem)] max-w-sm rounded-2xl border border-white/20 bg-haus-black/60 backdrop-blur-2xl px-5 py-6 shadow-2xl">
            <div className="flex flex-col gap-3">
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
            <a href="https://docs.google.com/forms/d/e/1FAIpQLScmdopUeMBSdi4KKrpbeohZWvrQAGJPDW7n-HtUORa-lXnq0w/viewform?usp=publish-editor" target="_blank" rel="noreferrer" className="mt-5 block text-center text-haus-accent border border-haus-accent/70 rounded-lg px-4 py-2 font-mono text-xs uppercase tracking-widest hover:bg-haus-accent hover:text-white transition-colors">
              Apply to Join
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden border-b border-haus-gray">
        <TopologyViz />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pointer-events-none">
          <p className="text-haus-accent font-mono text-sm tracking-[0.2em] mb-4 uppercase animate-fade-in-up">Nairobi Intellectual Collective</p>
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Topology of <span className="italic text-gray-400">Thought</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            A space where any two distinct points can be separated by disjoint open neighborhoods. 
            <br/><span className="text-haus-accent">No noise. No ambiguity. Just rigorous structure.</span>
          </p>
          <a href="#manifesto" className="pointer-events-auto inline-block border border-white text-white px-8 py-3 font-mono text-sm hover:bg-white hover:text-black transition-all animate-fade-in" style={{ animationDelay: '0.6s' }}>
            READ THE MANIFESTO
          </a>
        </div>
        
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-gray-600">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </header>

      {/* Manifesto Section */}
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
            We borrow this name deliberately. Hausdorff Space is not just a group—it is an intentional environment where serious thought can flourish without collapsing into noise, shallowness, or apathy. We create a space where ideas are cleanly separated, debated with precision, and allowed to converge only when they deserve to.
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
             <li>Preparation for larger ambitions — whether personal mastery, collaborative invention, or contributing to Kenya’s intellectual and technological future.</li>
          </ul>

          <ScrambleHeader 
            text="3. Our Mission" 
            className="text-3xl font-serif text-white border-b border-haus-gray pb-4 mb-8 mt-16" 
            refCallback={addToReveal}
          />
          <ul className="list-none space-y-4 pl-0">
             <li className="flex gap-4">
                <span className="text-haus-accent font-mono">01</span>
                <span className="text-gray-300">To cultivate clarity, competence, courage, and output in thinking.</span>
             </li>
             <li className="flex gap-4">
                <span className="text-haus-accent font-mono">02</span>
                <span className="text-gray-300">To provide a structured space where serious minds can present ideas uninterrupted.</span>
             </li>
             <li className="flex gap-4">
                <span className="text-haus-accent font-mono">03</span>
                <span className="text-gray-300">To combat intellectual apathy through rigorous mathematical and philosophical work.</span>
             </li>
          </ul>
        </div>
      </section>

      {/* Who We Are Section */}
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
                        Hausdorff Space is a decentralized intellectual collective. We are small by design at the start. <span className="text-white">Density and discipline matter more than size.</span> We reject passive consumption. We pursue the sublime and beautiful through mathematics, science, philosophy, and innovation.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Mathematical Abstraction", desc: "Formal rigor serving as our cleanest model of seriousness." },
                    { title: "Scientific Analysis", desc: "Deep deconstruction of papers, patents, and technical innovations." },
                    { title: "Philosophical Exploration", desc: "The pursuit of meaning, aesthetics, ethics, and civilization." },
                    { title: "High-Signal Socialization", desc: "Interactions that support—not dilute—serious thought." }
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

      {/* Structure Grid */}
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
                {/* Card 1 */}
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

                {/* Card 2 */}
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
                        Deep analysis of scientific papers (Nature, arXiv). Requires 1-page summaries. No passive consumption—active deconstruction of new knowledge.
                    </p>
                </div>

                 {/* Card 3 */}
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
                         Patent breakdowns and invention ideas. Preparation for larger ambitions—personal mastery and contribution to Kenya’s technological future.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section id="axioms" className="py-24 bg-neutral-900/50 border-y border-haus-gray scroll-mt-20">
        <div className="max-w-4xl mx-auto px-6">
            <ScrambleHeader 
              text="Axioms of Interaction" 
              className="text-3xl font-serif text-white mb-12 text-center" 
              refCallback={addToReveal}
            />
            <div className="space-y-0">
                {[
                    { title: "Separation of Ideas", text: "Critique arguments rigorously, not people. Intellectual humility is strength." },
                    { title: "Output Required", text: "Consumption without production leads to entropy. Active members must contribute—presentations, summaries, proofs, essays." },
                    { title: "High Signal Only", text: "No vague rants, no ego competitions, no unexamined politics." },
                    { title: "Respect for Presentation", text: "Uninterrupted time for speakers (20–40 min). Followed by structured debate: clarification first, then critique." },
                    { title: "Accountability", text: "Rotations for presenters and moderators. Passive attendance is discouraged." }
                ].map((axiom, i) => (
                    <div key={i} className="flex flex-col md:flex-row border-b border-haus-gray py-8 last:border-0 hover:bg-white/5 transition-colors px-4" ref={addToReveal}>
                        <div className="md:w-1/4 mb-2 md:mb-0">
                            <span className="font-mono text-haus-accent text-xs">AXIOM 0{i+1}</span>
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

      {/* AI Interaction */}
      <AIColloquium />

      {/* Roadmap Section */}
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
                    { phase: "Phase 2", title: "Digital Presence", details: "Launch Substack (Hausdorff Letters) + basic website. Archive thoughts." },
                    { phase: "Phase 3", title: "Expansion", details: "After 2–3 consistent math meetings, open online domains and invite aligned thinkers." }
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
                     <div className="bg-neutral-900/30 p-6 border border-haus-gray hover:border-white transition-colors">
                        <h4 className="text-white font-serif mb-2">Hybrid Rhythm</h4>
                        <p className="text-sm text-gray-400">Consistent physical core meetings combined with online depth and asynchronous discourse.</p>
                     </div>
                     <div className="bg-neutral-900/30 p-6 border border-haus-gray hover:border-white transition-colors">
                        <h4 className="text-white font-serif mb-2">Intellectual Archive</h4>
                        <p className="text-sm text-gray-400">Monthly publications that become a respected Kenyan intellectual repository.</p>
                     </div>
                     <div className="bg-neutral-900/30 p-6 border border-haus-gray hover:border-white transition-colors">
                        <h4 className="text-white font-serif mb-2">Strategic Collaborations</h4>
                        <p className="text-sm text-gray-400">Partnerships with universities, IEEE Kenya, and startup ecosystems.</p>
                     </div>
                     <div className="bg-neutral-900/30 p-6 border border-haus-gray hover:border-white transition-colors">
                        <h4 className="text-white font-serif mb-2">Innovation Node</h4>
                        <p className="text-sm text-gray-400">Evolution into a broader salon or innovation hub, strictly after proving seriousness.</p>
                     </div>
                 </div>
            </div>
        </div>
      </section>

      {/* Events / Footer */}
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
            <p className="text-gray-500 text-sm mb-6">Saturday Morning, August 7th Memorial Park</p>
            
            <div className="space-y-3 mb-8">
                <div className="flex gap-3 text-sm text-gray-300">
                    <span className="font-mono text-gray-600">09:00</span>
                    <span>Warm-up Puzzle</span>
                </div>
                <div className="flex gap-3 text-sm text-gray-300">
                    <span className="font-mono text-gray-600">10:00</span>
                    <span>Main Presentation (Topology)</span>
                </div>
                <div className="flex gap-3 text-sm text-gray-300">
                    <span className="font-mono text-gray-600">11:30</span>
                    <span>Critique & Assignments</span>
                </div>
            </div>

            <button className="w-full bg-white text-black font-mono text-sm py-3 hover:bg-gray-200 transition-colors uppercase tracking-widest">
                Confirm Attendance
            </button>
         </div>
      </section>

      <footer className="border-t border-haus-gray py-12 bg-neutral-900/20">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 text-left md:text-center">
            <div className="md:text-right md:border-r md:border-gray-800 md:pr-8">
                <p className="text-white font-serif text-lg mb-2">Hausdorff Space</p>
                <p className="text-gray-600 font-mono text-xs uppercase tracking-widest mb-6">Topology of Thought • Nairobi</p>
                <p className="text-gray-800 text-xs">
                    © {new Date().getFullYear()} Hausdorff Space Collective.
                </p>
            </div>
            <div className="md:text-left md:pl-8 flex flex-col justify-center gap-4">
                 <h4 className="text-haus-text font-serif italic text-sm text-gray-400">Hausdorff Letters</h4>
                 <p className="text-xs text-gray-600 max-w-xs">Monthly publications: math expositions, paper notes, philosophical pieces.</p>
                 <div className="flex gap-6 mt-2">
                    <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">Read Substack</a>
                    <a href="#" className="text-gray-500 hover:text-white transition-colors text-xs font-mono uppercase tracking-widest">WhatsApp</a>
                 </div>
            </div>
        </div>
      </footer>

    </div>
  );
};

export default App;