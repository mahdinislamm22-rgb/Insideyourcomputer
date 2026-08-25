import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cpu, MemoryStick, MonitorPlay, HardDrive, Plug, Fan, Wifi } from "lucide-react";
import { Tag, MaskedLines, LearnMore, PacketFlow, EASE } from "./Shared";
import { audio } from "../../lib/audio";

const COMPONENTS = [
  { id: "cpu", name: "CPU", role: "THE BRAIN", icon: Cpu, color: "#00F0FF", pos: "left-[8%] top-[12%]",
    blurb: "Instructions arrive. The CPU fetches, decodes and executes them — billions of times per second.",
    facts: ["A modern desktop CPU runs at ~5 GHz: its clock ticks 5 billion times per second.", "It executes instructions in a pipeline — like an assembly line, several instructions are in flight at once.", "Your click becomes an interrupt: the CPU pauses its current work to handle it within microseconds."] },
  { id: "ram", name: "RAM", role: "SHORT-TERM MEMORY", icon: MemoryStick, color: "#00FF66", pos: "right-[8%] top-[12%]",
    blurb: "Everything the CPU is actively working on lives here. Fast, temporary, forgotten on power-off.",
    facts: ["DDR5 memory moves data at over 6,400 mega-transfers per second.", "RAM is volatile: capacitors leak charge and must be refreshed thousands of times per second.", "Reaching RAM takes the CPU ~100 nanoseconds — 100x slower than its own cache, 100x faster than an SSD."] },
  { id: "gpu", name: "GPU", role: "THE PAINTER", icon: MonitorPlay, color: "#8B5CF6", pos: "left-[8%] bottom-[14%]",
    blurb: "Thousands of small cores doing the same math on millions of pixels — at the same time.",
    facts: ["A modern GPU has over 10,000 shader cores, built for massive parallelism.", "At 1440p, every frame pushes ~3.7 million pixels — the GPU may redraw them 60–240 times per second.", "GPUs also power AI: matrix math for neural nets is the same trick as shading pixels."] },
  { id: "ssd", name: "SSD", role: "LONG-TERM STORAGE", icon: HardDrive, color: "#FF9D00", pos: "right-[8%] bottom-[14%]",
    blurb: "Where your files live when the power is off. Electrons trapped in floating gates.",
    facts: ["NVMe SSDs read at over 7,000 MB/s — 100x faster than a spinning hard drive.", "Flash cells store charge by quantum tunneling electrons into a floating gate.", "Flash wears out: each cell survives a limited number of writes, so drives spread writes evenly (wear leveling)."] },
  { id: "psu", name: "PSU", role: "THE HEART", icon: Plug, color: "#FF2A55", pos: "left-[42%] top-[4%]",
    blurb: "Converts wall power into precise voltages — 12V, 5V, 3.3V — that silicon can survive.",
    facts: ["Your CPU alone can draw over 200 watts under load — as much as two bright incandescent bulbs.", "Voltage regulators next to the CPU adjust power thousands of times per second as load changes."] },
  { id: "cooling", name: "COOLING", role: "THE LUNGS", icon: Fan, color: "#94A3B8", pos: "left-[42%] bottom-[4%]",
    blurb: "Every operation leaks heat. Heat pipes and fans carry it out before silicon throttles.",
    facts: ["Above ~95–100°C, CPUs deliberately slow down to protect themselves — thermal throttling.", "A CPU die concentrates more heat per cm² than a stovetop."] },
  { id: "network", name: "NETWORK", role: "THE MOUTH & EARS", icon: Wifi, color: "#00F0FF", pos: "left-[42%] top-[36%]",
    blurb: "Packets leave here as radio waves or light pulses — and return carrying the internet.",
    facts: ["Wi-Fi 6 moves gigabits per second over the air; fiber optics move terabits through glass thinner than hair.", "Your data is chopped into packets of ~1,500 bytes, each addressed and routed independently."] },
];

const TRACE_PATHS = [
  "M 140 90 C 260 90 260 200 430 200",   // cpu -> network
  "M 430 200 C 600 200 600 90 720 90",   // network -> ram
  "M 140 470 C 280 470 300 250 430 220", // gpu -> network
  "M 720 470 C 580 470 560 250 450 220", // ssd -> network
  "M 430 60 L 430 190",                  // psu -> network
];

