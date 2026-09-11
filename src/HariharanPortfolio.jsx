import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Copy, Menu, X } from "lucide-react";

const projects = [
  { year: "2024", category: "Brand system", title: "Northstar", description: "A new visual language for the teams building what comes next.", tone: "blue", number: "01" },
  { year: "2024", category: "Digital experience", title: "Morrow", description: "An editorial space for slow ideas and independent voices.", tone: "orange", number: "02" },
  { year: "2023", category: "Product design", title: "Field Notes", description: "Making complex research feel simple, useful, and human.", tone: "green", number: "03" },
];

function Reveal({ children, className = "", delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--delay": `${delay}ms` }}>{children}</div>;
}

function MagneticOrb({ tone }) {
  return <div className={`orb orb--${tone}`} aria-hidden="true"><div className="orb__shine" /><div className="orb__ring" /></div>;
}

function ProjectCard({ project }) {
  return <article className="project-card">
    <div className="project-card__visual"><MagneticOrb tone={project.tone} /><span className="project-card__number">{project.number}</span></div>
    <div className="project-card__info"><div><p className="eyebrow">{project.category} · {project.year}</p><h3>{project.title}</h3></div><p>{project.description}</p><a href="#contact" aria-label={`View ${project.title} project`}>Explore <ArrowUpRight size={16} /></a></div>
  </article>;
}

export default function HariharanPortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = "hello@hariharan.studio";
  const copyEmail = async () => { await navigator.clipboard?.writeText(email); setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
  const closeMenu = () => setMenuOpen(false);

  return <div className="site-shell">
    <header className="site-header"><a className="wordmark" href="#top" onClick={closeMenu}>H<span>.</span></a><button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X /> : <Menu />}</button><nav className={menuOpen ? "site-nav is-open" : "site-nav"}><a href="#work" onClick={closeMenu}>Work</a><a href="#about" onClick={closeMenu}>About</a><a href="#contact" onClick={closeMenu}>Contact</a><a className="nav-pill" href="#contact" onClick={closeMenu}><span />Available now</a></nav></header>
    <main id="top">
      <section className="hero section-wrap"><div className="hero__copy"><Reveal><p className="eyebrow hero__eyebrow"><span />Independent designer &amp; developer</p></Reveal><Reveal delay={100}><h1>Designing for<br /><span>what&apos;s next.</span></h1></Reveal><Reveal delay={180}><p className="hero__description">I&apos;m Hariharan — I make brands, products, and digital experiences for people with something worth saying.</p></Reveal></div><div className="hero__orb"><MagneticOrb tone="hero" /></div><div className="hero__footer"><span>Based in Bengaluru, India</span><span>Scroll to explore <ArrowDown size={14} /></span></div></section>
      <section id="work" className="work section-wrap"><div className="section-intro"><Reveal><p className="eyebrow">Selected work</p></Reveal><Reveal delay={80}><h2>A few things<br /><span>I&apos;ve made.</span></h2></Reveal></div><div className="project-grid">{projects.map((project, index) => <Reveal key={project.number} delay={index * 100}><ProjectCard project={project} /></Reveal>)}</div></section>
      <section id="about" className="about section-wrap"><Reveal><p className="eyebrow">A little about me</p></Reveal><div className="about__layout"><Reveal><h2>Clarity is<br /><span>the craft.</span></h2></Reveal><Reveal delay={120} className="about__text"><p>I work across strategy, identity, and technology to turn ambitious ideas into clear, memorable experiences.</p><p>My approach is simple: listen closely, ask better questions, and make the invisible feel inevitable.</p><a className="line-link" href="#contact">Let&apos;s work together <ArrowUpRight size={16} /></a></Reveal></div><div className="principles"><div><span>01</span><strong>Make it useful</strong></div><div><span>02</span><strong>Make it felt</strong></div><div><span>03</span><strong>Make it last</strong></div></div></section>
      <section className="statement section-wrap"><Reveal><p>“The best design doesn&apos;t shout. It makes the right thing feel obvious.”</p><span>— Hariharan</span></Reveal></section>
      <section id="contact" className="contact section-wrap"><Reveal><p className="eyebrow">Have a project in mind?</p><h2>Let&apos;s make<br /><span>something great.</span></h2></Reveal><div className="contact__row"><a className="email-link" href={`mailto:${email}`}>{email} <ArrowUpRight size={18} /></a><button className="copy-button" onClick={copyEmail}>{copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Copied" : "Copy email"}</button><div className="social-links"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a></div></div></section>
    </main><footer className="site-footer section-wrap"><span>© {new Date().getFullYear()} Hariharan</span><span>Designed with intention</span><a href="#top">Back to top ↑</a></footer>
  </div>;
}
