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
const chromaOffsetMin = 0.0;
const chromaOffsetMax = 0.5;
const chromaBlurMin = 0.0;
const chromaBlurMax = 5.0;
const glowStrengthMin = 0.0;
const glowStrengthMax = 5.0;
const speedMin = 0.0;
const speedMax = 2.0;
const spiralStrengthMin = 0.0;
const spiralStrengthMax = 0.5;
const spiralSpeedMin = 0.0;
const spiralSpeedMax = 1.0;
const randomDamping = 0.75;
const glitchStrengthMin = 0.0;
const glitchStrengthMax = 0.2;
const glitchChunkSizeMin = 1;
const glitchChunkSizeMax = 100;
const glitchSpeedMin = 0.0;
const glitchSpeedMax = 10;
const glitchChanceMin = 0.0;
const glitchChanceMax = 1.0;

let params = {
  tileCount: 10.0,
  squareSize: 0.30,
  thickness: 0.15,
  kaleidoSides: 16.0,
  distortionAmp: 0.05,
  chromaOffset: 0.1,
  chromaBlur: 0.1,
  glowStrength: 0.1,
  speed: 1.0,
  spiralStrength: 0.5,
  spiralSpeed: 0.5
};

let glitchParams = {
  strength: 0.05,
  chunkSize: 20.0,
  speed: 2.0,
  chance: 0.3
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
  kaleidoFolder.add(params, 'distortionAmp', distortionAmpMin, distortionAmpMax).step(0.01).name('Distortion');
  kaleidoFolder.add(params, 'chromaOffset', chromaOffsetMin, chromaOffsetMax).step(0.01).name('Chroma Offset');
  kaleidoFolder.add(params, 'chromaBlur', chromaBlurMin, chromaBlurMax).step(0.01).name('Chroma Blur');
  kaleidoFolder.add(params, 'glowStrength', glowStrengthMin, glowStrengthMax).step(0.01).name('Glow');
  kaleidoFolder.add(params, 'speed', speedMin, speedMax).step(0.01).name('Speed');
  kaleidoFolder.add(params, 'spiralStrength', spiralStrengthMin, spiralStrengthMax).step(0.01).name('Spiral Strength');
  kaleidoFolder.add(params, 'spiralSpeed', spiralSpeedMin, spiralSpeedMax).step(0.01).name('Spiral Speed');

  const glitchFolder = gui.addFolder('Glitch Effect');
  glitchFolder.add(glitchParams, 'strength', glitchStrengthMin, glitchStrengthMax).step(0.01).name('Glitch Strength');
  glitchFolder.add(glitchParams, 'chunkSize', glitchChunkSizeMin, glitchChunkSizeMax).step(1).name('Chunk Size');
  glitchFolder.add(glitchParams, 'speed', glitchSpeedMin, glitchSpeedMax).step(0.1).name('Glitch Speed');
  glitchFolder.add(glitchParams, 'chance', glitchChanceMin, glitchChanceMax).step(0.01).name('Glitch Chance');
  glitchFolder.add({ disableGlitch }, 'disableGlitch').name('Disable Glitch');

  gui.add({ randomize }, 'randomize').name('Randomize Parameters');
  gui.add({ savePreset }, 'savePreset').name('Save Preset');
  gui.add({ loadPreset }, 'loadPreset').name('Load Preset');
}

function disableGlitch() {
  glitchParams.strength = 0.0;
  glitchParams.chunkSize = 1.0;
  glitchParams.speed = 0.0;
  glitchParams.chance = 0.0;
  for (let f of gui.__folders['Glitch Effect'].__controllers) f.updateDisplay();
}

function randomize() {
  for (let key in params) {
    if (typeof params[key] === 'number') {
      let c = gui.__folders['Kaleidoscope'].__controllers.find(c => c.property === key);
      if (c) {
        let min = c.__min, max = c.__max;
        params[key] = random(min, max);
        c.updateDisplay();
      }
    }
  }
  for (let key in glitchParams) {
    if (typeof glitchParams[key] === 'number') {
      let c = gui.__folders['Glitch Effect'].__controllers.find(c => c.property === key);
      if (c) {
        let min = c.__min, max = c.__max;
        glitchParams[key] = random(min, max);
        c.updateDisplay();
      }
    }
  }
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

        // Update all GUI sliders to reflect loaded values
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
  kaleidoShader.setUniform('u_chromaOffset', params.chromaOffset);
  kaleidoShader.setUniform('u_chromaBlur', params.chromaBlur);
  kaleidoShader.setUniform('u_glowStrength', params.glowStrength);
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
  vUv = aPosition.xy * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 1.0);
}`;

const fragSrc = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_tileCount, u_squareSize, u_thickness;
uniform float u_kaleidoSides, u_distortionAmp;
uniform float u_chromaOffset, u_chromaBlur, u_glowStrength;
uniform float u_speed, u_spiralStrength, u_spiralSpeed;
varying vec2 vUv;

float square(vec2 uv, float size) {
  vec2 d = abs(uv - 0.5);
  return step(max(d.x, d.y), size);
}

vec2 kaleido(vec2 uv, float sides) {
  uv -= 0.5;
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = mod(angle, 6.28318 / sides);
  angle = abs(angle - 3.14159 / sides);
  return vec2(cos(angle), sin(angle)) * radius + 0.5;
}

vec2 refractDistort(vec2 uv, float time, float offset) {
  float freq = 5.0;
  float amp = u_distortionAmp;
  uv.x += sin(uv.y * freq + time * 2.0 + offset) * amp;
  uv.y += cos(uv.x * freq - time * 2.0 + offset) * amp;
  return uv;
}

float renderPattern(vec2 uv, float offset, float blurAmount) {
  float time = u_time * u_speed;
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  uv += 0.5;

  vec2 centered = uv - 0.5;
  float r = length(centered);
  float normR = r / 0.7071;
  float angle = atan(centered.y, centered.x);
  angle += normR * u_spiralStrength * time * u_spiralSpeed;
  uv = vec2(cos(angle), sin(angle)) * r + 0.5;

  uv = kaleido(uv, u_kaleidoSides);
  uv = refractDistort(uv, time, offset);
  uv = fract(uv * u_tileCount);

  float outer = square(uv, u_squareSize + blurAmount);
  float inner = square(uv, u_squareSize - u_thickness - blurAmount);
  return outer - inner;
}

void main() {
  float blur = u_chromaBlur * 0.01;
  float r = renderPattern(vUv,  u_chromaOffset, blur);
  float g = renderPattern(vUv,  0.0,               blur * 0.5);
  float b = renderPattern(vUv, -u_chromaOffset,    blur);
  float glowCore = renderPattern(vUv, 0.0, 0.0);
  float glow = smoothstep(0.0, 1.0, glowCore) * u_glowStrength;
  vec3 color = vec3(r, g, b) + glow;
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

float rand(float y) {
  return fract(sin(y * 43758.5453 + u_time * u_glitchSpeed) * 12345.6789);
}

void main() {
  // Divide screen vertically into chunks based on chunkSize
  float chunkIndex = floor(vUv.y / u_chunkSize);
  
  // Determine if this chunk should glitch
  float shouldGlitch = step(1.0 - u_glitchChance, rand(chunkIndex));
  
  // Compute per-chunk horizontal offset
  float offset = (rand(chunkIndex + 1.0) * 2.0 - 1.0) * u_glitchStrength * shouldGlitch;

  vec2 uv = vUv;
  uv.x += offset;

  gl_FragColor = texture2D(u_texture, uv);
}`;