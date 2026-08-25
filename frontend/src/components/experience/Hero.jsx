import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleHero from "./ParticleHero";
import { EASE, MaskedLines } from "./Shared";
import { audio } from "../../lib/audio";

const Hero = () => {
  const [entering, setEntering] = useState(false);
  const enteringRef = useRef(false);

  const enter = () => {
    if (entering) return;
    setEntering(true);
    enteringRef.current = true;
    audio.whoosh();
    setTimeout(() => {
      window.__lenis?.scrollTo("#first-click", { duration: 2.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    }, 1400);
    setTimeout(() => setEntering(false), 4200);
  };

  return (
    <section id="hero" data-testid="hero-section" className="relative h-[100svh] overflow-hidden">
      <ParticleHero entering={enteringRef} />

      {/* vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,#050508_85%)]" />

      {/* HUD corners */}
      <div className="absolute top-20 left-6 sm:left-10 font-mono text-[10px] tracking-[0.3em] text-signal/60 uppercase">SYS.BOOT // READY</div>
      <div className="absolute top-20 right-6 sm:right-24 font-mono text-[10px] tracking-[0.3em] text-slate2/60 uppercase hidden sm:block">VOLT 3.3V · CLK 5.0GHz</div>
      <div className="absolute bottom-24 left-6 sm:left-10 font-mono text-[10px] tracking-[0.3em] text-slate2/60 uppercase hidden sm:block">SIG/TRACE 0x2F</div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          className="font-mono text-[11px] sm:text-xs tracking-[0.5em] text-signal uppercase mb-6"
        >
          You are about to enter
        </motion.p>

        <MaskedLines
          as="h1"
          lines={["INSIDE YOUR", "COMPUTER"]}
          delay={0.3}
          className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white"
          lineClassName="text-glow"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9, ease: EASE }}
          className="mt-6 text-slate2 text-sm sm:text-base font-body tracking-wide"
        >
          You click. A billion things happen.
        </motion.p>

        <motion.button
          data-testid="enter-machine-btn"
          onClick={enter}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.9, ease: EASE }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="group mt-12 chamfer glass border border-signal/40 px-10 py-5 font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-signal hover:shadow-[0_0_60px_rgba(0,240,255,0.35)] transition-shadow duration-500 cursor-pointer"
        >
          Enter the machine
          <span className="inline-block ml-3 transition-transform duration-500 group-hover:translate-x-2">→</span>
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate2"
      >
        <span className="font-mono text-[10px] tracking-[0.4em] uppercase">Scroll to descend</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity }} className="w-px h-8 bg-gradient-to-b from-signal to-transparent" />
      </motion.div>

      {/* Fly-through flash overlay */}
      <AnimatePresence>
        {entering && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full bg-signal/40 blur-2xl"
              initial={{ scale: 0 }}
              animate={{ scale: 40 }}
              transition={{ duration: 1.6, ease: [0.7, 0, 0.9, 0.4] }}
            />
            <motion.div
              className="absolute inset-0 bg-void"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 1, 0] }}
              transition={{ duration: 3.2, times: [0, 0.4, 0.7, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
