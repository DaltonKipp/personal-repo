// src/passes/ChromaticBlurPass.js
import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Gaussian-weighted horizontal RGB-split blur.
// - u_sigma:        Gaussian sigma (softness) in *tap space*
// - u_kernelSize:   odd number of taps to use (<= MAX_TAPS)
// - u_pixelStepPx:  pixel spacing between taps (e.g., 1..4 px)
// - u_chromaOffset: UV shift for R/B split (0..~0.05 typical)
// - u_debug:        0 = normal, 1 = visualize R/G/B sample offsets
export function ChromaticBlurPass(params) {
  const MAX_TAPS = 15; // compile-time constant for loop bounds

  const shader = {
    defines: {
      MAX_TAPS: String(MAX_TAPS),
    },
    uniforms: {
      tDiffuse:        { value: null },
      u_resolution:    { value: new THREE.Vector2(1, 1) },
      u_chromaOffset:  { value: params.chromaOffset },      // UV units
      u_sigma:         { value: params.chromaSigma },       // tap-space
      u_kernelSize:    { value: Math.min(MAX_TAPS, params.chromaKernelSize | 0) },
      u_pixelStepPx:   { value: params.chromaPixelStep },   // pixels
      u_weights:       { value: new Array(MAX_TAPS).fill(0) },
      u_debug:         { value: params.chromaDebug ? 1 : 0 },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: /* glsl */`
      precision mediump float;
      uniform sampler2D tDiffuse;
      uniform vec2  u_resolution;
      uniform float u_chromaOffset;
      uniform float u_sigma;
      uniform float u_pixelStepPx;
      uniform float u_weights[15];   // literal size for reliability
      uniform int   u_kernelSize;
      uniform int   u_debug;
      varying vec2  vUv;

      void main() {
        // Debug mode: show R from +offset, G center, B from -offset
        if (u_debug == 1) {
          vec2 chromaUV = vec2(u_chromaOffset, 0.0);
          vec3 vis;
          vis.r = texture2D(tDiffuse, vUv + chromaUV).r;
          vis.g = texture2D(tDiffuse, vUv).g;
          vis.b = texture2D(tDiffuse, vUv - chromaUV).b;
          gl_FragColor = vec4(vis, 1.0);
          return;
        }

        int kSize = u_kernelSize;
        int halfK = (kSize - 1) / 2;

        // Convert 1 pixel in X to UV
        vec2 pxToUV  = vec2(1.0 / u_resolution.x, 0.0);
        vec2 chromaUV = vec2(u_chromaOffset, 0.0);

        vec3 col = vec3(0.0);
        float total = 0.0;

        // Accumulate symmetric taps around center
        for (int i = 0; i < MAX_TAPS; i++) {
          if (i >= kSize) break; // only use first kSize weights

          int offset = i - halfK;
          float w = u_weights[i];
          vec2 offUV = float(offset) * (u_pixelStepPx * pxToUV);

          // RGB split: shift R right, B left
          float r = texture2D(tDiffuse, vUv + offUV + chromaUV).r;
          float g = texture2D(tDiffuse, vUv + offUV).g;
          float b = texture2D(tDiffuse, vUv + offUV - chromaUV).b;

          col   += vec3(r, g, b) * w;
          total += w;
        }

        float denom = max(total, 1e-6);
        vec3 outCol = col / denom;

        // Fallback in case of bad uniform upload
        if (total < 1e-6) {
          outCol = texture2D(tDiffuse, vUv).rgb;
        }
        gl_FragColor = vec4(outCol, 1.0);
      }
    `
  };

  const pass = new ShaderPass(shader);
  pass.name = 'ChromaticBlurPass';

  // Expose uniforms directly for your sync helpers
  pass.uniforms = pass.material.uniforms;
  const u = pass.material.uniforms;

  // --- CPU-side kernel building (normalized Gaussian) ---
  function buildGaussianWeights(size, sigma) {
    const half = (size - 1) / 2;
    const out = new Array(MAX_TAPS).fill(0);
    if (size < 1) return out;
    const s2 = 2.0 * sigma * sigma;
    let sum = 0;
    for (let i = 0; i < size; i++) {
      const x = i - half;
      const w = Math.exp(-(x * x) / s2);
      out[i] = w;
      sum += w;
    }
    // normalize first `size` weights
    for (let i = 0; i < size; i++) out[i] /= sum;
    return out;
  }

  // Pre-fill weights so first frame has data
  (function initWeights() {
    const size  = Math.max(1, Math.min(MAX_TAPS, (params.chromaKernelSize | 0) | 1));
    const sigma = Math.max(0.01, params.chromaSigma);
    const wts   = buildGaussianWeights(size, sigma);
    while (wts.length < MAX_TAPS) wts.push(0);
    u.u_weights.value = wts.slice(); // fresh array → ensures upload
  })();

  // Cache to avoid rebuilding every frame if unchanged
  let lastSigma = -1, lastSize = -1;

  pass.onBeforeRender = () => {
    // Guard values
    const size  = Math.max(1, Math.min(MAX_TAPS, (params.chromaKernelSize | 0) | 1)); // force odd
    const sigma = Math.max(0.01, params.chromaSigma);
    const stepPx = Math.max(0.0, params.chromaPixelStep);

    // Push uniforms
    u.u_resolution.value.set(window.innerWidth, window.innerHeight);
    u.u_chromaOffset.value = params.chromaOffset;
    u.u_kernelSize.value   = size;
    u.u_sigma.value        = sigma;
    u.u_pixelStepPx.value  = stepPx;
    u.u_debug.value        = params.chromaDebug ? 1 : 0;

    // Rebuild kernel only if size/sigma changed
    if (sigma !== lastSigma || size !== lastSize) {
      const wts = buildGaussianWeights(size, sigma);
      while (wts.length < MAX_TAPS) wts.push(0);
      u.u_weights.value = wts.slice(); // upload whole array
      lastSigma = sigma;
      lastSize  = size;
    }
  };

  return pass;
}
