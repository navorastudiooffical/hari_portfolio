import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
} from "recharts";
import {
  ArrowUpRight,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Award,
  Server,
  Database,
  Zap,
  ShieldCheck,
  GitBranch,
  Boxes,
  Activity,
  Cpu,
} from "lucide-react";

/* ---------------------------------------------------------
   Design tokens — systems / infra aesthetic
--------------------------------------------------------- */
const T = {
  ink: "#0A0B0D",
  paper: "#E8ECEF",
  mist: "#7C8591",
  panel: "#121417",
  panel2: "#15171B",
  line: "rgba(232,236,239,0.09)",
  signal: "#5EEAD4",
  amber: "#F5A623",
};

function useFonts() {
  useEffect(() => {
    const id = "hb-fonts";
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }, []);
}

function Reveal({
  children,
  delay = 0,
  y = 22,
  x = 0,
  duration = 650,
  className = "",
  style = {},
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(el);
          }
        }),
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translate(0,0)" : `translate(${x}px, ${y}px)`,
        transition: `opacity ${duration}ms cubic-bezier(.25,.1,.25,1) ${delay}ms, transform ${duration}ms cubic-bezier(.25,.1,.25,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function Counter({ to, prefix = "", suffix = "", duration = 1300 }) {
  const ref = useRef(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now) => {
              const p = Math.min(1, (now - start) / duration);
              setVal(to * (1 - Math.pow(1 - p, 3)));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.unobserve(el);
          }
        }),
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {Math.round(val).toLocaleString()}
      {suffix}
    </span>
  );
}

function ContactButton({
  children = "Get In Touch",
  href = "#contact",
  style = {},
}) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full font-medium"
      style={{
        padding: "13px 28px",
        fontSize: 13,
        color: T.ink,
        background: T.signal,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        transition: "transform 200ms ease, box-shadow 200ms ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 8px 22px -6px rgba(94,234,212,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {children}
      <ArrowUpRight size={15} strokeWidth={2.5} />
    </a>
  );
}

function GhostButton({ children, href = "#" }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 rounded-full"
      style={{
        padding: "10px 20px",
        fontSize: 11,
        fontFamily: "'JetBrains Mono', monospace",
        color: T.paper,
        border: `1.5px solid ${T.line}`,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        transition: "border-color 200ms ease, background 200ms ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.signal;
        e.currentTarget.style.background = "rgba(94,234,212,0.08)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.line;
        e.currentTarget.style.background = "transparent";
      }}
    >
      {children}
      <ArrowRight size={13} />
    </a>
  );
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}

function Parallax({ children, speed = 0.12, className = "", style = {} }) {
  const y = useScrollY();
  return (
    <div
      className={className}
      style={{
        transform: `translate3d(0, ${(y * speed).toFixed(1)}px, 0)`,
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function ScrubIn({ children, distance = 46, className = "", style = {} }) {
  const ref = useRef(null);
  const y = useScrollY();
  const [p, setP] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.96;
    const end = vh * 0.5;
    const raw = (start - rect.top) / (start - end);
    setP(Math.min(1, Math.max(0, raw)));
  }, [y]);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: p,
        transform: `translateY(${((1 - p) * distance).toFixed(1)}px) scale(${(0.96 + p * 0.04).toFixed(3)})`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ---------------- Web-based 3D scroll rig ---------------- */
function ScrollRig3D() {
  const mountRef = useRef(null);
  const scrollFracRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const updateScrollFrac = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollFracRef.current =
        max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    window.addEventListener("scroll", updateScrollFrac, { passive: true });
    updateScrollFrac();

    let width = window.innerWidth,
      height = window.innerHeight;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0b0d, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 18);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const bladeGeo = new THREE.BoxGeometry(5, 0.4, 5);
    const edgesGeo = new THREE.EdgesGeometry(bladeGeo);

    const createLayer = (mainColor, edgeColor, isMiddle) => {
      const layerGroup = new THREE.Group();

      const material = new THREE.MeshBasicMaterial({
        color: mainColor,
        transparent: true,
        opacity: 0.7,
      });
      const mesh = new THREE.Mesh(bladeGeo, material);

      const edges = new THREE.LineSegments(
        edgesGeo,
        new THREE.LineBasicMaterial({
          color: edgeColor,
          transparent: true,
          opacity: 0.8,
        }),
      );
      mesh.add(edges);

      const nodes = [];
      const nodeGeo = new THREE.BoxGeometry(0.25, 0.25, 0.25);
      for (let i = 0; i < 5; i++) {
        const nodeMat = new THREE.MeshBasicMaterial({
          color: edgeColor,
          transparent: true,
        });
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(
          (Math.random() - 0.5) * 3.5,
          0,
          (Math.random() - 0.5) * 3.5,
        );
        mesh.add(node);
        nodes.push({
          mesh: node,
          speedX: (Math.random() - 0.5) * 2.5,
          speedY: (Math.random() - 0.5) * 2.5,
          offset: Math.random() * Math.PI * 2,
        });
      }

      let ring = null;
      if (isMiddle) {
        const ringGeo = new THREE.RingGeometry(3.2, 3.25, 48);
        const ringMat = new THREE.MeshBasicMaterial({
          color: edgeColor,
          transparent: true,
          opacity: 0.8,
          side: THREE.DoubleSide,
        });
        ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2;
        layerGroup.add(ring);
      }

      layerGroup.add(mesh);
      return { group: layerGroup, nodes, ring };
    };

    const layerTop = createLayer(0x0a0b0d, 0x5eead4, false);
    const layerMid = createLayer(0x0a0b0d, 0xf5a623, true);
    const layerBot = createLayer(0x0a0b0d, 0x2e3a3c, false);

    group.add(layerTop.group, layerMid.group, layerBot.group);

    const streams = [];
    const streamGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.8, 4);
    const streamMat = new THREE.MeshBasicMaterial({
      color: 0x5eead4,
      transparent: true,
      opacity: 0,
    });

    for (let i = 0; i < 25; i++) {
      const stream = new THREE.Mesh(streamGeo, streamMat);
      stream.position.set(
        (Math.random() - 0.5) * 4.5,
        0,
        (Math.random() - 0.5) * 4.5,
      );
      group.add(stream);
      streams.push({
        mesh: stream,
        speed: Math.random() * 0.08 + 0.03,
        baseY: (Math.random() - 0.5) * 6,
      });
    }

    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 150;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++)
      posArray[i] = (Math.random() - 0.5) * 16;
    particlesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3),
    );
    const particlesMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x5eead4,
      transparent: true,
      opacity: 0.4,
    });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    const clock = new THREE.Clock();
    let raf;

    const animate = () => {
      const t = clock.getElapsedTime();
      const s = scrollFracRef.current;
      const easeScroll = Math.pow(s, 0.8);
      const explodeDistance = easeScroll * 3.8;

      group.position.y = Math.sin(t * 1.8) * 0.2;

      layerTop.group.position.y = explodeDistance;
      layerBot.group.position.y = -explodeDistance;

      layerTop.group.rotation.y = Math.sin(t * 0.4) * 0.15;
      layerBot.group.rotation.y = Math.cos(t * 0.4) * 0.15;

      [layerTop, layerMid, layerBot].forEach((layer) => {
        layer.nodes.forEach((n) => {
          n.mesh.rotation.x += n.speedX * 0.03;
          n.mesh.rotation.y += n.speedY * 0.03;
          n.mesh.position.y = Math.sin(t * 4 + n.offset) * 0.2;
          n.mesh.material.opacity = 0.4 + Math.sin(t * 6 + n.offset) * 0.6;
        });
        if (layer.ring) {
          layer.ring.rotation.z = -t * 1.5;
        }
      });

      streams.forEach((st) => {
        st.mesh.position.y += st.speed;
        if (st.mesh.position.y > 4.5) st.mesh.position.y = -4.5;
        st.mesh.material.opacity = easeScroll * 0.9;
      });

      group.rotation.y = t * 0.1 + easeScroll * Math.PI * 1.8;
      group.rotation.x = 0.3 + easeScroll * 0.25;

      camera.position.z = 18 - easeScroll * 6.5;

      particlesMesh.rotation.y = t * 0.03;
      particlesMesh.position.y = Math.sin(t * 0.3) * 0.6;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", updateScrollFrac);
      window.removeEventListener("resize", onResize);
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
      bladeGeo.dispose();
      edgesGeo.dispose();
      particlesGeo.dispose();
      streamGeo.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    />
  );
}

/* ---------------- The Vertical Section Navigator ---------------- */
// function VerticalNav() {
//   const [active, setActive] = useState(0);

//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollY = window.scrollY;
//       const vh = window.innerHeight;

//       if (scrollY < vh * 0.5)
//         setActive(0); // Hero
//       else if (scrollY < vh * 1.5)
//         setActive(1); // About
//       else if (scrollY < vh * 2.5)
//         setActive(2); // Skills
//       else if (scrollY < vh * 3.5)
//         setActive(3); // Experience
//       else setActive(4); // Contact
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   const items = ["01", "02", "03", "04", "05"];
//   const links = ["#", "#about", "#skills", "#experience", "#contact"];

//   return (
//     <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4 items-center font-mono text-[10px] tracking-widest text-neutral-500">
//       {items.map((num, i) => (
//         <React.Fragment key={num}>
//           <a
//             href={links[i]}
//             className={`cursor-pointer transition-colors ${
//               active === i ? "text-teal-400 font-bold" : "hover:text-white"
//             }`}
//           >
//             {num}
//           </a>
//           {i < items.length - 1 && (
//             <div className="w-[1px] h-8 bg-neutral-800"></div>
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// }

/* ---------------- The Vertical Section Navigator ---------------- */
/* ---------------- The Vertical Section Navigator ---------------- */
function VerticalNav() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      if (scrollY < vh * 0.5)
        setActive(0); // Hero
      else if (scrollY < vh * 1.5)
        setActive(1); // About
      else if (scrollY < vh * 2.5)
        setActive(2); // Skills
      else if (scrollY < vh * 3.5)
        setActive(3); // Experience
      else setActive(4); // Contact
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const items = ["01", "02", "03", "04", "05"];
  const links = ["#", "#about", "#skills", "#experience", "#contact"];

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-4 items-center font-mono text-[10px] tracking-widest text-neutral-500">
      {/* The vertical tracker is forced to ALWAYS show here */}
      {items.map((num, i) => (
        <React.Fragment key={num}>
          <a
            href={links[i]}
            className={`cursor-pointer transition-colors ${
              active === i ? "text-teal-400 font-bold" : "hover:text-white"
            }`}
          >
            {num}
          </a>
          {i < items.length - 1 && (
            <div className="w-[1px] h-8 bg-neutral-800"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

const eyebrow = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12,
  letterSpacing: "0.15em",
  color: T.signal,
};
const h2Style = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: T.paper,
};

/* ---------------- Hero: live "system status" panel ---------------- */
const latencyData = [
  { t: 0, v: 220 },
  { t: 1, v: 190 },
  { t: 2, v: 160 },
  { t: 3, v: 130 },
  { t: 4, v: 105 },
  { t: 5, v: 95 },
  { t: 6, v: 88 },
];

function StatusPanel() {
  return (
    <div
      className="rounded-2xl w-full"
      style={{
        background: T.panel,
        border: `1px solid ${T.line}`,
        padding: 20,
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: 999,
              background: T.signal,
              boxShadow: "0 0 0 4px rgba(94,234,212,0.15)",
              display: "inline-block",
            }}
          />
          <span style={{ color: T.mist, fontSize: 11, letterSpacing: "0.1em" }}>
            PROD · ALL SYSTEMS UP
          </span>
        </div>
        <span style={{ color: T.mist, fontSize: 11 }}>99.9%</span>
      </div>

      <div className="flex items-end justify-between mb-1">
        <div>
          <div style={{ color: T.mist, fontSize: 11, marginBottom: 4 }}>
            API RESPONSE TIME
          </div>
          <div style={{ color: T.paper, fontSize: 28, fontWeight: 600 }}>
            <Counter to={88} suffix="ms" />
          </div>
        </div>
        <div
          style={{
            color: T.signal,
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Activity size={14} /> -60%
        </div>
      </div>

      <div style={{ width: "100%", height: 64, marginTop: 8 }}>
        <ResponsiveContainer>
          <LineChart data={latencyData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={T.signal}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        className="grid grid-cols-3 gap-3 mt-4 pt-4"
        style={{ borderTop: `1px solid ${T.line}` }}
      >
        <div>
          <div style={{ color: T.mist, fontSize: 10 }}>REQ/MIN</div>
          <div style={{ color: T.paper, fontSize: 15, marginTop: 2 }}>
            <Counter to={100} suffix="+" />
          </div>
        </div>
        <div>
          <div style={{ color: T.mist, fontSize: 10 }}>PATIENT RECORDS</div>
          <div style={{ color: T.paper, fontSize: 15, marginTop: 2 }}>
            <Counter to={50} suffix="K+" />
          </div>
        </div>
        <div>
          <div style={{ color: T.mist, fontSize: 10 }}>ENGAGEMENT</div>
          <div style={{ color: T.signal, fontSize: 15, marginTop: 2 }}>
            +<Counter to={35} suffix="%" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Ambient background ---------------- */
function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.18,
          backgroundImage: `linear-gradient(${T.line} 1px, transparent 1px), linear-gradient(90deg, ${T.line} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 90%)",
        }}
      />
      <div
        className="hb-drift-1"
        style={{
          position: "absolute",
          top: "-20%",
          left: "50%",
          width: "70vw",
          maxWidth: 900,
          height: "70vw",
          maxHeight: 900,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(94,234,212,0.16) 0%, rgba(94,234,212,0.05) 40%, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
      <div
        className="hb-drift-2"
        style={{
          position: "absolute",
          top: "55%",
          right: "-15%",
          width: "50vw",
          maxWidth: 700,
          height: "50vw",
          maxHeight: 700,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(245,166,35,0.10) 0%, rgba(245,166,35,0.03) 45%, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
      <div
        className="hb-drift-3"
        style={{
          position: "absolute",
          top: "120%",
          left: "-10%",
          width: "55vw",
          maxWidth: 760,
          height: "55vw",
          maxHeight: 760,
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(94,234,212,0.10) 0%, rgba(94,234,212,0.03) 45%, transparent 70%)`,
          filter: "blur(10px)",
        }}
      />
      <style>{`
        @keyframes hbDrift1 { 0%,100% { transform: translate(-50%,0) scale(1); } 50% { transform: translate(-46%,4%) scale(1.06); } }
        @keyframes hbDrift2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-4%,-3%) scale(1.08); } }
        @keyframes hbDrift3 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(3%,-4%) scale(1.05); } }
        .hb-drift-1 { animation: hbDrift1 18s ease-in-out infinite; }
        .hb-drift-2 { animation: hbDrift2 22s ease-in-out infinite; }
        .hb-drift-3 { animation: hbDrift3 20s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .hb-drift-1, .hb-drift-2, .hb-drift-3 { animation: none; }
        }
      `}</style>
    </div>
  );
}

// function Nav() {
//   const links = ["About", "Skills", "Experience", "Contact"];
//   const [scrolled, setScrolled] = useState(false);
//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 12);
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);
//   return (
//     <Reveal y={-16} duration={600}>
//       <nav
//         className="flex items-center justify-between sticky top-0"
//         style={{
//           padding: "18px clamp(20px,4vw,56px)",
//           zIndex: 20,
//           background: scrolled ? "rgba(10,11,13,0.65)" : "transparent",
//           backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
//           WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
//           borderBottom: `1px solid ${scrolled ? T.line : "transparent"}`,
//           transition: "background 300ms ease, border-color 300ms ease",
//         }}
//       >
//         <div
//           style={{
//             fontFamily: "'Space Grotesk', sans-serif",
//             fontWeight: 700,
//             fontSize: 18,
//             color: T.paper,
//           }}
//         >
//           Hariharan<span style={{ color: T.signal }}>.</span>
//         </div>
//         <div
//           className="hidden sm:flex items-center"
//           style={{ gap: "clamp(20px,3vw,44px)" }}
//         >
//           {links.map((l) => (
//             <a
//               key={l}
//               href={`#${l.toLowerCase()}`}
//               style={{
//                 color: T.mist,
//                 fontFamily: "'JetBrains Mono', monospace",
//                 fontSize: 12,
//                 letterSpacing: "0.1em",
//                 textTransform: "uppercase",
//                 transition: "color 200ms ease",
//               }}
//               onMouseEnter={(e) => (e.currentTarget.style.color = T.paper)}
//               onMouseLeave={(e) => (e.currentTarget.style.color = T.mist)}
//             >
//               {l}
//             </a>
//           ))}
//         </div>
//         <div className="sm:hidden">
//           <ContactButton style={{ padding: "8px 16px", fontSize: 10 }}>
//             Hi
//           </ContactButton>
//         </div>
//       </nav>
//     </Reveal>
//   );
// }

function Nav() {
  const links = ["About", "Skills", "Experience", "Contact"];
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Reveal y={-16} duration={600}>
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px clamp(20px,4vw,56px)",
          position: "sticky",
          top: 0,
          zIndex: 100, // Increased z-index to ensure the 3D rig never covers it
          background: scrolled ? "rgba(10,11,13,0.65)" : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
          borderBottom: `1px solid ${scrolled ? T.line : "transparent"}`,
          transition: "background 300ms ease, border-color 300ms ease",
        }}
      >
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: T.paper,
          }}
        >
          Hariharan<span style={{ color: T.signal }}>.</span>
        </div>

        {/* Force the links to ALWAYS show, replacing the Tailwind 'hidden' class */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(20px,3vw,44px)",
          }}
        >
          {links.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                color: T.mist,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "color 200ms ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = T.paper)}
              onMouseLeave={(e) => (e.currentTarget.style.color = T.mist)}
            >
              {l}
            </a>
          ))}
        </div>
      </nav>
    </Reveal>
  );
}

