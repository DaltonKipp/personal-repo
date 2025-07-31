// Kaleidoscope Shader with Glitch Effect, Save/Load, Randomize and GUI Controls

let kaleidoShader, glitchShader;
let kaleidoBuffer;
let gui;

// Minimum and Maximum Values
const tileCountMin = 1;
const tileCountMax = 50;
const squareSizeMin = 0.05;
const squareSizeMax = 0.5;
const thicknessMin = 0.05;
const thicknessMax = 0.5;
const kaleidoSidesMin = 1;
const kaleidoSidesMax = 32;
const distortionAmpMin = 0.0;
const distortionAmpMax = 0.5;
const distortionFreqMin = 0.0;
const distortionFreqMax = 100.0;
const chromaOffsetMin = 0.0;
const chromaOffsetMax = 0.2;
const chromaBlurMin = 0.0;
const chromaBlurMax = 0.5;
const glowStrengthMin = 0.0;
const glowStrengthMax = 1.0;
const glowStepsMin = 1;
const glowStepsMax = 20;
const speedMin = 0.0;
const speedMax = 2.0;
const spiralStrengthMin = 0.0;
const spiralStrengthMax = 0.5;
const spiralSpeedMin = 0.0;
const spiralSpeedMax = 1.0;
const glitchStrengthMin = 0.0;
const glitchStrengthMax = 0.2;
const glitchChunkSizeMin = 1;
const glitchChunkSizeMax = 100;
const glitchSpeedMin = 0.0;
const glitchSpeedMax = 10;
const glitchChanceMin = 0.0;
const glitchChanceMax = 1.0;
const randomDamping = 0.75;

let params = {
  tileCount: 10.0,
  squareSize: 0.30,
  thickness: 0.15,
  kaleidoSides: 8.0,
  distortionAmp: 0.05,
  distortionFreq: 5.0,
  chromaOffset: 0.01,
  chromaBlur: 0.05,
  glowStrength: 0.5,
  glowSteps: 5,
  speed: 0.5,
  spiralStrength: 0.50,
  spiralSpeed: 0.50
};

let glitchParams = {
  strength: 0.005,
  chunkSize: 10.0,
  speed: 0.0,
  chance: 1.0
};

