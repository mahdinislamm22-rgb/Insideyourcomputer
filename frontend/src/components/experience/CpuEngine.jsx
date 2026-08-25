import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Play } from "lucide-react";
import { Tag, MaskedLines, LearnMore, Disclaimer, useIsMobile } from "./Shared";
import { audio } from "../../lib/audio";

const CORES = 8;

const CpuEngine = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20%" });
  const [running, setRunning] = useState(false);
  const [turbo, setTurbo] = useState(false);
  const [ops, setOps] = useState(0);
  const [aluFlash, setAluFlash] = useState(0);
  const mobile = useIsMobile();

  // Simulated operations counter — visualization only
  useEffect(() => {
    if (!running || !inView) return;
    const rate = turbo ? 9000 : 900;
    const id = setInterval(() => setOps((o) => o + rate + Math.floor(Math.random() * rate * 0.4)), 100);
    return () => clearInterval(id);
  }, [running, turbo, inView]);

  const run = () => {
    setRunning(true);
    setAluFlash((f) => f + 1);
    audio.click(1600);
  };

  const speed = turbo ? 0.6 : 1.8;

  return (
    <section id="cpu" data-testid="cpu-section" ref={ref} className="relative py-32 sm:py-40 grid-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <Tag>03 · The brain</Tag>
          <MaskedLines lines={["CPU: BILLIONS OF", "DECISIONS / SECOND."]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Die visualization */}
          <div className="relative glass chamfer border border-signal/25 aspect-square max-w-md mx-auto w-full p-6 box-glow">
            <div className="absolute top-3 left-4 font-mono text-[9px] tracking-[0.3em] text-signal/70 uppercase">SILICON DIE · 5NM</div>
            {/* Cache ring */}
            <div className="absolute inset-6 border border-dashed border-amber2/40 chamfer" />
            <div className="absolute top-6 right-8 font-mono text-[9px] tracking-[0.2em] text-amber2/80">L3 CACHE</div>

            {/* Cores grid */}
            <div className="absolute inset-12 grid grid-cols-4 grid-rows-2 gap-2">
              {Array.from({ length: CORES }).map((_, i) => (
                <motion.div
                  key={i}
                  className="chamfer border border-signal/40 bg-signal/5 flex items-center justify-center font-mono text-[9px] text-signal"
                  animate={running && inView ? {
                    backgroundColor: ["rgba(0,240,255,0.05)", "rgba(0,240,255,0.35)", "rgba(0,240,255,0.05)"],
                    boxShadow: ["0 0 0px rgba(0,240,255,0)", "0 0 18px rgba(0,240,255,0.5)", "0 0 0px rgba(0,240,255,0)"],
                  } : {}}
                  transition={{ duration: speed, repeat: Infinity, delay: i * speed * 0.13 }}
                >
                  C{i}
                </motion.div>
              ))}
            </div>

            {/* ALU block */}
            <motion.div
              key={aluFlash}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 w-28 h-10 chamfer border border-phosphor/60 bg-phosphor/10 flex items-center justify-center font-mono text-[10px] tracking-[0.3em] text-phosphor"
              animate={running ? { boxShadow: ["0 0 0 rgba(0,255,102,0)", "0 0 24px rgba(0,255,102,0.6)", "0 0 0 rgba(0,255,102,0)"] } : {}}
              transition={{ duration: speed, repeat: Infinity }}
            >
              ALU
            </motion.div>

            {/* travelling packets between cores and ALU */}
            {!mobile && running && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 400">
                <circle r="2.6" fill="#00FF66" className="packet-dot" style={{ color: "#00FF66" }}>
                  <animateMotion dur={`${speed}s`} repeatCount="indefinite" path="M 100 140 L 200 320" />
                </circle>
                <circle r="2.6" fill="#00F0FF" className="packet-dot" style={{ color: "#00F0FF" }}>
                  <animateMotion dur={`${speed * 1.3}s`} repeatCount="indefinite" path="M 300 140 L 200 320" />
                </circle>
                <circle r="2.6" fill="#FF9D00" className="packet-dot" style={{ color: "#FF9D00" }}>
                  <animateMotion dur={`${speed * 1.7}s`} repeatCount="indefinite" path="M 200 60 L 200 320" />
                </circle>
              </svg>
            )}
          </div>

          {/* Controls + readout */}
          <div>
            <h3 className="font-head font-semibold text-xl text-white">Fetch → Decode → Execute</h3>
            <p className="mt-4 text-slate2 text-sm sm:text-base leading-relaxed font-body">
              Each core repeats one loop forever: fetch an instruction from memory, decode what it means, execute it in the ALU. Your single click becomes thousands of these cycles — the more you ask, the hotter it runs.
            </p>

            <div className="mt-8 glass chamfer border border-white/10 p-6">
              <div className="font-mono text-[10px] tracking-[0.3em] text-signal uppercase">Processing · simulated</div>
              <div data-testid="cpu-ops-counter" className="mt-2 font-mono text-3xl sm:text-4xl text-white tabular-nums">
                {ops.toLocaleString()} <span className="text-sm text-muted2">ops</span>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  data-testid="cpu-run-btn"
                  onClick={run}
                  className="chamfer border border-signal/50 text-signal px-6 py-3 font-mono text-[11px] tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-shadow flex items-center gap-2 cursor-pointer"
                >
                  <Play size={13} /> Run instruction
                </button>
                <label className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em] uppercase text-slate2 cursor-pointer">
                  <input
                    data-testid="cpu-turbo-toggle"
                    type="checkbox"
                    checked={turbo}
                    onChange={(e) => { setTurbo(e.target.checked); audio.click(e.target.checked ? 1800 : 700); }}
                    className="accent-[#FF9D00] w-4 h-4"
                  />
                  Turbo mode
                </label>
              </div>
            </div>

            <LearnMore
              testId="learn-more-cpu-engine"
              facts={[
                "A 5 GHz core ticks every 0.2 nanoseconds — light travels only ~6 cm in one tick.",
                "Cores have private L1/L2 caches; a miss to RAM costs ~100 ns, an eternity at this scale.",
                "Threads let one core juggle two instruction streams, filling idle pipeline gaps.",
              ]}
            />
          </div>
        </div>

        <Disclaimer>Conceptual simulation — the counter is illustrative, not a real-time measurement</Disclaimer>
      </div>
    </section>
  );
};

export default CpuEngine;
