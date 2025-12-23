import * as THREE from 'three';
import { buildGUI } from './gui.js';
import { buildComposer } from './composer.js';

let renderer, scene, camera, composer, passes, gui, params;

console.log('THREE version:', THREE.REVISION);

function passUniforms(pass) {
  return (pass && (pass.uniforms || (pass.material && pass.material.uniforms))) || null;
}

function setU(pass, name, value) {
  const u = passUniforms(pass);
  if (u && u[name]) {
    u[name].value = value;
    return true;
  }
  console.warn(`[syncParams] Missing uniform '${name}' on`, pass?.name || pass);
  return false;
}

let _dumped = false;
function dumpUniformsOnce(passes) {
  if (_dumped) return;
  _dumped = true;
  passes.forEach((p, i) => {
    const u = passUniforms(p);
    const keys = u ? Object.keys(u) : [];
    console.log(`[uniforms] pass[${i}] ${p?.name || ''}:`, keys);
  });
}

init();
animate();

function init() {
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // scene + camera (fullscreen quad via post-processing)
  scene = new THREE.Scene();
  camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  params = {
    // Kaleidoscope
    tileCount: 8,
    squareSize: 0.25,
    thickness: 0.07,
    kaleidoSides: 8,
    distortionAmp: 0.1,
    distortionFreq: 0.2,
    speed: 0.8,

    // Spiral
    spiralEnabled: true,
    spiralStrength: 0.35,
    spiralSpeed: 0.6,
    spiralMode: 0,           // 0 = non-compounding, 1 = compounding
    spiralRadius: 1.0,       // 0..1 edge; >1 extends beyond
    spiralFalloffExp: 1.0,   // softness; try 0.6..2.0

    // Chromatic Blur
    chromaEnabled:    true,
    chromaOffset:     0.008,
    chromaSigma:      1.0,
    chromaKernelSize: 5,
    chromaPixelStep:  1.0,

    // Glow
    glowEnabled: true,
    glowStrength: 0.6,
    glowSteps: 0.005,

    // Glitch
    glitchEnabled: false,
    strength: 0.25,         // u_glitchStrength
    chunkSize: 32,          // u_chunkSize
    glitchSpeed: 1.0,       // u_glitchSpeed
    chance: 0.2,            // u_glitchChance
  };

  // Composer & passes
  ({ composer, passes } = buildComposer(renderer, scene, camera, params));

  // GUI (if your buildGUI takes hooks, pass them here)
  gui = buildGUI(params, {
    onParamsChanged: syncParams,
    refreshComposer: () => {
      // enable/disable passes and then resync uniforms
      applyPassEnables();
      syncParams();
    }
  });

  // Initial sync
  applyPassEnables();
  syncParams();

  window.addEventListener('resize', onResize, false);
}

function applyPassEnables() {
  // name these in the same order as composer.js
  const [basePatternPass, spiralPass, chromaPass, glowPass, glitchPass, outputPass] = passes;
  if (spiralPass) spiralPass.enabled = !!params.spiralEnabled;
  if (chromaPass) chromaPass.enabled = !!params.chromaEnabled;
  if (glowPass)   glowPass.enabled   = !!params.glowEnabled;
  if (glitchPass) glitchPass.enabled = !!params.glitchEnabled;
}

function syncParams() {
  const [basePatternPass, spiralPass, chromaPass, glowPass, glitchPass, outputPass] = passes;

  // Base pattern
  setU(basePatternPass, 'u_tileCount',     params.tileCount);
  setU(basePatternPass, 'u_squareSize',    params.squareSize);
  setU(basePatternPass, 'u_thickness',     params.thickness);
  setU(basePatternPass, 'u_kaleidoSides',  params.kaleidoSides);
  setU(basePatternPass, 'u_distortionAmp', params.distortionAmp);
  setU(basePatternPass, 'u_distortionFreq',params.distortionFreq);
  setU(basePatternPass, 'u_speed',         params.speed);

  // Spiral
  if (spiralPass) spiralPass.enabled = !!params.spiralEnabled;
  setU(spiralPass, 'u_strength', params.spiralStrength);
  setU(spiralPass, 'u_speed',    params.spiralSpeed);
  setU(spiralPass, 'u_mode',     (params.spiralMode|0));
  setU(spiralPass, 'u_radius',       params.spiralRadius);
  setU(spiralPass, 'u_falloffExp',   params.spiralFalloffExp);

  // Chromatic Blur (Gaussian)
  if (chromaPass) chromaPass.enabled = !!params.chromaEnabled;

  // enforce odd kernel size and sane ranges here so the shader sees valid values
  const kSize = Math.max(1, Math.min(15, (params.chromaKernelSize|0) | 1)); // force odd
  const sigma = Math.max(0.01, params.chromaSigma);
  const stepPx = Math.max(0.0, params.chromaPixelStep);

  setU(chromaPass, 'u_chromaOffset', params.chromaOffset); // UV units
  setU(chromaPass, 'u_kernelSize',   kSize);
  setU(chromaPass, 'u_sigma',        sigma);
  setU(chromaPass, 'u_pixelStepPx',  stepPx);

  // Glow
  if (glowPass) glowPass.enabled = !!params.glowEnabled;
  setU(glowPass, 'u_glowStrength', params.glowStrength);
  setU(glowPass, 'u_glowSteps',    Math.max(1, Math.min(32, Math.round(params.glowSteps))));

  // Glitch
  if (glitchPass) glitchPass.enabled = !!params.glitchEnabled;
  setU(glitchPass, 'u_glitchStrength', params.strength);
  setU(glitchPass, 'u_chunkSize',      Math.max(1, params.chunkSize));
  setU(glitchPass, 'u_glitchSpeed',    params.glitchSpeed);
  setU(glitchPass, 'u_glitchChance',   params.chance);
}

function onResize() {
  renderer.setSize(innerWidth, innerHeight);
  camera.updateProjectionMatrix();
  composer.setSize(innerWidth, innerHeight);

  const [basePatternPass, spiralPass, chromaPass, glowPass] = passes;
  const wh = [innerWidth, innerHeight];
  const upd = p => { const u = passUniforms(p); if (u && u.u_resolution) u.u_resolution.value.set(...wh); };
  upd(basePatternPass); upd(spiralPass); upd(chromaPass); upd(glowPass);
}

// update any resolution uniforms
const [basePatternPass, spiralPass, chromaPass, glowPass] = passes;
if (basePatternPass?.uniforms?.u_resolution) basePatternPass.uniforms.u_resolution.value.set(innerWidth, innerHeight);
if (spiralPass?.uniforms?.u_resolution)      spiralPass.uniforms.u_resolution.value.set(innerWidth, innerHeight);
if (chromaPass?.uniforms?.u_resolution)      chromaPass.uniforms.u_resolution.value.set(innerWidth, innerHeight);
if (glowPass?.uniforms?.u_resolution)        glowPass.uniforms.u_resolution.value.set(innerWidth, innerHeight);

function animate(t) {
  requestAnimationFrame(animate);
  // time
  const timeSec = (performance.now() || t) / 1000;
  passes.forEach(p => {
  const u = passUniforms(p);
  if (u && u.u_time) u.u_time.value = timeSec;
  });
  // keep things in sync (cheap)
  syncParams();
  composer.render();
}