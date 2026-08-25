import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Globe } from "lucide-react";
import { Tag, MaskedLines, LearnMore, Disclaimer } from "./Shared";
import { audio } from "../../lib/audio";

const HOPS = ["YOUR PC", "ROUTER", "ISP", "BACKBONE", "SERVER"];

const NetworkSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-20%" });
  const [phase, setPhase] = useState("idle"); // idle | request | response | done
  const [latency, setLatency] = useState(0);

  const send = () => {
    if (phase === "request" || phase === "response") return;
    audio.click(1500);
    setPhase("request");
    setLatency(0);
    const start = Date.now();
    const tick = setInterval(() => setLatency(Date.now() - start), 16);
    setTimeout(() => { setPhase("response"); audio.click(1100); }, 2200);
    setTimeout(() => { setPhase("done"); clearInterval(tick); setLatency(38 + Math.floor(Math.random() * 30)); audio.click(1800); }, 4400);
  };

  // x positions of hops as %
  const hopX = (i) => 8 + i * 21;

  return (
    <section id="network" data-testid="network-section" ref={ref} className="relative py-32 sm:py-40 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-60" />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <Tag>07 · Beyond the case</Tag>
          <MaskedLines lines={["THE INTERNET:", "LEAVING THE MACHINE."]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
          <p className="mt-6 text-slate2 text-sm sm:text-base max-w-lg font-body">
            Now the signal escapes. Your request crosses routers, ISPs and undersea fiber, finds a server on another continent — and races home with an answer.
          </p>
        </div>

        <div className="glass chamfer border border-white/10 p-6 sm:p-10 relative overflow-hidden">
          {/* wireframe horizon */}
          <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full border border-signal/10" />
          <div className="absolute -bottom-52 left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full border border-signal/5" />

          <div className="relative">
            <div className="flex justify-between items-end mb-6">
              <span className="font-mono text-[10px] tracking-[0.3em] text-signal uppercase flex items-center gap-2"><Globe size={13} /> Global route</span>
              <span data-testid="network-latency" className="font-mono text-xs text-slate2 tabular-nums">
                {phase === "idle" ? "— ms" : phase === "done" ? `RTT ${latency} ms` : `${latency} ms…`}
              </span>
            </div>

            {/* hops */}
            <div className="relative h-56 sm:h-64">
              <div className="absolute left-[8%] right-[8%] top-1/2 h-px bg-white/10" />
              {HOPS.map((hop, i) => (
                <div key={hop} className="absolute -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3" style={{ left: `${hopX(i)}%` }}>
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 chamfer glass border flex items-center justify-center"
                    animate={{
                      borderColor: (phase === "request" && i <= 4) || phase !== "idle" ? "rgba(0,240,255,0.6)" : "rgba(255,255,255,0.15)",
                      boxShadow: phase !== "idle" ? "0 0 20px rgba(0,240,255,0.25)" : "none",
                    }}
                    transition={{ delay: phase === "request" ? i * 0.4 : phase === "response" ? (4 - i) * 0.4 : 0 }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-signal" />
                  </motion.div>
                  <span className="font-mono text-[8px] sm:text-[10px] tracking-[0.2em] text-slate2 whitespace-nowrap">{hop}</span>
                </div>
              ))}

              {/* request packet (outbound, amber) */}
              <AnimatePresence>
                {phase === "request" && (
                  <motion.div
                    data-testid="request-packet"
                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                    initial={{ left: "8%", opacity: 0 }}
                    animate={{ left: "92%", opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.1, ease: "easeInOut" }}
                  >
                    <div className="w-3 h-3 chamfer bg-amber2" style={{ boxShadow: "0 0 16px rgba(255,157,0,0.9)" }} />
                    <span className="mt-2 font-mono text-[8px] tracking-[0.3em] text-amber2">REQUEST</span>
                  </motion.div>
                )}
                {phase === "response" && (
                  <motion.div
                    data-testid="response-packet"
                    className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                    initial={{ left: "92%", opacity: 0 }}
                    animate={{ left: "8%", opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.1, ease: "easeInOut" }}
                  >
                    <div className="w-3 h-3 chamfer bg-signal" style={{ boxShadow: "0 0 16px rgba(0,240,255,0.9)" }} />
                    <span className="mt-2 font-mono text-[8px] tracking-[0.3em] text-signal">RESPONSE</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {phase === "done" && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="absolute -bottom-2 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-phosphor uppercase">
                  Website data received — the GPU takes it from here
                </motion.div>
              )}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <button
                data-testid="open-website-btn"
                onClick={send}
                disabled={phase === "request" || phase === "response"}
                className="chamfer border border-signal/50 text-signal px-8 py-3.5 font-mono text-[11px] tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-shadow disabled:opacity-40 cursor-pointer"
              >
                {phase === "request" || phase === "response" ? "In transit…" : "Open website"}
              </button>
              <LearnMore
                testId="learn-more-network"
                facts={[
                  "Before the request, your PC asks DNS for the site's IP address — the internet's phone book.",
                  "TCP opens with a 3-way handshake (SYN, SYN-ACK, ACK); TLS then encrypts the conversation.",
                  "Light in fiber moves ~200,000 km/s — a transatlantic round trip physically can't beat ~60 ms.",
                ]}
              />
            </div>
            <Disclaimer>Conceptual route — real packets hop through a dozen+ routers and paths vary per packet</Disclaimer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NetworkSection;