function Hero() {
  return (
    <section
      className="flex flex-col justify-center"
      style={{ minHeight: "88vh", padding: "0 clamp(20px,4vw,56px)" }}
    >
      <div
        className="grid md:grid-cols-2 gap-12 items-center"
        style={{ maxWidth: 1180, margin: "0 auto", width: "100%" }}
      >
        <div>
          <Reveal y={16} delay={80}>
            <div
              className="inline-flex items-center gap-2 rounded-full mb-6"
              style={{
                border: `1px solid ${T.line}`,
                padding: "6px 14px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.1em",
                color: T.mist,
              }}
            >
              <MapPin size={12} color={T.signal} /> CHENNAI, INDIA · OPEN TO
              ROLES
            </div>
          </Reveal>
          <Reveal y={36} delay={150}>
            <h1
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
                fontSize: "clamp(2.4rem, 5.6vw, 4.2rem)",
                color: T.paper,
              }}
            >
              Hariharan B
            </h1>
          </Reveal>
          <Reveal y={22} delay={230}>
            <p
              style={{
                marginTop: 14,
                color: T.signal,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "clamp(0.9rem,1.4vw,1.05rem)",
                letterSpacing: "0.02em",
              }}
            >
              Backend Engineer — Java · Spring Boot · Microservices
            </p>
          </Reveal>
          <Reveal y={20} delay={320}>
            <p
              style={{
                marginTop: 18,
                color: T.mist,
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                lineHeight: 1.65,
                maxWidth: 460,
              }}
            >
              I build event-driven, high-concurrency systems in production —
              from Kafka pipelines processing media at scale to healthcare
              platforms serving 50K+ patient records.
            </p>
          </Reveal>
          <Reveal y={20} delay={420}>
            <div className="flex items-center gap-4 mt-9 flex-wrap">
              <ContactButton />
              <GhostButton href="#experience">View experience</GhostButton>
            </div>
          </Reveal>
        </div>
        <Reveal y={30} delay={300}>
          <Parallax speed={-0.06}>
            <StatusPanel />
          </Parallax>
        </Reveal>
      </div>
    </section>
  );
}

