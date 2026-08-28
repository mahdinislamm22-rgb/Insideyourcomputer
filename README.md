# Inside Your Computer

An interactive 3D scrollytelling experience that follows a single mouse click all the way down through the hardware — actuation, CPU cores, RAM, GPU, network packets — and back again.

Built as a sci-fi hardware museum you scroll through.

**[Live demo →](https://insideyourcomputer.vercel.app)**

## What's in it

Nine sections, each an interactive simulation rather than a diagram:

- **Click actuation** — oscilloscope voltage-drop animation of the switch closing
- **CPU** — core scheduling, with an overclock mode
- **RAM** — hands-on allocation tool
- **GPU** — render pipeline visualisation
- **Network** — packet routing across hops
- **System stress** — what happens when it all runs at once

Plus a few things that aren't documented anywhere on the page. Konami code opens a developer HUD. Clicking the CPU fast enough overclocks it. There are hidden terminal commands.

## Built with

Three.js for particles and wireframe models · Lenis for momentum scroll · Web Audio API for a synthesised ambient soundscape (mutable) · full-stack with separate `frontend/` and `backend/`

## Design

Near-black `#050508` base with cyan, amber and violet accent glows. Unbounded for display, Chivo for headings, DM Sans for body, JetBrains Mono for technical readouts. Glassmorphism panels, backdrop blur, luminescent hover states.

## Running locally

```bash
npm install
npm run dev
```

## Notes

The hard part wasn't the 3D — it was pacing. Nine sections of scroll is a lot of rope to give a visitor, so each one had to justify itself with something you can actually poke at.
