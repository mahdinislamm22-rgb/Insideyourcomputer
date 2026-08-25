import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
const PACKET_LOG = ["SYN → 142.250.72.14", "ACK ← cdn.edge-09", "HTTP 418 I'm a teapot", "Cat GIF packet #42069", "GET /style.css 200", "user_click_interrupt handled", "TLS handshake ok", "cache HIT l2", "dns: 8.8.8.8 answered", "frame presented 16.6ms"];

const DevHud = () => {
  const [on, setOn] = useState(false);
  const [fps, setFps] = useState(60);
  const [log, setLog] = useState([]);
  const idx = useRef(0);

  useEffect(() => {
    let pos = 0;
    const onKey = (e) => {
      if (e.key === KONAMI[pos]) {
        pos++;
        if (pos === KONAMI.length) { setOn((o) => !o); pos = 0; }
      } else pos = e.key === KONAMI[0] ? 1 : 0;
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!on) return;
    let last = performance.now(), frames = 0, raf;
    const loop = (t) => {
      frames++;
      if (t - last >= 1000) { setFps(frames); frames = 0; last = t; }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const logId = setInterval(() => {
      setLog((l) => [...l.slice(-5), PACKET_LOG[idx.current++ % PACKET_LOG.length]]);
    }, 700);
    return () => { cancelAnimationFrame(raf); clearInterval(logId); };
  }, [on]);

  return (
    <AnimatePresence>
      {on && (
        <motion.div
          data-testid="dev-hud"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 30 }}
          className="fixed top-20 right-5 z-[75] w-64 glass chamfer border border-signal/50 p-4 font-mono text-[10px]"
          style={{ boxShadow: "0 0 40px rgba(0,240,255,0.2)" }}
        >
          <div className="flex justify-between items-center mb-3">
            <span className="text-signal tracking-[0.3em] uppercase">Dev Mode · unlocked</span>
            <button data-testid="dev-hud-close" onClick={() => setOn(false)} className="text-slate2 hover:text-white cursor-pointer"><X size={13} /></button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-slate2">
            <span>FPS <span className="text-phosphor float-right">{fps}</span></span>
            <span>HEAP <span className="text-phosphor float-right">{(performance.memory ? performance.memory.usedJSHeapSize / 1048576 : 42).toFixed(0)}MB</span></span>
          </div>
          <div className="mt-3 pt-3 border-t border-white/10 space-y-1 min-h-24">
            {log.map((l, i) => (
              <motion.p key={`${l}-${i}`} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} className="text-signal/70 truncate">▸ {l}</motion.p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DevHud;