function preload() {
  kaleidoShader = new p5.Shader(this.renderer, vertSrc, fragSrc);
  glitchShader = new p5.Shader(this.renderer, vertSrc, glitchFragSrc);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  kaleidoBuffer = createGraphics(width, height, WEBGL);
  kaleidoBuffer.noStroke();

  gui = new dat.GUI();

  const kaleidoFolder = gui.addFolder('Kaleidoscope');
  kaleidoFolder.add(params, 'tileCount', tileCountMin, tileCountMax).step(1).name('Tile Count');
  kaleidoFolder.add(params, 'squareSize', squareSizeMin, squareSizeMax).step(0.01).name('Square Size');
  kaleidoFolder.add(params, 'thickness', thicknessMin, thicknessMax).step(0.01).name('Thickness');
  kaleidoFolder.add(params, 'kaleidoSides', kaleidoSidesMin, kaleidoSidesMax).step(1).name('Kaleido Sides');
  kaleidoFolder.add(params, 'speed', speedMin, speedMax).step(0.01).name('Speed');
  kaleidoFolder.add({ randomizeKaleido: () => randomizeParams(params, kaleidoFolder) }, 'randomizeKaleido').name('Randomize');

  const distortionFolder = gui.addFolder('Distortion');
  distortionFolder.add(params, 'distortionAmp', distortionAmpMin, distortionAmpMax).step(0.01).name('Dist. Amplitude');
  distortionFolder.add(params, 'distortionFreq', distortionFreqMin, distortionFreqMax).step(1.0).name('Dist. Frequency');
  distortionFolder.add({ randomizeDistortion: () => randomizeParams(params, distortionFolder) }, 'randomizeDistortion').name('Randomize');

  const chromaticFolder = gui.addFolder('Chromatic Effect');
  chromaticFolder.add(params, 'chromaOffset', chromaOffsetMin, chromaOffsetMax).step(0.01).name('Chroma Offset');
  chromaticFolder.add(params, 'chromaBlur', chromaBlurMin, chromaBlurMax).step(0.01).name('Chroma Blur');
  chromaticFolder.add(params, 'glowStrength', glowStrengthMin, glowStrengthMax).step(0.01).name('Glow');
  chromaticFolder.add(params, 'glowSteps', glowStepsMin, glowStepsMax).step(1).name('Glow Steps');
  chromaticFolder.add({ randomizeChroma: () => randomizeParams(params, chromaticFolder) }, 'randomizeChroma').name('Randomize');

  const spiralFolder = gui.addFolder('Spiral Effect');
  spiralFolder.add(params, 'spiralStrength', spiralStrengthMin, spiralStrengthMax).step(0.01).name('Spiral Strength');
  spiralFolder.add(params, 'spiralSpeed', spiralSpeedMin, spiralSpeedMax).step(0.01).name('Spiral Speed');
  spiralFolder.add({ randomizeSpiral: () => randomizeParams(params, spiralFolder) }, 'randomizeSpiral').name('Randomize');

  const glitchFolder = gui.addFolder('Glitch Effect');
  glitchFolder.add(glitchParams, 'strength', glitchStrengthMin, glitchStrengthMax).step(0.001).name('Glitch Strength');
  glitchFolder.add(glitchParams, 'chunkSize', glitchChunkSizeMin, glitchChunkSizeMax).step(1).name('Chunk Size');
  glitchFolder.add(glitchParams, 'speed', glitchSpeedMin, glitchSpeedMax).step(0.1).name('Glitch Speed');
  glitchFolder.add(glitchParams, 'chance', glitchChanceMin, glitchChanceMax).step(0.01).name('Glitch Chance');
  glitchFolder.add({ disableGlitch }, 'disableGlitch').name('Disable Glitch');
  glitchFolder.add({ randomizeGlitch: () => randomizeParams(glitchParams, glitchFolder) }, 'randomizeGlitch').name('Randomize');

  const presetFolder = gui.addFolder('Preset Folder');
  presetFolder.add({ randomizeAll: randomize }, 'randomizeAll').name('Randomize All Parameters');
  presetFolder.add({ savePreset }, 'savePreset').name('Save Preset');
  presetFolder.add({ loadPreset }, 'loadPreset').name('Load Preset');
}

function randomizeParams(targetParams, folder) {
  folder.__controllers.forEach(c => {
    if (typeof targetParams[c.property] === 'number') {
      const min = c.__min;
      const max = c.__max * randomDamping;
      targetParams[c.property] = random(min, max);
      c.updateDisplay();
    }
  });
}

function randomize() {
  randomizeParams(params, gui.__folders['Kaleidoscope']);
  randomizeParams(params, gui.__folders['Distortion']);
  randomizeParams(params, gui.__folders['Chromatic Effect']);
  randomizeParams(params, gui.__folders['Spiral Effect']);
  randomizeParams(glitchParams, gui.__folders['Glitch Effect']);
}

function disableGlitch() {
  glitchParams.strength = 0.0;
  glitchParams.chunkSize = 1.0;
  glitchParams.speed = 0.0;
  glitchParams.chance = 0.0;
  for (let f of gui.__folders['Glitch Effect'].__controllers) f.updateDisplay();
}

function savePreset() {
  const data = {
    kaleido: params,
    glitch: glitchParams
  };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'kaleido-preset.json';
  a.click();
  URL.revokeObjectURL(url);
}

