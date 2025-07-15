let kaleidoShader; // Holds the custom shader

let capturer;
let isRecording = false;
let recordStartTime = 0;
let recordDuration = 0; // in seconds
let gui; // Declare GUI

// Minimum and Maximum Values
const tileCountMin      = 1;
const tileCountMax      = 20;
const squareSizeMin     = 0.05;
const squareSizeMax     = 0.5;
const thicknessMin      = 0.01;
const thicknessMax      = 0.5;
const kaleidoSidesMin   = 1;
const kaleidoSidesMax   = 32;
const distortionAmpMin  = 0.0;
const distortionAmpMax  = 0.5;
const chromaOffsetMin   = 0.0;
const chromaOffsetMax   = 0.2;
const chromaBlurMin     = 0.0;
const chromaBlurMax     = 5.0;
const glowStrengthMin   = 0.0;
const glowStrengthMax   = 5.0;
const speedMin          = 0.0;
const speedMax          = 2.0;
const spiralStrengthMin = 0.0;
const spiralStrengthMax = 0.5;
const spiralSpeedMin    = 0.0;
const spiralSpeedMax    = 1.0;

// Default Values
let params = {
  tileCount:      10.0, // Number of times to tile the square pattern
  squareSize:     0.30, // Size of the square in each tile
  thickness:      0.15, // Thickness of the square border
  kaleidoSides:   16.0, // Number of angular kaleidoscope slices
  distortionAmp:  0.05, // Refraction wobble strength
  chromaOffset:   0.1,  // Chromatic Aberration
  chromaBlur:     0.1,  // Chromatic Blur
  glowStrength:   0.1,  // Edge Glow
  speed:          1.0,  // Animation Speed
  spiralStrength: 0.5,  // Spiral Strength
  spiralSpeed:    0.5   // Spiral Speed
};

function preload() {
  // Load the shader from inline GLSL source (below)
  kaleidoShader = new p5.Shader(this.renderer, vertSrc, fragSrc);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // Fullscreen WebGL canvas
  noStroke();
  shader(kaleidoShader); // Apply the custom shader

  // Create dat.GUI sliders for the parameters
  gui = new dat.GUI();
  gui.add(params, 'tileCount', tileCountMin, tileCountMax).step(1.0).name('Tile Count');
  gui.add(params, 'squareSize', squareSizeMin, squareSizeMax).step(0.01).name('Square Size');
  gui.add(params, 'thickness', thicknessMin, thicknessMax).step(0.01).name('Border Thickness');
  gui.add(params, 'kaleidoSides', kaleidoSidesMin, kaleidoSidesMax).step(1).name('Kaleido Sides');
  gui.add(params, 'distortionAmp', distortionAmpMin, distortionAmpMax).step(0.01).name('Distortion Amp');
  gui.add(params, 'chromaOffset', chromaOffsetMin, chromaOffsetMax).step(0.01).name('Chroma Offset');
  gui.add(params, 'chromaBlur', chromaBlurMin, chromaBlurMax).step(0.01).name('Chroma Blur');
  gui.add(params, 'glowStrength', glowStrengthMin, glowStrengthMax).step(0.01).name('Edge Glow');
  gui.add(params, 'speed', speedMin, speedMax).step(0.1).name('Speed');
  gui.add(params, 'spiralStrength', spiralStrengthMin, spiralStrengthMax).step(0.01).name('Spiral Strength');
  gui.add(params, 'spiralSpeed', spiralSpeedMin, spiralSpeedMax).step(0.01).name('Spiral Speed');
  gui.add({ randomizeParams }, 'randomizeParams').name('Randomize Settings');
  gui.add({ savePreset }, 'savePreset').name('Save Preset');
  gui.add({ loadPreset }, 'loadPreset').name('Load Preset');

  let captureParams = {
    duration: 5, // seconds
    startCapture: () => {
      capturer = new CCapture({ format: 'png', framerate: 30 });
      isRecording = true;
      recordStartTime = millis();
      recordDuration = captureParams.duration * 1000;
      capturer.start();
      console.log("Recording started...");
    }
  };
  gui.add(captureParams, 'duration', 1, 60).step(1).name('Capture Duration');
  gui.add(captureParams, 'startCapture').name('Start Recording');
}

function randomizeParams() {
  params.tileCount      = random(tileCountMin, tileCountMax);
  params.squareSize     = random(squareSizeMin, squareSizeMax);
  params.thickness      = random(thicknessMin, thicknessMax);
  params.kaleidoSides   = floor(random(kaleidoSidesMin, kaleidoSidesMax));
  params.distortionAmp  = random(distortionAmpMin, distortionAmpMax);
  params.chromaOffset   = random(chromaOffsetMin, chromaOffsetMax);
  params.chromaBlur     = random(chromaBlurMin, chromaBlurMax);
  params.glowStrength   = random(glowStrengthMin, glowStrengthMax);
  params.speed          = random(speedMin, speedMax);
  params.spiralStrength = random(spiralStrengthMin, spiralStrengthMax);
  params.spiralSpeed    = random(spiralSpeedMin,spiralSpeedMax)

  // Force dat.GUI to update displayed slider values
  for (let controller of gui.__controllers) {
    controller.updateDisplay();
  }
}