const HardwareMap = () => {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [overclock, setOverclock] = useState(false);
  const clicks = useRef([]);

  const onCpuClick = (c) => {
    audio.click(1200);
    if (c.id === "cpu") {
      const now = Date.now();
      clicks.current = [...clicks.current.filter((t) => now - t < 2500), now];
      if (clicks.current.length >= 10) {
        setOverclock(true);
        clicks.current = [];
        audio.whoosh();
        return;
      }
    }
    setSelected(c);
  };

  return (
    <section id="machine" data-testid="hardware-map-section" className="relative py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <Tag>02 · Inside the machine</Tag>
          <MaskedLines lines={["THE SILICON", "CITY."]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
          <p className="mt-6 text-slate2 text-sm sm:text-base max-w-lg font-body">
            Hover to inspect. Click to zoom in. Every part is awake — watch the data move between them.
          </p>
        </div>

        {/* Board */}
        <div className="relative glass chamfer border border-white/10 aspect-[4/3] sm:aspect-[16/9] overflow-hidden grid-bg">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.05),transparent_70%)]" />
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 860 500" preserveAspectRatio="none">
            {TRACE_PATHS.map((d, i) => (
              <PacketFlow key={i} d={d} color={i % 2 ? "#00FF66" : "#00F0FF"} count={2} dur={3 + i * 0.7} funny={i === 2} />
            ))}
          </svg>

          {COMPONENTS.map((c) => {
            const Icon = c.icon;
            const dim = hovered && hovered !== c.id;
            return (
              <motion.button
                key={c.id}
                data-testid={`component-${c.id}`}
                onMouseEnter={() => setHovered(c.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onCpuClick(c)}
                whileHover={{ scale: 1.08, zIndex: 20 }}
                whileTap={{ scale: 0.95 }}
                className={`absolute ${c.pos} w-[16%] min-w-16 aspect-square chamfer glass border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all duration-500 ${dim ? "opacity-30 blur-[1px]" : "opacity-100"}`}
                style={{
                  borderColor: hovered === c.id ? c.color : "rgba(255,255,255,0.1)",
                  boxShadow: hovered === c.id ? `0 0 34px ${c.color}55, inset 0 0 20px ${c.color}22` : "none",
                }}
              >
                <Icon size={22} style={{ color: c.color }} />
                <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-white">{c.name}</span>
                {hovered === c.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -bottom-9 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-3 py-1.5 font-mono text-[9px] tracking-[0.25em] z-30 pointer-events-none"
                    style={{ color: c.color }}
                  >
                    {c.role}
                  </motion.div>
                )}
              </motion.button>
            );
          })}

          {/* tiny easter egg: CMOS battery */}
          <div className="absolute right-[30%] top-[62%] group cursor-help" data-testid="easter-cmos">
            <div className="w-4 h-4 rounded-full border border-amber2/60 group-hover:shadow-[0_0_14px_rgba(255,157,0,0.7)] transition-shadow" />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-52 glass p-3 text-[10px] font-mono text-amber2 tracking-wider opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30">
              CMOS BATTERY — keeps time for your PC even while unplugged. A coin cell can last 10 years.
            </div>
          </div>
        </div>

        <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-muted2 uppercase">Tip: the CPU dislikes being poked repeatedly.</p>
      </div>

      {/* Component zoom overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            data-testid="component-overlay"
            className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-void/80 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="glass chamfer border max-w-lg w-full p-8 sm:p-10 relative"
              style={{ borderColor: `${selected.color}66`, boxShadow: `0 0 80px ${selected.color}22` }}
            >
              <button data-testid="component-overlay-close" onClick={() => setSelected(null)} className="absolute top-4 right-4 text-slate2 hover:text-white cursor-pointer"><X size={18} /></button>
              <div className="font-mono text-[10px] tracking-[0.35em] uppercase" style={{ color: selected.color }}>{selected.role}</div>
              <h3 className="font-display font-bold text-3xl sm:text-4xl text-white mt-2">{selected.name}</h3>
              <p className="mt-4 text-slate2 text-sm sm:text-base leading-relaxed">{selected.blurb}</p>
              {/* mini demo: instructions entering */}
              <div className="mt-6 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: selected.color, boxShadow: `0 0 12px ${selected.color}` }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <LearnMore facts={selected.facts} testId={`learn-more-${selected.id}`} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overclock easter egg */}
      <AnimatePresence>
        {overclock && (
          <motion.div
            data-testid="overclock-overlay"
            className="fixed inset-0 z-[85] flex items-center justify-center p-6 bg-laser/10 backdrop-blur-md"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setOverclock(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="glass chamfer border border-laser/60 max-w-md w-full p-8 font-mono text-center"
              style={{ boxShadow: "0 0 80px rgba(255,42,85,0.3)" }}
            >
              <div className="text-laser text-xs tracking-[0.4em] uppercase animate-pulse-soft">!! Overclock Mode Engaged !!</div>
              <div className="mt-6 space-y-1 text-left text-[11px] text-slate2">
                <p>&gt; core_voltage ....... 1.42V <span className="text-laser">▲</span></p>
                <p>&gt; clock ............. 6.66 GHz <span className="text-laser">▲</span></p>
                <p>&gt; die_temp .......... 97.3°C <span className="text-laser">▲</span></p>
                <p>&gt; fan_curve ......... JET ENGINE</p>
                <p>&gt; stability ......... <span className="text-phosphor">somehow yes</span></p>
              </div>
              <p className="mt-6 text-[10px] text-muted2 tracking-[0.2em] uppercase">You poked it 10 times. It noticed. Click anywhere to cool down.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default HardwareMap;
