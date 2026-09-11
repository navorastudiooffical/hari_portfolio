import { useEffect, useState } from "react";
import { ArrowUpRight, Copy, Check, Menu, X, MoveUpRight } from "lucide-react";

const projects = [
  { number: "01", type: "Brand identity · 2024", title: "Northstar\nStudio", copy: "A calm, considered identity for a digital product studio working at the edge of culture and technology.", className: "project-card--navy", mark: "NS" },
  { number: "02", type: "Web design · 2024", title: "Morrow\nJournal", copy: "An editorial platform for slow ideas, independent voices, and the people shaping tomorrow.", className: "project-card--peach", mark: "M" },
  { number: "03", type: "Digital product · 2023", title: "Field\nNotes", copy: "A flexible research workspace that makes complex information feel clear, useful, and human.", className: "project-card--sage", mark: "F" },
];

const capabilities = ["Art direction", "Brand systems", "Digital experiences", "Creative development"];

function Reveal({ children, className = "", delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = document.querySelector(`[data-reveal-delay="${delay}"]`);
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);
  return <div data-reveal-delay={delay} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` }}>{children}</div>;
}

function ProjectCard({ project }) {
  return (
    <article className={`project-card ${project.className}`}>
      <div className="project-card__top"><span>{project.number}</span><span>{project.type}</span></div>
      <div className="project-card__art" aria-hidden="true"><span className="project-card__mark">{project.mark}</span><span className="project-card__orbit" /></div>
      <div className="project-card__bottom"><h3>{project.title.split("\n").map((line) => <span key={line}>{line}</span>)}</h3><p>{project.copy}</p><a href="#contact" aria-label={`View ${project.title.replace("\n", " ")}`}>View project <ArrowUpRight size={16} /></a></div>
    </article>
  );
}

export default function HariharanPortfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const email = "hello@hariharan.studio";
  const copyEmail = async () => { await navigator.clipboard?.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" onClick={closeMenu}><span className="wordmark__dot" />hariharan<span className="wordmark__period">.</span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? <X /> : <Menu />}</button>
        <nav className={menuOpen ? "site-nav is-open" : "site-nav"} aria-label="Main navigation"><a href="#work" onClick={closeMenu}>Work</a><a href="#about" onClick={closeMenu}>About</a><a href="#contact" onClick={closeMenu}>Contact</a><a className="nav-availability" href="#contact" onClick={closeMenu}><span />Available for select projects</a></nav>
      </header>

      <main id="top">
        <section className="hero section-wrap">
          <Reveal className="hero__eyebrow"><span className="eyebrow-line" />Independent designer &amp; creative developer</Reveal>
          <Reveal className="hero__heading" delay={90}><h1>Ideas made<br /><em>visible.</em></h1></Reveal>
          <Reveal className="hero__intro" delay={160}><p>I help ambitious people and teams turn thoughtful ideas into identities, digital experiences, and work that stays with you.</p><a className="round-link" href="#work" aria-label="Scroll to selected work"><MoveUpRight /></a></Reveal>
          <div className="hero__meta"><span>Based in Bengaluru, India</span><span>Working globally</span><span>Scroll to explore <span className="scroll-arrow">↓</span></span></div>
        </section>

        <section id="work" className="work section-wrap"><div className="section-heading"><p className="eyebrow">Selected work</p><p className="section-count">(03—06)</p></div><div className="project-grid">{projects.map((project, index) => <Reveal key={project.number} delay={index * 90}><ProjectCard project={project} /></Reveal>)}</div><a className="text-link" href="#contact">View all projects <ArrowUpRight size={17} /></a></section>

        <section id="about" className="about section-wrap"><div className="section-heading"><p className="eyebrow">A little about me</p><p className="section-count">(02)</p></div><div className="about__grid"><Reveal><h2>Good design is a<br /><em>conversation.</em></h2></Reveal><Reveal delay={90} className="about__copy"><p>I’m Hariharan, a multidisciplinary designer and developer who believes the best work lives somewhere between clarity and curiosity.</p><p>I partner with founders, teams, and culture-shapers to make brands feel more like themselves — only clearer.</p><a className="text-link" href="#contact">More about me <ArrowUpRight size={17} /></a></Reveal></div><div className="capabilities"><p className="eyebrow">What I do</p><div className="capability-list">{capabilities.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><ArrowUpRight size={18} /></div>)}</div></div></section>

        <section className="statement section-wrap"><Reveal><p>“Hariharan brings a rare mix of strategic thinking, sharp taste, and the craft to carry an idea all the way through.”</p><span>— Former collaborator, 2024</span></Reveal></section>

        <section id="contact" className="contact section-wrap"><div className="contact__top"><p className="eyebrow">Have a good one?</p><span className="section-count">(Let’s talk)</span></div><Reveal><h2>Let’s make<br /><em>something clear.</em></h2></Reveal><div className="contact__bottom"><a className="email-link" href={`mailto:${email}`}>{email} <ArrowUpRight size={18} /></a><button className="copy-button" onClick={copyEmail}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : "Copy email"}</button><div className="social-links"><a href="https://www.linkedin.com" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={14} /></a><a href="https://github.com" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a></div></div></section>
      </main>
      <footer className="site-footer section-wrap"><span>© {new Date().getFullYear()} Hariharan</span><span>Designed &amp; built with intent</span><a href="#top">Back to top ↑</a></footer>
    </div>
  );
}