function loadPreset() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.kaleido) Object.assign(params, json.kaleido);
        if (json.glitch) Object.assign(glitchParams, json.glitch);

        for (const folderName of ['Kaleidoscope', 'Glitch Effect']) {
          const folder = gui.__folders[folderName];
          if (folder) folder.__controllers.forEach(ctrl => ctrl.updateDisplay());
        }
      } catch (err) {
        console.error('Failed to load preset:', err);
      }
    };
    reader.readAsText(file);
  };

  input.click();
}

function draw() {
  kaleidoBuffer.shader(kaleidoShader);
  kaleidoShader.setUniform('u_resolution', [width, height]);
  kaleidoShader.setUniform('u_time', millis() / 1000.0);
  kaleidoShader.setUniform('u_tileCount', params.tileCount);
  kaleidoShader.setUniform('u_squareSize', params.squareSize);
  kaleidoShader.setUniform('u_thickness', params.thickness);
  kaleidoShader.setUniform('u_kaleidoSides', params.kaleidoSides);
  kaleidoShader.setUniform('u_distortionAmp', params.distortionAmp);
  kaleidoShader.setUniform('u_distortionFreq', params.distortionFreq);
  kaleidoShader.setUniform('u_chromaOffset', params.chromaOffset);
  kaleidoShader.setUniform('u_chromaBlur', params.chromaBlur);
  kaleidoShader.setUniform('u_glowStrength', params.glowStrength);
  kaleidoShader.setUniform('u_glowSteps', params.glowSteps);
  kaleidoShader.setUniform('u_spiralStrength', params.spiralStrength);
  kaleidoShader.setUniform('u_spiralSpeed', params.spiralSpeed);
  kaleidoShader.setUniform('u_speed', params.speed);

  kaleidoBuffer.quad(-1, -1, 1, -1, 1, 1, -1, 1);

  shader(glitchShader);
  glitchShader.setUniform('u_texture', kaleidoBuffer);
  glitchShader.setUniform('u_resolution', [width, height]);
  glitchShader.setUniform('u_time', millis() / 1000.0);
  glitchShader.setUniform('u_glitchStrength', glitchParams.strength);
  glitchShader.setUniform('u_chunkSize', glitchParams.chunkSize / height);
  glitchShader.setUniform('u_glitchSpeed', glitchParams.speed);
  glitchShader.setUniform('u_glitchChance', glitchParams.chance);

  beginShape();
  texture(kaleidoBuffer);
  vertex(-width / 2, -height / 2, 0, 0);
  vertex(width / 2, -height / 2, 1, 0);
  vertex(width / 2, height / 2, 1, 1);
  vertex(-width / 2, height / 2, 0, 1);
  endShape(CLOSE);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  kaleidoBuffer.resizeCanvas(windowWidth, windowHeight);
}

// === SHADERS ===

const vertSrc = `
attribute vec3 aPosition;
varying vec2 vUv;
void main() {
  // Convert clip-space coordinates to normalized [0, 1] UVs
  vUv = aPosition.xy * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 1.0);
}`;

