import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { motion, useSpring } from "framer-motion";
import "@/App.css";
import Hero from "./components/experience/Hero";
import FirstClick from "./components/experience/FirstClick";
import HardwareMap from "./components/experience/HardwareMap";
import CpuEngine from "./components/experience/CpuEngine";
import RamGrid from "./components/experience/RamGrid";
import SsdSection from "./components/experience/SsdSection";
import GpuSection from "./components/experience/GpuSection";
import MotherboardCity from "./components/experience/MotherboardCity";
import NetworkSection from "./components/experience/NetworkSection";
import WhatIf from "./components/experience/WhatIf";
import FinalScreen from "./components/experience/FinalScreen";
import Finale from "./components/experience/Finale";
import ProgressNav from "./components/experience/ProgressNav";
import AudioToggle from "./components/experience/AudioToggle";
import Terminal from "./components/experience/Terminal";
import DevHud from "./components/experience/DevHud";

const Cursor = () => {
  const ref = useRef(null);
  const x = useSpring(0, { stiffness: 400, damping: 35 });
  const y = useSpring(0, { stiffness: 400, damping: 35 });
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e) => { x.set(e.clientX - 12); y.set(e.clientY - 12); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);
  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return null;
  return (
    <motion.div
      ref={ref}
      className="fixed top-0 left-0 z-[95] w-6 h-6 rounded-full border border-signal/50 pointer-events-none mix-blend-screen hidden sm:block"
      style={{ x, y, boxShadow: "0 0 14px rgba(0,240,255,0.25)" }}
    />
  );
};

const Divider = ({ label }) => (
  <div className="relative max-w-6xl mx-auto px-6 flex items-center gap-4 opacity-40">
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-signal/40 to-transparent" />
    <span className="font-mono text-[9px] tracking-[0.4em] text-signal/70 uppercase">{label}</span>
    <span className="h-px flex-1 bg-gradient-to-r from-transparent via-signal/40 to-transparent" />
  </div>
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return (
    <div className="App bg-void text-white font-body noise" data-testid="app-root">
      <Cursor />

      {/* minimal top bar */}
      <header className="fixed top-0 inset-x-0 z-[70] px-6 sm:px-10 py-5 flex items-center justify-between pointer-events-none">
        <button
          data-testid="brand-home"
          onClick={() => window.__lenis?.scrollTo(0, { duration: 2 })}
          className="pointer-events-auto font-display text-[11px] sm:text-xs font-semibold tracking-[0.3em] text-white/80 hover:text-signal transition-colors cursor-pointer"
        >
          INSIDE<span className="text-signal">/</span>YOUR<span className="text-signal">/</span>COMPUTER
        </button>
        <nav className="pointer-events-auto hidden md:flex items-center gap-7 pr-14 font-mono text-[10px] tracking-[0.3em] uppercase">
          {[["Journey", "#first-click"], ["Machine", "#machine"], ["What If?", "#whatif"], ["Finale", "#finale"]].map(([label, href]) => (
            <button
              key={label}
              data-testid={`topnav-${label.toLowerCase().replace(/[^a-z]/g, "")}`}
              onClick={() => window.__lenis?.scrollTo(href, { duration: 1.8 })}
              className="text-slate2 hover:text-signal transition-colors cursor-pointer"
            >
              {label}
            </button>
          ))}
        </nav>
      </header>

      <ProgressNav />
      <AudioToggle />

      <main>
        <Hero />
        <Divider label="Descent begins" />
        <FirstClick />
        <HardwareMap />
        <Divider label="Chapter 03 · Silicon" />
        <CpuEngine />
        <Divider label="Chapter 04 · Volatile" />
        <RamGrid />
        <Divider label="Chapter 05 · Persistent" />
        <SsdSection />
        <Divider label="Chapter 06 · Photons" />
        <GpuSection />
        <MotherboardCity />
        <Divider label="Chapter 07 · Escape velocity" />
        <NetworkSection />
        <WhatIf />
        <Divider label="Chapter 09 · Surfacing" />
        <FinalScreen />
        <Finale />
      </main>

      <Terminal />
      <DevHud />
    </div>
  );
}

export default App;
