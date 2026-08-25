import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MemoryStick, Cpu, HardDrive, MonitorPlay, Wifi } from "lucide-react";
import { Tag, MaskedLines, Disclaimer } from "./Shared";
import { audio } from "../../lib/audio";

const SCENARIOS = [
  {
    id: "ram", icon: MemoryStick, color: "#00FF66", title: "RAM IS FULL?",
    result: "The OS starts swapping pages to the SSD. Memory that took nanoseconds now takes microseconds — everything stutters.",
    metric: "SWAP ACTIVITY", unit: "MB/s",
  },
  {
    id: "cpu", icon: Cpu, color: "#00F0FF", title: "CPU OVERLOADED?",
    result: "At 100% utilization, tasks queue up. Above ~95°C the chip thermal-throttles — it slows itself down to survive.",
    metric: "CORE TEMP", unit: "°C",
  },
  {
    id: "ssd", icon: HardDrive, color: "#FF9D00", title: "SSD IS SLOW?",
    result: "Data trickles into RAM. The CPU sits idle, waiting — a fast brain starved by a slow warehouse.",
    metric: "READ SPEED", unit: "MB/s",
  },
  {
    id: "gpu", icon: MonitorPlay, color: "#8B5CF6", title: "GPU OVERLOADED?",
    result: "Frames take longer than 16 ms to render. Your 60 fps target slips — motion turns to slideshow.",
    metric: "FRAME RATE", unit: "fps",
  },
  {
    id: "net", icon: Wifi, color: "#00F0FF", title: "INTERNET IS SLOW?",
    result: "Packets crawl, some never arrive and must be resent. The request–response round trip stretches from milliseconds to seconds.",
    metric: "ROUND TRIP", unit: "ms",
  },
];

const SimBar = ({ active, color, danger }) => {
  const [v, setV] = useState(12);
  useEffect(() => {
    if (!active) { setV(12); return; }
    const id = setInterval(() => {
      setV((prev) => {
        const target = danger ? 97 : 96;
        return prev + (target - prev) * 0.06 + (Math.random() * 4 - 2);
      });
    }, 60);
    return () => clearInterval(id);
  }, [active, danger]);
  return (
    <div className="mt-5">
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full transition-[width] duration-100"
          style={{ width: `${Math.max(4, Math.min(100, v))}%`, background: v > 85 && active ? "#FF2A55" : color, boxShadow: `0 0 12px ${v > 85 && active ? "#FF2A55" : color}` }}
        />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] tracking-[0.2em]">
        <span className="text-muted2">LOAD</span>
        <span className={v > 85 && active ? "text-laser" : "text-slate2"}>{Math.round(v)}%</span>
      </div>
    </div>
  );
};

const WhatIf = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="whatif" data-testid="whatif-section" className="relative py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <Tag color="text-laser">08 · Stress lab</Tag>
          <MaskedLines lines={["WHAT IF", "THINGS GO WRONG?"]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
          <p className="mt-6 text-slate2 text-sm sm:text-base max-w-lg font-body">Push the system until it hurts. Pick a scenario.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SCENARIOS.map((s) => {
            const Icon = s.icon;
            const on = active === s.id;
            return (
              <motion.button
                key={s.id}
                data-testid={`whatif-${s.id}`}
                onClick={() => { setActive(on ? null : s.id); audio.click(on ? 600 : 1400); }}
                whileHover={{ y: -4 }}
                className={`text-left glass chamfer border p-7 cursor-pointer transition-all duration-500 ${on ? "border-laser/50 shadow-[0_0_40px_rgba(255,42,85,0.15)]" : "border-white/10 hover:border-white/25"}`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={22} style={{ color: on ? "#FF2A55" : s.color }} />
                  <span className={`font-mono text-[9px] tracking-[0.3em] uppercase ${on ? "text-laser animate-pulse-soft" : "text-muted2"}`}>
                    {on ? "● SIMULATING" : "ARM"}
                  </span>
                </div>
                <h3 className="mt-5 font-head font-bold text-lg text-white">{s.title}</h3>
                <AnimatePresence>
                  {on && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5 }} className="overflow-hidden">
                      <p className="mt-3 text-sm text-slate2 leading-relaxed">{s.result}</p>
                      <SimBar active={on} color={s.color} danger />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* summary card */}
          <div className="glass chamfer border border-signal/25 p-7 flex flex-col justify-center">
            <div className="font-mono text-[10px] tracking-[0.3em] text-signal uppercase">The pattern</div>
            <p className="mt-4 text-sm text-slate2 leading-relaxed font-body">
              Every bottleneck is the same story: one stage starves the next. Computing is a relay race — the slowest runner sets the pace.
            </p>
          </div>
        </div>

        <Disclaimer>Simulated load meters — illustrative, not measured from your hardware</Disclaimer>
      </div>
    </section>
  );
};

export default WhatIf;
