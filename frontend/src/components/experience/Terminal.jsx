import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RESPONSES = {
  help: "commands: cpu-info · ram · ping matrix · overclock · secrets · clear · exit",
  "cpu-info": "8 cores @ 5.0GHz · L3 36MB · mood: overworked",
  ram: "6400 MT/s · volatile · forgets everything, like you before coffee",
  "ping matrix": "PING matrix (127.0.0.1): time=0.042ms — you are already inside",
  overclock: "ERROR: warranty voided 10 clicks ago (see: the CPU in section 02)",
  secrets: "the CMOS battery on the motherboard has opinions. hover it.",
};

const Terminal = () => {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState(["IYC/OS v6.1 — hidden shell", "type 'help'"]);
  const [input, setInput] = useState("");
  const bodyRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey && (e.key === "`" || e.key === "~")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    bodyRef.current?.scrollTo(0, bodyRef.current.scrollHeight);
  }, [lines]);

  const submit = (e) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;
    let out;
    if (cmd === "clear") { setLines([]); setInput(""); return; }
    if (cmd === "exit") { setOpen(false); setInput(""); return; }
    out = RESPONSES[cmd] || `command not found: ${cmd} — try 'help'`;
    setLines((l) => [...l, `guest@iyc:~$ ${cmd}`, out]);
    setInput("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-testid="hidden-terminal"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          className="fixed bottom-6 left-6 z-[85] w-[min(420px,calc(100vw-3rem))] glass chamfer border border-phosphor/40 font-mono text-[11px]"
          style={{ boxShadow: "0 0 40px rgba(0,255,102,0.15)" }}
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <span className="text-phosphor tracking-[0.25em] text-[9px] uppercase">/dev/hidden · tty0</span>
            <button data-testid="terminal-close" onClick={() => setOpen(false)} className="text-slate2 hover:text-white cursor-pointer">✕</button>
          </div>
          <div ref={bodyRef} className="p-4 h-44 overflow-y-auto space-y-1 text-phosphor/90">
            {lines.map((l, i) => <p key={i} className={l.startsWith("guest@") ? "text-slate2" : ""}>{l}</p>)}
          </div>
          <form onSubmit={submit} className="flex items-center gap-2 px-4 py-3 border-t border-white/10">
            <span className="text-phosphor">$</span>
            <input
              data-testid="terminal-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent outline-none text-white placeholder:text-muted2"
              placeholder="type a command…"
              spellCheck={false}
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terminal;
