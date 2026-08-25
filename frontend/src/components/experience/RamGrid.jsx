import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tag, MaskedLines, LearnMore, Disclaimer, useIsMobile } from "./Shared";
import { audio } from "../../lib/audio";

const APPS = [
  { name: "BROWSER", size: 34, color: "#00F0FF" },
  { name: "GAME", size: 46, color: "#FF9D00" },
  { name: "EDITOR", size: 22, color: "#00FF66" },
  { name: "PHOTOSHOP", size: 30, color: "#8B5CF6" },
];

const RamGrid = () => {
  const mobile = useIsMobile();
  const total = mobile ? 96 : 216;
  const [allocations, setAllocations] = useState([]); // [{name,color,cells:[idx]}]
  const [appIdx, setAppIdx] = useState(0);
  const [busy, setBusy] = useState(false);

  const used = useMemo(() => {
    const map = new Map();
    allocations.forEach((a) => a.cells.forEach((c) => map.set(c, a.color)));
    return map;
  }, [allocations]);

  const usedPct = Math.round((used.size / total) * 100);

  const openApp = () => {
    if (busy) return;
    const app = APPS[appIdx % APPS.length];
    const cellsNeeded = Math.round((app.size / 100) * total);
    const free = [];
    for (let i = 0; i < total && free.length < cellsNeeded; i++) if (!used.has(i)) free.push(i);
    // scatter allocation across free cells like a real allocator
    const cells = free.filter((_, i) => i % 2 === 0).concat(free.filter((_, i) => i % 2 === 1)).slice(0, cellsNeeded);
    setBusy(true);
    audio.click(1000 + appIdx * 200);
    // staggered fill
    cells.forEach((c, i) => {
      setTimeout(() => {
        setAllocations((prev) => {
          const existing = prev.find((p) => p.name === app.name && p.batch === appIdx);
          if (existing) {
            existing.cells.push(c);
            return [...prev];
          }
          return [...prev, { name: app.name, color: app.color, cells: [c], batch: appIdx }];
        });
        if (i === cells.length - 1) setBusy(false);
      }, i * (mobile ? 14 : 8));
    });
    setAppIdx((v) => v + 1);
  };

  const closeAll = () => {
    audio.click(500);
    // cells fade out staggered — volatile memory emptied
    setAllocations((prev) => prev.map((a) => ({ ...a, dying: true })));
    setTimeout(() => setAllocations([]), 700);
  };

  return (
    <section id="ram" data-testid="ram-section" className="relative py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <Tag color="text-phosphor">04 · Short-term memory</Tag>
          <MaskedLines lines={["RAM: FORGOTTEN", "AT POWER-OFF."]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
          <p className="mt-6 text-slate2 text-sm sm:text-base max-w-lg font-body">
            Open an app: its data races from the SSD into these memory cells, where the CPU can reach it in nanoseconds. Close it: the cells go dark.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-10">
          {/* Memory cell grid */}
          <div className="glass chamfer border border-phosphor/25 p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 font-mono text-[10px] tracking-[0.25em] uppercase">
              <span className="text-phosphor">DIMM SLOT 1 · DDR5</span>
              <span data-testid="ram-usage-label" className={usedPct > 80 ? "text-laser" : "text-slate2"}>{usedPct}% allocated</span>
            </div>
            <div data-testid="ram-cell-grid" className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${mobile ? 12 : 18}, 1fr)` }}>
              {Array.from({ length: total }).map((_, i) => {
                const color = used.get(i);
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-[2px] transition-all duration-300"
                    style={{
                      background: color ? color : "rgba(255,255,255,0.04)",
                      boxShadow: color ? `0 0 8px ${color}88` : "none",
                      opacity: color ? 1 : 0.6,
                    }}
                  />
                );
              })}
            </div>
            {/* gauge */}
            <div className="mt-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                animate={{ width: `${usedPct}%`, background: usedPct > 80 ? "#FF2A55" : "#00FF66" }}
                transition={{ duration: 0.6 }}
                style={{ boxShadow: "0 0 12px currentColor" }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4">
            <div className="glass chamfer border border-white/10 p-6">
              <div className="font-mono text-[10px] tracking-[0.3em] text-slate2 uppercase mb-4">Process launcher</div>
              <button
                data-testid="ram-open-app-btn"
                onClick={openApp}
                disabled={busy || usedPct > 92}
                className="w-full chamfer border border-phosphor/50 text-phosphor px-6 py-3.5 font-mono text-[11px] tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(0,255,102,0.3)] transition-shadow disabled:opacity-40 cursor-pointer"
              >
                {busy ? "Loading from SSD…" : "Open an app"}
              </button>
              <button
                data-testid="ram-close-apps-btn"
                onClick={closeAll}
                className="w-full mt-3 chamfer border border-white/15 text-slate2 px-6 py-3.5 font-mono text-[11px] tracking-[0.3em] uppercase hover:border-laser/50 hover:text-laser transition-colors cursor-pointer"
              >
                Close the apps
              </button>
              {usedPct > 80 && (
                <p className="mt-3 font-mono text-[10px] text-laser tracking-[0.15em] uppercase animate-pulse-soft">
                  Memory pressure high — the OS starts swapping to disk. Things get slow.
                </p>
              )}
            </div>

            <AnimatePresence>
              {allocations.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass chamfer border border-white/10 p-6 space-y-2">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-slate2 uppercase mb-2">Resident processes</div>
                  {allocations.map((a, i) => (
                    <div key={i} className="flex justify-between font-mono text-[11px]" style={{ color: a.color }}>
                      <span>{a.name}.exe</span>
                      <span>{a.cells.length} cells</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <LearnMore
              testId="learn-more-ram"
              facts={[
                "Each DRAM cell is one transistor + one capacitor holding a tiny charge: charged = 1, empty = 0.",
                "The charge leaks, so every cell is refreshed ~64 times per second — 'dynamic' RAM.",
                "When RAM fills, the OS pages data out to the SSD (swap) — that's the slowdown you feel.",
              ]}
            />
          </div>
        </div>

        <Disclaimer>Cells are a visualization — real RAM holds billions of cells per chip</Disclaimer>
      </div>
    </section>
  );
};

export default RamGrid;
