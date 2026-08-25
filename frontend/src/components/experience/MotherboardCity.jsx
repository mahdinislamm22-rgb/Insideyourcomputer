import { useState } from "react";
import { motion } from "framer-motion";
import { Tag, MaskedLines, PacketFlow, Disclaimer } from "./Shared";

const TRACES = [
  { d: "M 120 120 L 400 120 L 400 240", label: "CPU → RAM", sub: "Memory bus · ~100 ns round trip", color: "#00FF66" },
  { d: "M 120 120 L 120 380 L 560 380", label: "CPU → GPU", sub: "PCIe 5.0 ×16 · 63 GB/s", color: "#8B5CF6" },
  { d: "M 740 120 L 560 120 L 560 380", label: "SSD → SYSTEM", sub: "PCIe 4.0 ×4 · 7 GB/s", color: "#FF9D00" },
  { d: "M 740 380 L 700 380 L 700 240 L 400 240", label: "NETWORK → SYSTEM", sub: "Ethernet / Wi-Fi · interrupts on arrival", color: "#00F0FF" },
  { d: "M 400 240 L 400 380", label: "CHIPSET → PERIPHERALS", sub: "USB · audio · sensors", color: "#FF2A55" },
];

const NODES = [
  { x: 120, y: 120, label: "CPU" },
  { x: 400, y: 240, label: "CHIPSET" },
  { x: 740, y: 120, label: "SSD" },
  { x: 120, y: 380, label: "GPU" },
  { x: 740, y: 380, label: "NET" },
];

const MotherboardCity = () => {
  const [active, setActive] = useState(null);

  return (
    <section id="board" data-testid="motherboard-section" className="relative py-32 sm:py-40 grid-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <Tag>Interlude · The highway</Tag>
          <MaskedLines lines={["THE MOTHERBOARD:", "A CITY AT NIGHT."]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
          <p className="mt-6 text-slate2 text-sm sm:text-base max-w-lg font-body">
            Zoom out. Copper traces become glowing highways — every component talks over these roads. Hover a highway to see what it connects.
          </p>
        </div>

        <div className="relative glass chamfer border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,240,255,0.06),transparent_65%)]" />
          <svg viewBox="0 0 860 500" className="w-full h-auto block" data-testid="motherboard-svg">
            {/* faint grid streets */}
            {Array.from({ length: 16 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 57} y1="0" x2={i * 57} y2="500" stroke="rgba(0,240,255,0.05)" strokeWidth="1" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 55} x2="860" y2={i * 55} stroke="rgba(0,240,255,0.05)" strokeWidth="1" />
            ))}

            {TRACES.map((t, i) => (
              <g
                key={i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                className="cursor-pointer"
                data-testid={`trace-${i}`}
              >
                {/* wide invisible hit area */}
                <path d={t.d} fill="none" stroke="transparent" strokeWidth="26" />
                <path
                  d={t.d} fill="none"
                  stroke={t.color}
                  strokeOpacity={active === null || active === i ? 0.8 : 0.15}
                  strokeWidth={active === i ? 3.5 : 2}
                  style={{ filter: active === i ? `drop-shadow(0 0 8px ${t.color})` : "none", transition: "all 0.4s" }}
                />
                {(active === null || active === i) && <PacketFlow d={t.d} color={t.color} count={2} dur={2.4 + i * 0.5} funny={i === 3} />}
              </g>
            ))}

            {NODES.map((n) => (
              <g key={n.label}>
                <rect x={n.x - 26} y={n.y - 16} width="52" height="32" rx="4" fill="#0C0E12" stroke="rgba(255,255,255,0.25)" />
                <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize="10" fill="#F8FAFC" fontFamily="JetBrains Mono, monospace" letterSpacing="2">{n.label}</text>
              </g>
            ))}
          </svg>

          {/* Trace inspector */}
          <motion.div
            data-testid="trace-inspector"
            className="absolute bottom-4 left-4 glass chamfer px-5 py-3 border border-white/10"
            animate={{ opacity: active !== null ? 1 : 0.4 }}
          >
            <div className="font-mono text-[10px] tracking-[0.25em] text-signal uppercase">
              {active !== null ? TRACES[active].label : "HOVER A HIGHWAY"}
            </div>
            <div className="font-mono text-[10px] text-slate2 mt-1">
              {active !== null ? TRACES[active].sub : "Every road carries a different conversation"}
            </div>
          </motion.div>
        </div>

        <Disclaimer>Simplified topology — real boards route thousands of traces across up to 12 copper layers</Disclaimer>
      </div>
    </section>
  );
};

export default MotherboardCity;
