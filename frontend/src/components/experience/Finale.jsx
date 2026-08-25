import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RotateCcw, ArrowUpRight } from "lucide-react";
import { MaskedLines, EASE } from "./Shared";
import { audio } from "../../lib/audio";

const NODES = ["CPU", "RAM", "GPU", "SSD", "NETWORK", "DISPLAY"];

const MARQUEE = ["SIGNAL", "SILICON", "LIGHT", "ONE CLICK", "BILLIONS OF OPERATIONS", "FETCH · DECODE · EXECUTE"];

const Finale = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-25%" });

  const restart = () => {
    audio.whoosh();
    window.__lenis?.scrollTo(0, { duration: 3 });
  };

  return (
    <section id="finale" data-testid="finale-section" ref={ref} className="relative pt-32 sm:pt-40 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* System diagram lighting up */}
        <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 mb-20">
          {NODES.map((n, i) => (
            <div key={n} className="flex items-center gap-2 sm:gap-3">
              <motion.div
                data-testid={`finale-node-${n.toLowerCase()}`}
                initial={{ opacity: 0.15 }}
                animate={inView ? { opacity: 1, boxShadow: ["0 0 0px rgba(0,240,255,0)", "0 0 30px rgba(0,240,255,0.5)", "0 0 14px rgba(0,240,255,0.25)"] } : {}}
                transition={{ delay: i * 0.35, duration: 1.2 }}
                className="glass chamfer border border-signal/40 px-3 sm:px-5 py-2.5 font-mono text-[9px] sm:text-[11px] tracking-[0.25em] text-signal"
              >
                {n}
              </motion.div>
              {i < NODES.length - 1 && (
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : {}}
                  transition={{ delay: i * 0.35 + 0.2, duration: 0.4 }}
                  className="w-4 sm:w-8 h-px bg-signal/60 origin-left"
                />
              )}
            </div>
          ))}
        </div>

        <MaskedLines
          lines={["ONE CLICK."]}
          className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl text-white tracking-tight"
          lineClassName="text-glow"
        />
        <MaskedLines
          lines={["BILLIONS OF OPERATIONS."]}
          delay={0.6}
          className="mt-4 font-display font-bold text-2xl sm:text-4xl lg:text-5xl text-signal tracking-tight"
        />
        <MaskedLines
          lines={["NOW YOU KNOW WHAT'S INSIDE."]}
          delay={1.2}
          className="mt-8 font-mono text-xs sm:text-sm tracking-[0.4em] text-slate2"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 0.9, ease: EASE }}
          className="mt-14"
        >
          <button
            data-testid="enter-again-btn"
            onClick={restart}
            className="group chamfer glass border border-signal/40 px-10 py-5 font-mono text-xs uppercase tracking-[0.35em] text-signal hover:shadow-[0_0_60px_rgba(0,240,255,0.35)] transition-shadow duration-500 cursor-pointer inline-flex items-center gap-3"
          >
            <RotateCcw size={15} className="transition-transform duration-700 group-hover:-rotate-180" />
            Enter again
          </button>
        </motion.div>
      </div>

      {/* Slow editorial marquee */}
      <div className="mt-28 border-y border-white/5 py-5 overflow-hidden mask-fade-x">
        <div className="flex whitespace-nowrap animate-marquee w-max">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center">
              {MARQUEE.map((word, i) => (
                <span key={`${dup}-${i}`} className="font-display text-lg sm:text-2xl text-white/10 tracking-wide mx-8 flex items-center gap-8">
                  {word} <span className="w-1.5 h-1.5 rounded-full bg-signal/30 inline-block" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-16 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="font-mono text-[10px] tracking-[0.3em] text-muted2 uppercase text-center sm:text-left">
            Inside Your Computer — a conceptual visualization<br />
            <span className="text-muted2/60">Simplified models. Real wonder.</span>
          </div>

          {/* Creative portfolio exit node */}
          <a
            data-testid="portfolio-link"
            href="https://portofolio-m.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative glass chamfer border border-white/10 hover:border-amber2/60 px-8 py-5 transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,157,0,0.25)]"
          >
            <div className="font-mono text-[9px] tracking-[0.35em] text-muted2 uppercase group-hover:text-amber2/70 transition-colors">
              Exit node · crafted by
            </div>
            <div className="mt-1.5 font-mono text-sm text-white flex items-center gap-2">
              <span className="text-amber2">&gt;</span>
              portofolio-m.vercel.app
              <ArrowUpRight size={14} className="text-amber2 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" />
              <span className="w-2 h-4 bg-amber2/80 animate-blink inline-block" />
            </div>
            <span className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-amber2/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </a>

          <div className="font-mono text-[10px] tracking-[0.3em] text-muted2 uppercase text-center sm:text-right">
            Try: ↑↑↓↓←→←→BA<br />
            <span className="text-muted2/60">or Ctrl + `</span>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Finale;
