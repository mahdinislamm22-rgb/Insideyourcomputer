import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileImage, FileVideo, Gamepad2, FileText, Music } from "lucide-react";
import { Tag, MaskedLines, LearnMore, Disclaimer } from "./Shared";
import { audio } from "../../lib/audio";

const FILES = [
  { name: "PHOTO", size: "24 MB", icon: FileImage, blocks: 14 },
  { name: "VIDEO", size: "2.1 GB", icon: FileVideo, blocks: 22 },
  { name: "GAME", size: "86 GB", icon: Gamepad2, blocks: 28 },
  { name: "DOCUMENT", size: "340 KB", icon: FileText, blocks: 10 },
  { name: "MUSIC", size: "9 MB", icon: Music, blocks: 12 },
];

const SsdSection = () => {
  const [active, setActive] = useState(null); // {file, key}
  const [delivered, setDelivered] = useState(0);

  const load = (f) => {
    audio.click(1300);
    setDelivered(0);
    setActive({ file: f, key: Date.now() });
    for (let i = 0; i < f.blocks; i++) setTimeout(() => setDelivered(i + 1), 400 + i * 110);
  };

  return (
    <section id="ssd" data-testid="ssd-section" className="relative py-32 sm:py-40 grid-bg overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <Tag color="text-amber2">05 · Long-term storage</Tag>
          <MaskedLines lines={["SSD: WHERE YOUR", "DATA LIVES."]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
          <p className="mt-6 text-slate2 text-sm sm:text-base max-w-lg font-body">
            Select a file. Watch it shatter into blocks and stream toward memory — storage hands off to RAM, because the CPU never reads from disk directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* File vault */}
          <div className="glass chamfer border border-amber2/25 p-6">
            <div className="font-mono text-[10px] tracking-[0.3em] text-amber2 uppercase mb-5">NAND Flash Vault · NVMe</div>
            <div className="space-y-3">
              {FILES.map((f) => {
                const Icon = f.icon;
                const isActive = active?.file.name === f.name;
                return (
                  <button
                    key={f.name}
                    data-testid={`ssd-file-${f.name.toLowerCase()}`}
                    onClick={() => load(f)}
                    className={`w-full flex items-center justify-between chamfer border px-5 py-4 transition-all duration-300 cursor-pointer ${
                      isActive ? "border-amber2/70 bg-amber2/10 shadow-[0_0_24px_rgba(255,157,0,0.2)]" : "border-white/10 hover:border-amber2/40"
                    }`}
                  >
                    <span className="flex items-center gap-3 font-mono text-xs tracking-[0.25em] text-white">
                      <Icon size={16} className="text-amber2" /> {f.name}
                    </span>
                    <span className="font-mono text-[10px] text-muted2">{f.size}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Block stream visualization */}
          <div className="glass chamfer border border-white/10 p-6 min-h-[320px] relative overflow-hidden">
            <div className="flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase">
              <span className="text-amber2">SSD</span>
              <span className="text-slate2">PCIe 4.0 ×4</span>
              <span className="text-phosphor">RAM</span>
            </div>
            <div className="absolute left-6 right-6 top-16 h-px bg-white/10" />
            <div className="absolute left-6 top-[52px] w-3 h-3 chamfer bg-amber2/80" style={{ boxShadow: "0 0 14px rgba(255,157,0,0.7)" }} />
            <div className="absolute right-6 top-[52px] w-3 h-3 chamfer bg-phosphor/80" style={{ boxShadow: "0 0 14px rgba(0,255,102,0.7)" }} />

            <AnimatePresence>
              {active && active.file.blocks && Array.from({ length: active.file.blocks }).map((_, i) => (
                <motion.div
                  key={`${active.key}-${i}`}
                  className="absolute top-[54px] w-2 h-2 chamfer"
                  style={{ background: i % 2 ? "#00F0FF" : "#FF9D00", boxShadow: "0 0 8px currentColor" }}
                  initial={{ left: "6%", top: 54 + (i % 5) * 22, opacity: 0 }}
                  animate={{ left: "92%", top: 54, opacity: [0, 1, 1, 0] }}
                  transition={{ delay: 0.35 + i * 0.11, duration: 0.7, ease: "easeIn" }}
                />
              ))}
            </AnimatePresence>

            <div className="mt-24">
              {active ? (
                <>
                  <div className="font-mono text-[10px] tracking-[0.25em] text-slate2 uppercase">Blocks delivered to RAM</div>
                  <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <motion.div className="h-full bg-phosphor" style={{ boxShadow: "0 0 10px #00FF66" }} animate={{ width: `${(delivered / active.file.blocks) * 100}%` }} />
                  </div>
                  <p className="mt-3 font-mono text-[11px] text-white">{active.file.name} <span className="text-muted2">→ {delivered}/{active.file.blocks} blocks</span></p>
                </>
              ) : (
                <p className="font-mono text-[11px] text-muted2 tracking-[0.2em] uppercase">Awaiting file selection…</p>
              )}
            </div>
          </div>
        </div>

        {/* Storage ≠ Memory */}
        <div className="mt-14 grid sm:grid-cols-2 gap-6">
          <div className="glass chamfer border border-amber2/30 p-7">
            <div className="font-mono text-[10px] tracking-[0.3em] text-amber2 uppercase">Storage — SSD</div>
            <ul className="mt-4 space-y-2 text-sm text-slate2 font-body">
              <li>Remembers everything with power off</li>
              <li>Huge (terabytes), slow-ish (microseconds)</li>
              <li>The warehouse</li>
            </ul>
          </div>
          <div className="glass chamfer border border-phosphor/30 p-7">
            <div className="font-mono text-[10px] tracking-[0.3em] text-phosphor uppercase">Memory — RAM</div>
            <ul className="mt-4 space-y-2 text-sm text-slate2 font-body">
              <li>Forgets everything when power dies</li>
              <li>Smaller (gigabytes), blazing (nanoseconds)</li>
              <li>The workbench</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <LearnMore
            testId="learn-more-ssd"
            facts={[
              "Files are split into ~4 KB blocks scattered across NAND chips, then reassembled by the controller.",
              "NVMe drives talk to the CPU over PCIe lanes — the same highway the GPU uses.",
              "SSDs have no moving parts; hard drives physically swing a read head over spinning platters.",
            ]}
          />
          <Disclaimer>Block flow is conceptual — real transfers move millions of blocks per second</Disclaimer>
        </div>
      </div>
    </section>
  );
};

export default SsdSection;