function About() {
  const stats = [
    { n: 2, label: "years in production backend", suffix: "+" },
    { n: 60, label: "API latency cut", suffix: "%" },
    { n: 30, label: "faster sprint delivery", suffix: "%" },
  ];
  return (
    <section
      id="about"
      style={{ padding: "clamp(80px,10vw,140px) clamp(20px,4vw,56px)" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <span style={eyebrow}>01 — ABOUT</span>
        </Reveal>
        <ScrubIn>
          <h2
            style={{
              ...h2Style,
              fontSize: "clamp(1.9rem, 4vw, 2.8rem)",
              marginTop: 12,
              marginBottom: 28,
              maxWidth: 720,
              lineHeight: 1.25,
            }}
          >
            I design backend systems that stay fast under real production load.
          </h2>
        </ScrubIn>
        <Reveal delay={160}>
          <p
            style={{
              color: T.mist,
              fontFamily: "Inter, sans-serif",
              fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
              lineHeight: 1.75,
              maxWidth: 640,
            }}
          >
            Currently a Backend Developer at Macapp Studio, building for clients
            including Reliance Jio. My work centers on event-driven architecture
            — decoupling heavy workloads with Kafka, caching hot paths with
            Redis, and hardening endpoints with JWT and Spring Security — so
            systems keep performing as traffic and data grow.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-14">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={220 + i * 90}>
              <div style={{ borderTop: `1px solid ${T.line}`, paddingTop: 16 }}>
                <div
                  style={{
                    color: T.paper,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "clamp(1.6rem,3vw,2.2rem)",
                  }}
                >
                  <Counter to={s.n} suffix={s.suffix} />
                </div>
                <div
                  style={{
                    color: T.mist,
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                    letterSpacing: "0.05em",
                    marginTop: 6,
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const SKILLS = [
  {
    n: "01",
    icon: Server,
    name: "Backend Development",
    desc: "Spring Boot, Spring Security, Spring Data JPA, Hibernate, Laravel — REST APIs built for correctness first, then throughput.",
  },
  {
    n: "02",
    icon: Zap,
    name: "Event-Driven Systems",
    desc: "Apache Kafka pipelines that decouple ingestion from processing, with Redis caching to keep hot paths fast.",
  },
  {
    n: "03",
    icon: Database,
    name: "Data & Persistence",
    desc: "PostgreSQL, MySQL, Firebase — schema design and query tuning that holds up at 50K+ record scale.",
  },
  {
    n: "04",
    icon: ShieldCheck,
    name: "Security & Access Control",
    desc: "JWT auth, Spring Security, and RBAC schemas built to keep sensitive data — like patient records — locked down.",
  },
  {
    n: "05",
    icon: Boxes,
    name: "DevOps & Delivery",
    desc: "Docker containerization, CI/CD standardization, Postman/Swagger-documented APIs, Agile delivery.",
  },
];

function Skills() {
  return (
    <section
      id="skills"
      style={{ padding: "clamp(60px,8vw,100px) clamp(20px,4vw,56px)" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <span style={eyebrow}>02 — SKILLS</span>
        </Reveal>
        <div className="mt-10">
          {SKILLS.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div
                className="flex items-start gap-6 sm:gap-10"
                style={{ borderTop: `1px solid ${T.line}`, padding: "26px 0" }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: T.mist,
                    fontSize: "clamp(1.1rem,2.2vw,1.5rem)",
                    minWidth: 40,
                  }}
                >
                  {s.n}
                </div>
                <s.icon
                  size={20}
                  color={T.signal}
                  style={{ marginTop: 6, flexShrink: 0 }}
                />
                <div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 600,
                      color: T.paper,
                      fontSize: "clamp(1.05rem,1.9vw,1.3rem)",
                      marginBottom: 6,
                    }}
                  >
                    {s.name}
                  </h3>
                  <p
                    style={{
                      color: T.mist,
                      fontFamily: "Inter, sans-serif",
                      fontSize: "clamp(0.88rem,1.2vw,1rem)",
                      lineHeight: 1.6,
                      maxWidth: 560,
                    }}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function KafkaMock() {
  const data = [
    { m: "M", v: 40 },
    { m: "T", v: 55 },
    { m: "W", v: 48 },
    { m: "T", v: 70 },
    { m: "F", v: 62 },
    { m: "S", v: 85 },
    { m: "S", v: 78 },
  ];
  return (
    <div
      style={{
        background: T.panel2,
        border: `1px solid ${T.line}`,
        borderRadius: 16,
        padding: 16,
        height: "100%",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: T.mist,
          marginBottom: 10,
          letterSpacing: "0.1em",
        }}
      >
        MEDIA UPLOADS / DAY
      </div>
      <div style={{ width: "100%", height: 100 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <Bar dataKey="v" radius={[3, 3, 0, 0]} fill={T.signal} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-2 mt-3">
        <Cpu size={12} color={T.signal} />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            color: T.mist,
          }}
        >
          Kafka consumers → face detection & tagging
        </span>
      </div>
    </div>
  );
}

function HealthMock() {
  const rows = [
    "Appointment booked",
    "RBAC check passed",
    "Doctor notified",
    "Certification issued",
  ];
  return (
    <div
      style={{
        background: T.panel2,
        border: `1px solid ${T.line}`,
        borderRadius: 16,
        padding: 18,
        height: "100%",
      }}
    >
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: T.mist,
          marginBottom: 14,
          letterSpacing: "0.1em",
        }}
      >
        REALTIME · MEDI-YOGA
      </div>
      {rows.map((s, i) => (
        <div
          key={s}
          className="flex items-center gap-3"
          style={{ marginBottom: i === rows.length - 1 ? 0 : 13 }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: i < 3 ? T.signal : "transparent",
              border: `1.5px solid ${i < 3 ? T.signal : T.line}`,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "Inter, sans-serif",
              fontSize: 12.5,
              color: i < 3 ? T.paper : T.mist,
            }}
          >
            {s}
          </span>
        </div>
      ))}
    </div>
  );
}

const EXPERIENCE = [
  {
    tag: "Client: Reliance Jio",
    name: "Cloud-Based Media Management Platform",
    period: "Oct 2023 — Present",
    desc: "High-concurrency backend for media uploads on Spring Boot, with an async Kafka pipeline decoupling ingestion from AI-driven face detection, clustering, and tagging.",
    reason:
      "Redis caching and tuned PostgreSQL/Hibernate queries cut retrieval overhead and kept endpoints fast under load.",
    Mock: KafkaMock,
    icon: Server,
  },
  {
    tag: "Healthcare",
    name: "Medi-yoga — Patient Platform",
    period: "Macapp Studio",
    desc: "Scalable relational schema supporting 50K+ patient records and 500+ daily real-time appointment bookings, with fault-tolerant REST endpoints handling 100+ concurrent requests/minute.",
    reason:
      "RBAC-protected patient-doctor data streams plus a background notification system lifted engagement 35% and cut appointment drop-off.",
    Mock: HealthMock,
    icon: ShieldCheck,
  },
];

function ExperienceCard({ p, i }) {
  return (
    <Reveal delay={i * 110}>
      <div
        className="grid sm:grid-cols-2 gap-6"
        style={{
          border: `1px solid ${T.line}`,
          borderRadius: 24,
          padding: "clamp(20px,3vw,32px)",
          background: T.panel,
        }}
      >
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: T.mist,
                  border: `1px solid ${T.line}`,
                  borderRadius: 999,
                  padding: "4px 10px",
                }}
              >
                {p.tag}
              </span>
              <p.icon size={16} color={T.signal} />
            </div>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.3rem,2.4vw,1.7rem)",
                color: T.paper,
                marginBottom: 6,
                letterSpacing: "-0.01em",
              }}
            >
              {p.name}
            </h3>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                color: T.signal,
                marginBottom: 14,
              }}
            >
              {p.period}
            </div>
            <p
              style={{
                color: T.mist,
                fontFamily: "Inter, sans-serif",
                fontSize: 14.5,
                lineHeight: 1.65,
                marginBottom: 10,
              }}
            >
              {p.desc}
            </p>
            <p
              style={{
                color: T.paper,
                opacity: 0.55,
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontStyle: "italic",
                lineHeight: 1.6,
              }}
            >
              {p.reason}
            </p>
          </div>
        </div>
        <div style={{ minHeight: 220 }}>
          <p.Mock />
        </div>
      </div>
    </Reveal>
  );
}

