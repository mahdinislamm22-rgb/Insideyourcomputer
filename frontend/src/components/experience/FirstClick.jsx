import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mouse } from "lucide-react";
import { Tag, MaskedLines, Disclaimer, EASE } from "./Shared";
import { audio } from "../../lib/audio";

const STAGES = ["CLICK", "INPUT SIGNAL", "OPERATING SYSTEM", "CPU", "MEMORY", "GPU", "DISPLAY"];

const FirstClick = () => {
  const ref = useRef(null);
  const [fired, setFired] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const fire = () => {
    if (fired) return;
    setFired(true);
    audio.click(900);
  };

  return (
    <section id="first-click" data-testid="first-click-section" ref={ref} className="relative py-32 sm:py-40 overflow-hidden grid-bg">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div style={{ y }} className="text-center mb-16">
          <div className="flex justify-center mb-6"><Tag>01 · Input</Tag></div>
          <MaskedLines
            lines={["LET'S FOLLOW", "ONE CLICK."]}
            className="font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight"
          />
          <p className="mt-6 text-slate2 text-sm sm:text-base max-w-md mx-auto font-body">
            Press the switch. A microsecond-long voltage drop is about to become a cascade of billions of operations.
          </p>
        </motion.div>

        <div className="flex flex-col items-center">
          {/* The mouse */}
          <motion.button
            data-testid="mouse-click-target"
            onClick={fire}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92, y: 3 }}
            className={`relative w-28 h-40 rounded-[3rem] border-2 cursor-pointer transition-all duration-500 ${
              fired ? "border-signal shadow-[0_0_50px_rgba(0,240,255,0.4)]" : "border-white/20 hover:border-signal/60"
            } glass`}
          >
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-1 h-8 rounded-full transition-colors duration-300 ${fired ? "bg-signal" : "bg-white/30"}`} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-16 bg-white/10" />
            {fired && (
              <motion.div
                className="absolute inset-0 rounded-[3rem] border-2 border-signal"
                initial={{ opacity: 0.9, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                transition={{ duration: 0.9 }}
              />
            )}
            <Mouse className="absolute bottom-4 left-1/2 -translate-x-1/2 text-slate2" size={18} />
          </motion.button>
          <span className="mt-4 font-mono text-[10px] tracking-[0.3em] uppercase text-muted2">
            {fired ? "SWITCH ACTUATED · IRQ FIRED" : "Click the mouse"}
          </span>

          {/* Chain reaction */}
          <div className="mt-14 flex flex-col items-center w-full max-w-xs">
            {STAGES.map((s, i) => (
              <div key={s} className="flex flex-col items-center w-full">
                <motion.div
                  data-testid={`stage-${s.toLowerCase().replace(/\s/g, "-")}`}
                  initial={false}
                  animate={fired ? { opacity: 1, x: 0, borderColor: "rgba(0,240,255,0.5)" } : { opacity: 0.25 }}
                  transition={{ delay: 0.5 + i * 0.45, duration: 0.5, ease: EASE }}
                  className="glass chamfer border border-white/10 px-6 py-3 font-mono text-[11px] sm:text-xs tracking-[0.3em] text-slate-100 w-full text-center"
                >
                  {s}
                </motion.div>
                {i < STAGES.length - 1 && (
                  <div className="relative h-10 w-px bg-white/10 overflow-visible">
                    {fired && (
                      <motion.span
                        className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-signal packet-dot"
                        style={{ color: "#00F0FF" }}
                        initial={{ top: -8, opacity: 0 }}
                        animate={{ top: 36, opacity: [0, 1, 1, 0] }}
                        transition={{ delay: 0.5 + i * 0.45 + 0.25, duration: 0.45, ease: "easeIn" }}
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={fired ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 + STAGES.length * 0.45 + 0.4, duration: 1 }}
            className="mt-12 font-display text-lg sm:text-2xl text-signal text-glow tracking-wide"
          >
            Every. Single. Time.
          </motion.p>
        </div>

        <div className="flex justify-center"><Disclaimer>Simplified sequence — the real pipeline interleaves these stages</Disclaimer></div>
      </div>
    </section>
  );
};

export default FirstClick;
