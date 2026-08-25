# PRD — INSIDE YOUR COMPUTER

## Original Problem Statement
Build an award-worthy immersive interactive website called "INSIDE YOUR COMPUTER": a cinematic scroll journey where the user physically enters a computer and follows one click through Mouse → Input → OS → CPU → RAM → GPU → SSD → Motherboard → Network → Internet → Screen. Apple keynote + sci-fi interface + interactive 3D museum. Educational but visually driven; technically accurate with simplified models disclosed. Footer must creatively link https://portofolio-m.vercel.app/.

## User Choices (confirmed)
- Hybrid 3D: lightweight Three.js particles + CSS/SVG/Canvas scenes (60fps target)
- No backend — static frontend only
- Medium content depth (punchy explanation + expandable "Deeper specs" fact panels)
- Ambient sci-fi sound (synthesized Web Audio, muted by default, top-right toggle)

## Architecture
- React 19 (CRA/craco) + Tailwind, framer-motion for scroll reveals/micro-interactions, lenis momentum scrolling, three + @react-three/fiber for hero particle field & wireframe processor
- Synthesized Web Audio engine (no assets): /app/frontend/src/lib/audio.js
- All components in /app/frontend/src/components/experience/
- Backend service exists but is unused by design (user choice)

## Implemented (2026-08-25)
- Hero: masked line-by-line kinetic title, Three.js particle tunnel + wireframe processor, mouse parallax, "ENTER THE MACHINE" fly-through transition with Lenis scroll handoff
- The First Click: clickable mouse, sequential chain-reaction packet cascade (CLICK → … → DISPLAY)
- Inside the Machine: interactive board with 7 components (hover glow/dim/tooltip, click zoom overlay + Deeper specs), packet traces with hidden funny packet labels, CMOS battery hover easter egg
- CPU Engine: 8-core die, ALU, cache ring, animated packets, simulated ops counter, Turbo mode toggle
- RAM: 216-cell allocation grid, Open/Close app simulation, memory-pressure warning, resident process list
- SSD: file vault (5 files), block-stream to RAM visualization, Storage ≠ Memory comparison
- GPU: canvas particle render (2,400 particles), DATA → GRAPHICS → PIXELS → SCREEN stage lighting
- Motherboard City: glowing trace highways with hover inspector
- Network: REQUEST/RESPONSE packet across 5 hops, live latency readout, conceptual-route disclaimer
- What If?: 5 stress scenarios with simulated load meters
- Final Screen: monitor that pixel-renders a mini website, closing messages
- Finale: nodes light up sequentially, ONE CLICK / BILLIONS OF OPERATIONS, ENTER AGAIN, slow editorial marquee, creative "exit node" portfolio link
- Easter eggs: Konami (↑↑↓↓←→←→BA) Dev HUD with real FPS/heap + packet log; Ctrl+` hidden terminal (help/cpu-info/ram/ping matrix/overclock/secrets); 10 rapid CPU clicks → Overclock Mode overlay
- Fixed progress nav (01 INPUT … 07 DISPLAY), custom cursor, audio toggle, grain overlay, reduced-motion support, mobile adaptations (reduced particle/cell counts)

## Verified
- Compile clean; no console errors; all flows screenshot-tested (desktop + mobile hero): enter transition, chain reaction, component hover/overlay, CPU run/turbo, RAM allocate/clear, SSD block stream, GPU render, trace hover, network round trip, What-If sim, display render, finale/footer, Konami HUD, terminal.

## Backlog (P0–P2)
- P0: none blocking
- P1: per-section scroll-pinned camera zoom transitions (currently in-view reveals + parallax), real dotted world map for network section
- P2: WebGL shader plasma for GPU finale, haptics on mobile, shareable "ops counter" snapshot, more terminal commands, localized copy

## Next Tasks
1. Add pinned zoom transitions between chapters (scroll-driven scale/translate per section)
2. Dotted world map arcs in network section
3. Shader-based GPU finale visual
