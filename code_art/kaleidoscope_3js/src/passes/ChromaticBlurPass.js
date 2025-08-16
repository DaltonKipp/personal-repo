import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Gaussian-weighted horizontal RGB-split blur.
// - u_sigma:        Gaussian sigma (softness) in *tap space*
// - u_kernelSize:   odd number of taps to use (<= MAX_TAPS)
// - u_pixelStepPx:  pixel spacing between taps (e.g., 1..4 px)
// - u_chromaOffset: UV shift for R/B split (0..~0.05 typical)
export function ChromaticBlurPass(params) {
  const MAX_TAPS = 15; // must be a compile-time constant for WebGL1

  const shader = {
    defines: {
      MAX_TAPS: MAX_TAPS.toString(),
    },
    uniforms: {
      tDiffuse:        { value: null },
      u_resolution:    { value: new THREE.Vector2(1, 1) },
      u_chromaOffset:  { value: params.chromaOffset }, // UV units
      u_sigma:         { value: params.chromaSigma },  // in tap space
      u_kernelSize:    { value: Math.min(MAX_TAPS, params.chromaKernelSize|0) },
      u_pixelStepPx:   { value: params.chromaPixelStep }, // px between taps
      u_weights:       { value: new Array(MAX_TAPS).fill(0) },
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
      uniform float u_weights[MAX_TAPS];
      uniform int   u_kernelSize;
      varying vec2  vUv;

      void main() {
        int kSize = u_kernelSize;
        int halfK = (kSize - 1) / 2;

        // Convert 1 pixel in X to UV
        vec2 pxToUV = vec2(1.0 / u_resolution.x, 0.0);
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

          col += vec3(r, g, b) * w;
          total += w;
        }

        float denom = max(total, 1e-6);
        vec3 outCol = col / denom;

        // If denom is effectively zero (e.g., bad uniform upload), sample center
        if (total < 1e-6) {
          vec3 centerRGB = texture2D(tDiffuse, vUv).rgb;
          outCol = centerRGB;
        }
        gl_FragColor = vec4(outCol, 1.0);
      }
    `
  };

  const pass = new ShaderPass(shader);
  pass.name = 'ChromaticBlurPass';
  // Expose uniforms on pass for convenience with your sync helpers
  pass.uniforms = pass.material.uniforms;

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
    // rest remain 0s
    return out;
  }

  // Cache to avoid rebuilding every frame if unchanged
  let lastSigma = -1, lastSize = -1;

  const u = pass.material.uniforms;
  pass.onBeforeRender = () => {
    // Guard values
    const size = Math.max(1, Math.min(MAX_TAPS, (params.chromaKernelSize|0) | 1)); // force odd via GUI
    const sigma = Math.max(0.01, params.chromaSigma);
    const stepPx = Math.max(0.0, params.chromaPixelStep);

    // Push uniforms
    u.u_resolution.value.set(window.innerWidth, window.innerHeight);
    u.u_chromaOffset.value = params.chromaOffset;
    u.u_kernelSize.value   = size;
    u.u_sigma.value        = sigma;
    u.u_pixelStepPx.value  = stepPx;

    // Rebuild kernel only if size/sigma changed
    if (sigma !== lastSigma || size !== lastSize) {
      const wts = buildGaussianWeights(size, sigma);
      while (wts.length < MAX_TAPS) wts.push(0);
      u.u_weights.value = new Float32Array(wts);
      pass.material.needsUpdate = true;
      lastSigma = sigma;
      lastSize  = size;
    }
  };
  return pass;
}