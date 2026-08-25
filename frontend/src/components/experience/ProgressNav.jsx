import { useEffect, useState } from "react";

const STAGES = [
  { id: "first-click", label: "INPUT" },
  { id: "cpu", label: "CPU" },
  { id: "ram", label: "MEMORY" },
  { id: "gpu", label: "GRAPHICS" },
  { id: "ssd", label: "STORAGE" },
  { id: "network", label: "NETWORK" },
  { id: "display", label: "DISPLAY" },
];

const ProgressNav = () => {
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) setActive(STAGES.findIndex((s) => s.id === e.target.id));
      }),
      { rootMargin: "-40% 0px -40% 0px" }
    );
    STAGES.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <nav data-testid="progress-nav" className="fixed left-5 top-1/2 -translate-y-1/2 z-[70] hidden lg:flex flex-col gap-5">
      {STAGES.map((s, i) => (
        <button
          key={s.id}
          data-testid={`nav-${s.id}`}
          onClick={() => window.__lenis?.scrollTo(`#${s.id}`, { duration: 1.6 })}
          className="group flex items-center gap-3 cursor-pointer"
        >
          <span className={`font-mono text-[9px] tracking-[0.2em] transition-colors duration-300 ${active === i ? "text-signal" : "text-muted2/50 group-hover:text-slate2"}`}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={`h-px transition-all duration-500 ${active === i ? "w-8 bg-signal shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "w-4 bg-white/15 group-hover:bg-white/40"}`} />
          <span className={`font-mono text-[9px] tracking-[0.3em] transition-all duration-300 ${active === i ? "text-white opacity-100" : "opacity-0 group-hover:opacity-60 text-slate2"}`}>
            {s.label}
          </span>
        </button>
      ))}
    </nav>
  );
};

export default ProgressNav;
