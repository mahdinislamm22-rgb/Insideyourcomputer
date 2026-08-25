import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Tag, MaskedLines, Disclaimer } from "./Shared";

const MSG_1 = "And all of that happened because you clicked.";
const MSG_2 = "Your computer does this thousands of times every second.";

const FinalScreen = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-30%" });
  const canvasRef = useRef(null);
  const [phase, setPhase] = useState(0); // 0 black, 1 pixels, 2 msg1, 3 msg2
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current) return;
    started.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const w = (canvas.width = canvas.offsetWidth);
    const h = (canvas.height = canvas.offsetHeight);
    const px = 7;
    const cols = Math.ceil(w / px);
    const rows = Math.ceil(h / px);
    // build a "website" image: headline bar, text lines, image block, button
    const blocks = [];
    const addBlock = (x, y, bw, bh, color) => {
      for (let i = x; i < x + bw && i < cols; i++)
        for (let j = y; j < y + bh && j < rows; j++) blocks.push({ i, j, color });
    };
    addBlock(4, 4, 14, 5, "#00F0FF");                    // headline
    addBlock(4, 12, 26, 1, "#334155");                   // text lines
    addBlock(4, 15, 22, 1, "#334155");
    addBlock(4, 18, 24, 1, "#334155");
    addBlock(Math.floor(cols * 0.55), 4, Math.floor(cols * 0.35), Math.floor(rows * 0.45), "#1e293b"); // hero image
    addBlock(4, 23, 8, 3, "#FF9D00");                    // button
    // noise pixels for texture
    for (let k = 0; k < 900; k++) blocks.push({ i: Math.floor(Math.random() * cols), j: Math.floor(Math.random() * rows), color: `rgba(0,240,255,${Math.random() * 0.15})` });
    // shuffle so it "renders in"
    blocks.sort(() => Math.random() - 0.5);

    setTimeout(() => {
      setPhase(1);
      let idx = 0;
      const per = Math.ceil(blocks.length / 90);
      const draw = () => {
        for (let k = 0; k < per && idx < blocks.length; k++, idx++) {
          const b = blocks[idx];
          ctx.fillStyle = b.color;
          ctx.fillRect(b.i * px, b.j * px, px - 1, px - 1);
        }
        if (idx < blocks.length) requestAnimationFrame(draw);
        else setTimeout(() => setPhase(2), 500);
      };
      draw();
    }, 900);

    setTimeout(() => setPhase(2), 3400);
    setTimeout(() => setPhase(3), 6400);
  }, [inView]);

  return (
    <section id="display" data-testid="final-screen-section" ref={ref} className="relative py-32 sm:py-40">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-14 text-center">
          <div className="flex justify-center"><Tag>09 · The display</Tag></div>
          <MaskedLines lines={["BACK TO THE", "SURFACE."]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
        </div>

        {/* Monitor */}
        <div className="relative mx-auto max-w-3xl">
          <div className="chamfer border border-white/15 bg-obsidian p-3 sm:p-4 shadow-[0_20px_80px_rgba(0,0,0,0.7)]">
            <div className="relative aspect-[16/10] bg-black overflow-hidden">
              <canvas ref={canvasRef} data-testid="display-canvas" className="w-full h-full block" />
              {phase === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-[10px] tracking-[0.4em] text-muted2 uppercase animate-pulse-soft">Awaiting frame…</span>
                </div>
              )}
              {/* scanline sweep */}
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-transparent via-signal/5 to-transparent animate-scan pointer-events-none" />
            </div>
          </div>
          <div className="mx-auto w-24 h-3 bg-obsidian chamfer border-x border-b border-white/10" />
          <div className="mx-auto mt-1 w-40 h-1.5 bg-obsidian2 rounded-full" />
        </div>

        <div className="mt-14 text-center min-h-28">
          <AnimatePresence mode="wait">
            {phase === 2 && (
              <motion.p key="m1" data-testid="final-message-1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 1 }} className="font-display text-xl sm:text-3xl text-white">
                {MSG_1}
              </motion.p>
            )}
            {phase === 3 && (
              <motion.div key="m2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}>
                <p className="font-display text-xl sm:text-3xl text-white">{MSG_1}</p>
                <motion.p data-testid="final-message-2" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }} className="mt-5 font-mono text-xs sm:text-sm tracking-[0.3em] text-signal uppercase text-glow">
                  {MSG_2}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center"><Disclaimer>0.000000001 s after your finger moved, the first transistor flipped</Disclaimer></div>
      </div>
    </section>
  );
};

export default FinalScreen;