function Experience() {
  return (
    <section
      id="experience"
      style={{ padding: "clamp(60px,8vw,100px) clamp(20px,4vw,56px)" }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <Reveal>
          <span style={eyebrow}>03 — EXPERIENCE</span>
        </Reveal>
        <ScrubIn>
          <h2
            style={{
              ...h2Style,
              fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
              margin: "12px 0 36px",
            }}
          >
            What I've shipped in production
          </h2>
        </ScrubIn>
        <div className="flex flex-col gap-6">
          {EXPERIENCE.map((p, i) => (
            <ExperienceCard key={p.name} p={p} i={i} />
          ))}
        </div>

        <Reveal delay={200}>
          <div
            className="flex items-start gap-4 mt-10"
            style={{
              border: `1px solid ${T.line}`,
              borderRadius: 20,
              padding: "22px 24px",
              background: T.panel,
            }}
          >
            <Award
              size={20}
              color={T.amber}
              style={{ flexShrink: 0, marginTop: 2 }}
            />
            <div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 600,
                  color: T.paper,
                  fontSize: 15,
                  marginBottom: 4,
                }}
              >
                Certificate of Appreciation & Performance Reward — Sep 2024,
                Macapp Studio
              </div>
              <p
                style={{
                  color: T.mist,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 13.5,
                  lineHeight: 1.6,
                }}
              >
                Recognized for leading a structural backend API overhaul that
                cut production response times by 60% and standardized CI/CD,
                raising sprint delivery efficiency by 30%.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      style={{ padding: "clamp(80px,10vw,140px) clamp(20px,4vw,56px) 60px" }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <span style={eyebrow}>04 — CONTACT</span>
        </Reveal>
        <ScrubIn>
          <h2
            style={{
              ...h2Style,
              fontSize: "clamp(2rem,5vw,3.2rem)",
              margin: "14px 0 20px",
              lineHeight: 1.1,
            }}
          >
            Building something that needs a solid backend?
          </h2>
        </ScrubIn>
        <Reveal delay={160}>
          <p
            style={{
              color: T.mist,
              fontFamily: "Inter, sans-serif",
              fontSize: 16,
              lineHeight: 1.7,
              marginBottom: 36,
            }}
          >
            Open to backend engineering roles and freelance systems work — Java,
            Spring Boot, and everything around them.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ContactButton href="mailto:hariharand5101@gmail.com">
              <Mail size={14} style={{ marginRight: 2 }} /> Email Me
            </ContactButton>
            <GhostButton href="tel:+916383833809">
              <span className="flex items-center gap-2">
                <Phone size={14} /> +91 63838 33809
              </span>
            </GhostButton>
          </div>
        </Reveal>
      </div>

      <div
        className="flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{
          maxWidth: 1000,
          margin: "80px auto 0",
          paddingTop: 24,
          borderTop: `1px solid ${T.line}`,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: T.mist,
          }}
        >
          © {new Date().getFullYear()} Hariharan B
        </span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: T.mist,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <MapPin size={11} /> Chennai, India
        </span>
      </div>
    </section>
  );
}

export default function HariharanPortfolio() {
  useFonts();
  return (
    <div
      style={{
        background: T.ink,
        minHeight: "100vh",
        overflowX: "clip",
        position: "relative",
      }}
    >
      <ScrollRig3D />
      <AmbientBackground />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <VerticalNav />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Contact />
      </div>
    </div>
  );
}
