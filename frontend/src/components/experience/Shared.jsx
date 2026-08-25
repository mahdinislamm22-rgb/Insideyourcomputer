import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const EASE = [0.16, 1, 0.3, 1];

export const useIsMobile = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const fn = () => setMobile(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);
  return mobile;
};

export const Tag = ({ children, color = "text-signal" }) => (
  <div className={`font-mono text-[11px] uppercase tracking-[0.35em] ${color} flex items-center gap-3`}>
    <span className="inline-block h-px w-8 bg-current opacity-60" />
    {children}
  </div>
);

export const Reveal = ({ children, delay = 0, className = "", y = 40 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.9, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

// Masked line-by-line kinetic reveal
export const MaskedLines = ({ lines, className = "", lineClassName = "", delay = 0, as: As = "h2" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <As ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "115%" }}
            animate={inView ? { y: 0 } : {}}
            transition={{ duration: 1, delay: delay + i * 0.12, ease: EASE }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </As>
  );
};

export const GlowButton = ({ children, onClick, testId, color = "signal", className = "" }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    setPos({ x: (e.clientX - r.left - r.width / 2) * 0.18, y: (e.clientY - r.top - r.height / 2) * 0.3 });
  };
  const palette = color === "amber"
    ? "border-amber2/50 text-amber2 hover:shadow-[0_0_40px_rgba(255,157,0,0.3)]"
    : "border-signal/50 text-signal hover:shadow-[0_0_40px_rgba(0,240,255,0.3)]";
  return (
    <motion.button
      ref={ref}
      data-testid={testId}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`chamfer glass px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] border ${palette} transition-shadow duration-500 cursor-pointer ${className}`}
    >
      {children}
    </motion.button>
  );
};

export const LearnMore = ({ facts, testId }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        data-testid={testId}
        onClick={() => setOpen(!open)}
        className="font-mono text-[11px] uppercase tracking-[0.25em] text-slate2 hover:text-signal transition-colors flex items-center gap-2 cursor-pointer"
      >
        <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={14} /></motion.span>
        {open ? "Close specs" : "Deeper specs"}
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="overflow-hidden mt-3 space-y-2 border-l border-signal/30 pl-4"
          >
            {facts.map((f, i) => (
              <li key={i} className="text-sm text-slate2 leading-relaxed font-body">{f}</li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

// SVG path with glowing packet dots travelling along it (SMIL animateMotion)
export const PacketFlow = ({ d, color = "#00F0FF", count = 2, dur = 3, width = 1.5, funny = false }) => {
  const jokes = ["hi", "0x1F4A9", "beep", "418", "ping?"];
  return (
    <g>
      <path d={d} fill="none" stroke={color} strokeOpacity="0.18" strokeWidth={width} />
      <path d={d} fill="none" stroke={color} strokeOpacity="0.5" strokeWidth={width} strokeDasharray="3 21" className="animate-flow-dash" />
      {Array.from({ length: count }).map((_, i) => (
        <circle key={i} r="3.2" fill={color} className="packet-dot" style={{ color }}>
          <animateMotion dur={`${dur}s`} begin={`${(dur / count) * i}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}
      {funny && (
        <text fontSize="9" fill={color} opacity="0.8" fontFamily="JetBrains Mono, monospace">
          <animateMotion dur={`${dur * 2.7}s`} begin="1.2s" repeatCount="indefinite" path={d} />
          {jokes[Math.floor(Math.random() * jokes.length)]}
        </text>
      )}
    </g>
  );
};

export const Disclaimer = ({ children }) => (
  <p className="font-mono text-[10px] tracking-[0.15em] text-muted2 uppercase mt-6 flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-amber2/70 inline-block" />
    {children}
  </p>
);