const fragSrc = `
#ifdef GL_ES
precision mediump float;
#endif

// Uniforms (external inputs)
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_tileCount, u_squareSize, u_thickness;
uniform float u_kaleidoSides, u_distortionAmp, u_distortionFreq;
uniform float u_chromaOffset, u_chromaBlur, u_glowStrength, u_glowSteps;
uniform float u_speed, u_spiralStrength, u_spiralSpeed;

// Varying from vertex shader
varying vec2 vUv;

// Create a square outline centered at 0.5,0.5 of given size
float square(vec2 uv, float size) {
  vec2 d = abs(uv - 0.5);
  return step(max(d.x, d.y), size);
}

// Apply kaleidoscope symmetry transformation
vec2 kaleido(vec2 uv, float sides) {
  uv -= 0.5;
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = mod(angle, 6.28318 / sides);
  angle = abs(angle - 3.14159 / sides);
  return vec2(cos(angle), sin(angle)) * radius + 0.5;
}

// Add refraction-like distortion using sin/cos waves
vec2 refractDistort(vec2 uv, float time, float offset) {
  float freq = u_distortionFreq;
  float amp = u_distortionAmp;
  uv.x += sin(uv.y * freq + time * 2.0 + offset) * amp;
  uv.y += cos(uv.x * freq - time * 2.0 + offset) * amp;
  return uv;
}

// Apply spiral vortex warp effect based on time and radius
vec2 spiralWarp(vec2 uv, float time) {
  vec2 centered = uv - 0.5;
  float r = length(centered);
  float normR = r / 0.7071; // Normalize max radius to 1
  float angle = atan(centered.y, centered.x);
  angle += normR * u_spiralStrength * time * u_spiralSpeed;
  return vec2(cos(angle), sin(angle)) * r + 0.5;
}

// Render one channel of the pattern with given chroma offset
float renderPattern(vec2 uv, float offset) {
  float time = u_time * u_speed;

  // Correct for aspect ratio
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  uv += 0.5;

  // Apply spiral effect
  uv = spiralWarp(uv, time);

  // Kaleidoscope and distortion
  uv = kaleido(uv, u_kaleidoSides);
  uv = refractDistort(uv, time, offset);
  uv = fract(uv * u_tileCount);

  // Square border pattern
  float outer = square(uv, u_squareSize);
  float inner = square(uv, u_squareSize - u_thickness);
  return outer - inner;
}

// Apply RGB chromatic aberration with horizontal blur
vec3 chromaBlur(vec2 uv) {
  float blurRadius = u_chromaBlur * 0.01;
  vec3 col = vec3(0.0);
  float total = 0.0;

  for (int i = -2; i <= 2; i++) {
    float offset = float(i) * blurRadius;
    float weight = 1.0 - abs(float(i)) * 0.2;
    col.r += renderPattern(uv + vec2(offset + u_chromaOffset, 0.0), u_chromaOffset) * weight;
    col.g += renderPattern(uv + vec2(offset, 0.0), 0.0) * weight;
    col.b += renderPattern(uv + vec2(offset - u_chromaOffset, 0.0), -u_chromaOffset) * weight;
    total += weight;
  }

  return col / total;
}

// Calculate glow by sampling around the current point
#define MAX_GLOW_STEPS 32

float glowAround(vec2 uv) {
  float glow = 0.0;
  float radius = u_glowStrength * 0.01;

  // Manually clamp glow steps between 1 and MAX_GLOW_STEPS
  int steps = int(min(max(u_glowSteps, 1.0), float(MAX_GLOW_STEPS)));

  for (int i = 0; i < MAX_GLOW_STEPS; i++) {
    if (i >= steps) break;
    float angle = float(i) * 6.28318 / float(steps);
    vec2 offset = vec2(cos(angle), sin(angle)) * radius;
    glow += renderPattern(uv + offset, 0.0);
  }

  return glow / float(steps);
}

void main() {
  // Apply chromatic aberration with blur
  vec3 color = chromaBlur(vUv);

  // Add radial glow effect
  float glow = glowAround(vUv);
  color += vec3(glow) * u_glowStrength;

  gl_FragColor = vec4(color, 1.0);
}`;

const glitchFragSrc = `
#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_glitchStrength;
uniform float u_chunkSize;       // in normalized [0.0, 1.0]
uniform float u_glitchSpeed;
uniform float u_glitchChance;

varying vec2 vUv;

// Generate a pseudo-random value from Y coordinate
float rand(float y) {
  return fract(sin(y * 43758.5453 + u_time * u_glitchSpeed) * 12345.6789);
}

void main() {
  float chunkIndex = floor(vUv.y / u_chunkSize);
  float shouldGlitch = step(1.0 - u_glitchChance, rand(chunkIndex));
  float offset = (rand(chunkIndex + 1.0) * 2.0 - 1.0) * u_glitchStrength * shouldGlitch;

  vec2 uv = vUv;
  uv.x += offset;

  gl_FragColor = texture2D(u_texture, uv);
}`;