function savePreset() {
  const blob = new Blob([JSON.stringify(params, null, 2)], {
    type: 'application/json'
  });
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
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const loaded = JSON.parse(event.target.result);
        // Update each parameter if it's defined in the file
        for (let key in loaded) {
          if (params.hasOwnProperty(key)) {
            params[key] = loaded[key];
          }
        }
        // Update all GUI sliders to match loaded values
        for (let controller of gui.__controllers) {
          controller.updateDisplay();
        }
        console.log("Preset loaded!");
      } catch (err) {
        console.error("Error loading preset:", err);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function draw() {
  // Send updated uniforms to the shader
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

  // Draw a fullscreen quad in clip-space (-1 to 1) to run the shader across every pixel
  quad(-1, -1, 1, -1, 1, 1, -1, 1);

  // CCapture: record frame
  if (isRecording) {
    capturer.capture(document.querySelector('canvas'));
    if (millis() - recordStartTime >= recordDuration) {
      isRecording = false;
      capturer.stop();
      capturer.save();
      console.log("🎬 Recording complete.");
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// GLSL Vertex Shader (just passes vertex position to the fragment shader)
const vertSrc = `
attribute vec3 aPosition;
varying vec2 vUv;
void main() {
  // Convert clip-space [-1,1] position to UV [0,1]
  vUv = aPosition.xy * 0.5 + 0.5;
  // Output clip-space position to rasterizer
  gl_Position = vec4(aPosition, 1.0);
}`;

// GLSL Fragment Shader (does the actual kaleidoscope rendering)
const fragSrc = `
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

uniform float u_tileCount;
uniform float u_squareSize;
uniform float u_thickness;
uniform float u_kaleidoSides;
uniform float u_distortionAmp;
uniform float u_chromaOffset;
uniform float u_chromaBlur;
uniform float u_glowStrength;
uniform float u_speed;
uniform float u_spiralStrength;
uniform float u_spiralSpeed;

varying vec2 vUv;

// Square pattern
float square(vec2 uv, float size) {
  vec2 d = abs(uv - 0.5);
  return step(max(d.x, d.y), size);
}

// Kaleidoscope transformation
vec2 kaleido(vec2 uv, float sides) {
  uv -= 0.5;
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = mod(angle, 6.28318 / sides);
  angle = abs(angle - 3.14159 / sides);
  return vec2(cos(angle), sin(angle)) * radius + 0.5;
}

// Refraction distortion
vec2 refractDistort(vec2 uv, float time, float offset) {
  float freq = 5.0;
  float amp = u_distortionAmp;
  uv.x += sin(uv.y * freq + time * 2.0 + offset) * amp;
  uv.y += cos(uv.x * freq - time * 2.0 + offset) * amp;
  return uv;
}

// Render function with glow falloff
float renderPattern(vec2 uv, float offset, float blurAmount) {

  float time = u_time * u_speed;

  // Fix aspect ratio
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  uv += 0.5;
  
  // --- Spiral distortion ---
  vec2 centered = uv - 0.5;
  float r = length(centered);
  float normR = r / 0.7071; // normalize radius (max ~sqrt(0.5^2 + 0.5^2))
  float angle = atan(centered.y, centered.x);
  angle += normR * u_spiralStrength * time * u_spiralSpeed;

  uv = vec2(cos(angle), sin(angle)) * r + 0.5;

  // Kaleidoscope and distortion
  uv = kaleido(uv, u_kaleidoSides);
  uv = refractDistort(uv, time, offset);

  // Tiling
  uv = fract(uv * u_tileCount);

  float outer = square(uv, u_squareSize + blurAmount);
  float inner = square(uv, u_squareSize - u_thickness - blurAmount);
  return outer - inner;
}

void main() {
  float blur = u_chromaBlur * 0.01; // scale blur to shader space

  // Each channel gets slight blur + offset
  float r = renderPattern(vUv,  u_chromaOffset, blur);
  float g = renderPattern(vUv,  0.0,               blur * 0.5);
  float b = renderPattern(vUv, -u_chromaOffset,    blur);

  // Basic glow based on sharp center pattern
  float glowCore = renderPattern(vUv, 0.0, 0.0);
  float glow = smoothstep(0.0, 1.0, glowCore) * u_glowStrength;

  // Compose final color
  vec3 color = vec3(r, g, b) + glow;

  gl_FragColor = vec4(color, 1.0);
}`;