// gui.js
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { setupParamDebugger } from './paramDebug.js';

export function buildGUI(params, hooks = {}) {
  const gui = new GUI();
  // move to top-left
  const el = gui.domElement;
  el.style.position = 'fixed';
  el.style.top = '0px';
  el.style.left = '0x';
  el.style.right = 'auto';
  el.style.bottom = 'auto';
  el.style.zIndex = '10000'; // sits above canvas

  const onParamsChanged = hooks.onParamsChanged || (() => {});
  const refreshComposer = hooks.refreshComposer || (() => {});

  const dbg = setupParamDebugger({
  panel: true,
  maxRows: 10,
  corner: 'bottom-left',
  offsetX: 5,
  offsetY: 5,
  });

  // ---------- Kaleidoscope ----------
  const gBase = gui.addFolder('Kaleidoscope');
  dbg.bindController(gBase.add(params, 'tileCount', 1, 50, 1), params, 'tileCount', 'Kaleidoscope', onParamsChanged);
  dbg.bindController(gBase.add(params, 'squareSize', 0.05, 0.5, 0.01), params, 'squareSize', 'Kaleidoscope', onParamsChanged);
  dbg.bindController(gBase.add(params, 'thickness', 0.01, 0.5, 0.01), params, 'thickness', 'Kaleidoscope', onParamsChanged);
  dbg.bindController(gBase.add(params, 'kaleidoSides', 1, 32, 1), params, 'kaleidoSides', 'Kaleidoscope', onParamsChanged);
  dbg.bindController(gBase.add(params, 'distortionAmp', 0, 2, 0.01), params, 'distortionAmp', 'Kaleidoscope', onParamsChanged);
  dbg.bindController(gBase.add(params, 'distortionFreq', 0, 100, 0.01), params, 'distortionFreq', 'Kaleidoscope', onParamsChanged);
  dbg.bindController(gBase.add(params, 'speed', 0.0, 2.0, 0.01), params, 'speed', 'Kaleidoscope', onParamsChanged);
  gBase.open();

  // ---------- Spiral ----------
  const gSpiral = gui.addFolder('Spiral');
  dbg.bindController(gSpiral.add(params, 'spiralEnabled'), params, 'spiralEnabled', 'Spiral', refreshComposer);
  dbg.bindController(gSpiral.add(params, 'spiralStrength', 0, 10, 0.01), params, 'spiralStrength', 'Spiral', onParamsChanged);
  dbg.bindController(gSpiral.add(params, 'spiralSpeed', 0, 2.0, 0.01), params, 'spiralSpeed', 'Spiral', onParamsChanged);
  dbg.bindController(gSpiral.add(params, 'spiralRadius', 0.0, 1.5, 0.01).name('Radius'), params, 'spiralRadius', 'Spiral', onParamsChanged);
  dbg.bindController(gSpiral.add(params, 'spiralFalloffExp', 0.1, 5.0, 0.1).name('Falloff exp'), params, 'spiralFalloffExp', 'Spiral', onParamsChanged);

  // Toggle Button for Spiral Mode
  const modeLabel = () => (params.spiralMode ? 'Compounding' : 'Non-Compounding');
  const modeAPI = {
    toggleSpiralMode() {
      const prev = params.spiralMode;
      params.spiralMode = prev ? 0 : 1;
      // log to the debug panel
      dbg.logChange({ group: 'Spiral', key: 'spiralMode', from: prev, to: params.spiralMode });
      // let the app react
      onParamsChanged(params.spiralMode);
      // update the button label
      btn.name(`Spiral Mode: ${modeLabel()}`);
    }
  };
  const btn = gSpiral.add(modeAPI, 'toggleSpiralMode').name(`Spiral Mode: ${modeLabel()}`);

  // ---------- Chromatic Blur ----------
  const gChroma = gui.addFolder('Chromatic Blur');
  dbg.bindController(gChroma.add(params, 'chromaEnabled'), params, 'chromaEnabled', 'Chroma', refreshComposer);
  dbg.bindController(gChroma.add(params, 'chromaOffset', 0.0, 0.05, 0.001), params, 'chromaOffset', 'Chroma', onParamsChanged);
  dbg.bindController(gChroma.add(params, 'chromaSigma', 0.1, 4.0, 0.1), params, 'chromaSigma', 'Chroma', onParamsChanged);
  dbg.bindController(gChroma.add(params, 'chromaKernelSize', 3, 15, 2).name('kernelSize (odd)'), params, 'chromaKernelSize', 'Chroma', onParamsChanged);
  dbg.bindController(gChroma.add(params, 'chromaPixelStep', 0.0, 6.0, 0.1), params, 'chromaPixelStep', 'Chroma', onParamsChanged);

  // ---------- Glow ----------
  const gGlow = gui.addFolder('Glow');
  dbg.bindController(gGlow.add(params, 'glowEnabled'), params, 'glowEnabled', 'Glow', refreshComposer);
  dbg.bindController(gGlow.add(params, 'glowStrength', 0, 2, 0.01), params, 'glowStrength', 'Glow', onParamsChanged);
  dbg.bindController(gGlow.add(params, 'glowSteps', 0, 32, 1), params, 'glowSteps', 'Glow', onParamsChanged);

  // ---------- Glitch ----------
  const gGlitch = gui.addFolder('Glitch');
  dbg.bindController(gGlitch.add(params, 'glitchEnabled'), params, 'glitchEnabled', 'Glitch', refreshComposer);
  dbg.bindController(gGlitch.add(params, 'strength', 1, 20, 1), params, 'strength', 'Glitch', onParamsChanged);
  dbg.bindController(gGlitch.add(params, 'chunkSize', 1, 64, 1), params, 'chunkSize', 'Glitch', onParamsChanged);
  dbg.bindController(gGlitch.add(params, 'glitchSpeed', 0, 1.0, 0.01), params, 'glitchSpeed', 'Glitch', onParamsChanged);
  dbg.bindController(gGlitch.add(params, 'chance', 0, 1.0, 0.01), params, 'chance', 'Glitch', onParamsChanged);

  return gui;
}
