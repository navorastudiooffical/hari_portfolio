import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Check, Copy, Menu, MoveRight, X } from "lucide-react";

const projects = [
  { number: "01", type: "Digital identity", title: "Northstar", copy: "A confident new world for a product team building the future of work.", tags: ["Strategy", "Identity", "Web"], tone: "cobalt" },
  { number: "02", type: "Editorial platform", title: "Morrow", copy: "A slower, warmer internet for independent voices and ideas worth keeping.", tags: ["Art direction", "Product", "Editorial"], tone: "coral" },
  { number: "03", type: "Research product", title: "Field Notes", copy: "Turning complex research into a clear tool people actually want to use.", tags: ["UX", "Development", "Motion"], tone: "lime" },
];

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--delay": `${delay}ms` }}>{children}</div>;
}

function ProjectVisual({ tone, number }) {
  return <div className={`project-visual project-visual--${tone}`}><div className="visual-grid" /><div className="visual-orbit"><span /><span /><span /></div><div className="visual-index">{number}</div><div className="visual-caption">Scroll / Explore</div></div>;
}

export default function HariharanPortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const email = "hello@hariharan.studio";
  useEffect(() => {
    const move = (event) => setPointer({ x: (event.clientX / window.innerWidth - 0.5) * 2, y: (event.clientY / window.innerHeight - 0.5) * 2 });
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const copyEmail = async () => { await navigator.clipboard?.writeText(email); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  const closeMenu = () => setMenuOpen(false);
  return <div className="site-shell" id="top">
    <header className="site-header"><a className="wordmark" href="#top" onClick={closeMenu}>H<span>/</span></a><nav className={menuOpen ? "site-nav is-open" : "site-nav"}><a href="#work" onClick={closeMenu}>Work</a><a href="#about" onClick={closeMenu}>Approach</a><a href="#contact" onClick={closeMenu}>Contact</a><a className="nav-status" href="#contact" onClick={closeMenu}><i />Available for select work</a></nav><button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button></header>
    <main>
      <section className="hero section-wrap"><div className="hero-top"><Reveal><p className="kicker">Independent designer / developer <span>—</span> 2024–now</p></Reveal><Reveal delay={90}><p className="hero-location">Bengaluru, India<br />12°58&apos; N, 77°35&apos; E</p></Reveal></div><div className="hero-main"><Reveal delay={120}><h1>Ideas<br /><em>in motion.</em></h1></Reveal><div className="hero-visual" style={{ transform: `translate3d(${pointer.x * 10}px, ${pointer.y * 10}px, 0)` }}><div className="hero-visual__core"><span>H</span></div><div className="hero-visual__ring hero-visual__ring--one" /><div className="hero-visual__ring hero-visual__ring--two" /><span className="hero-visual__label">01 / 01<br />Make it matter.</span></div></div><div className="hero-bottom"><p>Designing brands, products,<br />and digital worlds for people<br />with something worth saying.</p><a href="#work" className="round-link" aria-label="Scroll to selected work"><ArrowDownRight /></a><span className="scroll-note">Scroll to explore <MoveRight /></span></div></section>
      <section id="work" className="feature section-wrap"><div className="section-heading"><Reveal><p className="kicker">Selected work <span>—</span> 01—03</p></Reveal><Reveal delay={80}><h2>Work that<br /><em>moves people.</em></h2></Reveal></div><Reveal delay={120}><article className="feature-card"><div className="feature-card__copy"><p className="feature-card__number">01 / Northstar</p><h3>Building a clearer<br /><em>way forward.</em></h3><p>Northstar is a new identity for teams who are not waiting for the future. A visual system built to feel directional, optimistic, and impossible to ignore.</p><a className="text-link" href="#contact">View case study <ArrowUpRight /></a></div><div className="feature-card__art"><div className="art-word">NORTH<br /><span>STAR</span></div><div className="art-line" /><span className="art-meta">Identity / Digital / 2024</span></div></article></Reveal></section>
      <section className="projects section-wrap"><div className="projects-intro"><p className="kicker">A closer look</p><p>Three recent collaborations,<br />each with a different question.</p></div><div className="project-list">{projects.map((project, index) => <Reveal key={project.number} delay={index * 80}><article className="project-row"><ProjectVisual tone={project.tone} number={project.number} /><div className="project-row__body"><p className="project-type">{project.type}</p><h3>{project.title}</h3><p>{project.copy}</p><div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><a className="text-link" href="#contact">Explore project <ArrowUpRight /></a></div></article></Reveal>)}</div></section>
      <section id="about" className="about section-wrap"><div className="about-top"><Reveal><p className="kicker">The approach</p></Reveal><Reveal delay={80}><p className="about-lead">The best work lives at the intersection of <em>clarity</em> and feeling.</p></Reveal></div><div className="about-grid"><Reveal><p className="big-number">02</p></Reveal><Reveal delay={100}><div className="about-copy"><p>I work across strategy, identity, and technology to turn ambitious ideas into clear, memorable experiences.</p><p>Every project starts with listening. Then we find the one true thing, make it visible, and build from there.</p><a className="text-link" href="#contact">More about the process <ArrowUpRight /></a></div></Reveal></div><div className="principles"><span>01 / Listen closely</span><span>02 / Make it useful</span><span>03 / Make it last</span></div></section>
      <section className="marquee" aria-label="Design philosophy"><div>MAKE IT <em>USEFUL</em> — MAKE IT <em>FELT</em> — MAKE IT <em>LAST</em> — </div></section>
      <section id="contact" className="contact section-wrap"><Reveal><p className="kicker">Have a project in mind?</p><h2>Let&apos;s make<br /><em>something matter.</em></h2></Reveal><div className="contact-bottom"><div><a className="email-link" href={`mailto:${email}`}>{email}<ArrowUpRight /></a><button className="copy-button" onClick={copyEmail}>{copied ? <Check /> : <Copy />} {copied ? "Copied to clipboard" : "Copy email"}</button></div><div className="contact-side"><p>New projects, collaborations,<br />and good conversations.</p><div><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a></div></div></div></section>
    </main><footer className="site-footer section-wrap"><span>© {new Date().getFullYear()} Hariharan</span><span>Made with intention</span><a href="#top">Back to top ↑</a></footer>
  </div>;
}
