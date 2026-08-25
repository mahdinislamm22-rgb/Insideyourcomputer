import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { Tag, MaskedLines, LearnMore, Disclaimer, useIsMobile } from "./Shared";
import { audio } from "../../lib/audio";

const STAGES = ["DATA", "GRAPHICS", "PIXELS", "SCREEN"];

const GpuSection = () => {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef, { margin: "-15%" });
  const [rendering, setRendering] = useState(false);
  const [stage, setStage] = useState(0);
  const mobile = useIsMobile();
  const rafRef = useRef();

  useEffect(() => {
    if (!inView) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h, particles;
    const N = mobile ? 900 : 2400;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth * (window.devicePixelRatio > 1 ? 1.5 : 1);
      h = canvas.height = canvas.offsetHeight * (window.devicePixelRatio > 1 ? 1.5 : 1);
    };
    resize();
    window.addEventListener("resize", resize);

    const spawn = () => {
      particles = Array.from({ length: N }, () => ({
        x: Math.random() * w * 0.25,
        y: Math.random() * h,
        tx: w * 0.35 + Math.random() * w * 0.6,
        ty: Math.random() * h,
        p: 0,
        speed: 0.002 + Math.random() * 0.006,
        hue: 180 + Math.random() * 40,
        size: 1 + Math.random() * 2,
      }));
    };
    spawn();

    let t = 0;
    const draw = () => {
      t += 0.01;
      ctx.fillStyle = "rgba(5,5,8,0.28)";
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        if (rendering) p.p = Math.min(1, p.p + p.speed * (1 + Math.sin(t * 3) * 0.3));
        const x = p.x + (p.tx - p.x) * p.p;
        const y = p.y + (p.ty - p.y) * p.p + Math.sin(t * 2 + p.tx * 0.01) * 6 * p.p;
        // data particles cyan → rendered pixels shift to plasma colors
        const hue = p.p < 1 ? 187 : 160 + Math.sin(p.tx * 0.004 + t * 2) * 80 + p.ty * 0.08;
        ctx.fillStyle = `hsla(${hue}, 100%, ${55 + Math.sin(t * 4 + p.tx) * 10}%, ${0.35 + p.p * 0.5})`;
        const s = p.p >= 1 ? p.size * 1.4 : p.size;
        ctx.fillRect(x, y, s, s);
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [inView, rendering, mobile]);

  useEffect(() => {
    if (!rendering) return;
    const timers = STAGES.map((_, i) => setTimeout(() => setStage(i + 1), 700 * (i + 1)));
    return () => timers.forEach(clearTimeout);
  }, [rendering]);

  const startRender = () => {
    setStage(0);
    setRendering(true);
    audio.whoosh();
  };

  return (
    <section id="gpu" data-testid="gpu-section" ref={sectionRef} className="relative py-32 sm:py-40">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-14">
          <Tag color="text-[#8B5CF6]">06 · The painter</Tag>
          <MaskedLines lines={["GPU: PAINTING", "EVERY PIXEL."]} className="mt-6 font-display font-bold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight" />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            data-testid="gpu-render-btn"
            onClick={startRender}
            className="chamfer border border-[#8B5CF6]/60 text-[#8B5CF6] px-8 py-3.5 font-mono text-[11px] tracking-[0.3em] uppercase hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] transition-shadow cursor-pointer"
          >
            Render a frame
          </button>
          <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.25em]">
            {STAGES.map((s, i) => (
              <span key={s} className="flex items-center gap-3">
                <span data-testid={`gpu-stage-${s.toLowerCase()}`} className={`transition-colors duration-500 ${stage > i ? "text-signal" : "text-muted2"}`}>{s}</span>
                {i < STAGES.length - 1 && <span className="text-muted2">→</span>}
              </span>
            ))}
          </div>
        </div>

        <div className="relative chamfer border border-white/10 overflow-hidden glass">
          <canvas ref={canvasRef} data-testid="gpu-canvas" className="w-full h-[52vh] sm:h-[60vh] block bg-void" />
          {!rendering && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-mono text-[11px] tracking-[0.4em] text-muted2 uppercase">Frame buffer empty — press render</span>
            </div>
          )}
        </div>

        <div className="mt-8 grid lg:grid-cols-2 gap-8 items-start">
          <p className="text-slate2 text-sm sm:text-base leading-relaxed font-body">
            Each frame begins as raw numbers — vertex positions, textures, light data. Thousands of shader cores crunch the same math in parallel, and the result lands in the frame buffer: one color per pixel, millions of pixels, dozens of times per second.
          </p>
          <div>
            <LearnMore
              testId="learn-more-gpu"
              facts={[
                "A CPU has a few powerful cores; a GPU has thousands of small ones — perfect for doing identical math on every pixel at once.",
                "At 4K/60fps the GPU writes ~8.3 million pixels × 60 frames ≈ half a billion pixel updates per second.",
                "Shaders are tiny programs that run once per pixel to decide its final color.",
              ]}
            />
            <Disclaimer>Particle render is a stylized metaphor, not a real shader pipeline</Disclaimer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GpuSection;
