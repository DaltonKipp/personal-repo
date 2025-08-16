# Kaleidoscope (Three.js) — README

A modular Three.js playground that renders a procedural kaleidoscope image and post-processes it through a chain of effects (spiral, chroma blur/split, glow, glitch, etc.). A lil-gui control panel exposes parameters, and a lightweight debugger logs parameter changes.

---

## Quick Start

1) **Install / Serve**
- This project is pure ES modules. Any static server works:
  - `python -m http.server` (Python 3)
  - `npx serve` (Node)
  - Your favorite dev server

2) **Open**
- Visit `http://localhost:8000` (or whatever your server prints).
- You should see the animation + a GUI in the top-right.  
- Press **Ctrl+Shift+D** to toggle the param debug panel.

---

## Project Structure

```
kaleidoscope_3js/
├─ index.html
└─ src/
   ├─ main.js
   ├─ composer.js
   ├─ gui.js
   ├─ paramDebug.js
   └─ passes/
      ├─ BasePatternPass.js
      ├─ SpiralPass.js
      ├─ ChromaticBlurPass.js
      ├─ GlowPass.js
      ├─ GlitchPass.js
      └─ OutputPass.js
```

---

## File Responsibilities

### **index.html**
- Entry point. Loads `src/main.js` as an ES module.
- Provides a full-window `<canvas>` via Three.js’s WebGLRenderer.

### **main.js**
- Bootstraps the entire app.
- Creates the renderer, scene, camera, and EffectComposer.
- Wires up the render loop and syncs parameter updates from GUI → passes.

### **composer.js**
- Builds the EffectComposer chain in order:
  - `BasePatternPass` → `SpiralPass` → `ChromaticBlurPass` → `GlowPass` → `GlitchPass` → `OutputPass`
- Provides helpers like `syncParams()` to propagate JS params into shader uniforms.
- Handles enabling/disabling passes.

### **gui.js**
- Creates the lil-gui interface and folders for each effect.
- Binds GUI sliders/toggles to the global params object.
- Integrates with `paramDebug.js` to log parameter changes.

### **paramDebug.js**
- Small floating debug overlay that logs the last N parameter changes.
- Toggle visibility with **Ctrl+Shift+D**.
- Keeps a rolling history (default: last 10 changes).

### **passes/**
Each file defines a `ShaderPass` for one stage of the effect chain.

- **BasePatternPass.js**
  - Generates the kaleidoscope pattern (tiles, kaleidoscope sides, distortion, speed).

- **SpiralPass.js**
  - Applies a vortex/spiral warp effect with adjustable strength and speed.

- **ChromaticBlurPass.js**
  - Splits RGB channels and applies a Gaussian-weighted horizontal blur.
  - Parameters: `chromaOffset`, `chromaSigma`, `chromaKernelSize`, `chromaPixelStep`.

- **GlowPass.js**
  - Multi-tap blur to simulate glow/edge bloom around bright areas.
  - Configurable strength and step count.

- **GlitchPass.js**
  - Randomly offsets rectangular chunks of the image for a glitchy VHS-like effect.
  - Parameters: `strength`, `chunkSize`, `glitchSpeed`, `chance`.

- **OutputPass.js**
  - Final copy/tonemapping pass (can be extended for FXAA, LUTs, etc.).

---

## Debugging Tips

- If an effect shows black:
  - Check uniform values in `syncParams()`.
  - Confirm kernel sizes are odd (e.g. 3, 5, 7…).
  - Inspect the param debugger panel for live changes.

- To profile performance:
  - Reduce kernel size/steps for blur/glow passes.
  - Disable unused passes in the GUI.

---

## Keyboard Shortcuts

- **Ctrl+Shift+D** → Toggle debug panel position/visibility.

---

## License

MIT — free for personal and commercial use.  
(c) 2025 Your Name
