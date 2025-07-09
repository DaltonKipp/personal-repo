let kaleidoShader; // Holds the custom shader

let params = {
  tileCount: 16.0,     // Number of times to tile the square pattern
  squareSize: 0.4,     // Size of the square in each tile
  thickness: 0.18,     // Thickness of the square border
  kaleidoSides: 12.0,  // Number of angular kaleidoscope slices
  distortionAmp: 0.09, // Refraction wobble strength
  chromaOffset: 0.05,  // Chromatic Aberration
  chromaBlur: 1.5,     // Chromatic Blur
  glowStrength: 0.4    // Edge Glow
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
  const gui = new dat.GUI();
  gui.add(params, 'tileCount', 1, 20).step(0.1).name('Tile Count');
  gui.add(params, 'squareSize', 0.05, 0.5).step(0.01).name('Square Size');
  gui.add(params, 'thickness', 0.001, 0.2).step(0.001).name('Border Thickness');
  gui.add(params, 'kaleidoSides', 1, 16).step(1).name('Kaleido Sides');
  gui.add(params, 'distortionAmp', 0.0, 0.1).step(0.001).name('Distortion Amp');
  gui.add(params, 'chromaOffset', 0.0, 0.1).step(0.001).name('Chroma Offset');
  gui.add(params, 'chromaBlur', 0.0, 5.0).step(0.1).name('Chroma Blur');
  gui.add(params, 'glowStrength', 0.0, 1.0).step(0.01).name('Edge Glow');
}

function draw() {
  // Send updated uniforms to the shader
  kaleidoShader.setUniform('u_resolution', [width, height]);
  kaleidoShader.setUniform('u_time', millis() / 2000.0);
  kaleidoShader.setUniform('u_tileCount', params.tileCount);
  kaleidoShader.setUniform('u_squareSize', params.squareSize);
  kaleidoShader.setUniform('u_thickness', params.thickness);
  kaleidoShader.setUniform('u_kaleidoSides', params.kaleidoSides);
  kaleidoShader.setUniform('u_distortionAmp', params.distortionAmp);
  kaleidoShader.setUniform('u_chromaOffset', params.chromaOffset);
  kaleidoShader.setUniform('u_chromaBlur', params.chromaBlur);
  kaleidoShader.setUniform('u_glowStrength', params.glowStrength);

  // Draw a fullscreen quad in clip-space (-1 to 1) to run the shader across every pixel
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
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
}
`;

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
  // Fix aspect ratio
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  uv += 0.5;

  uv = kaleido(uv, u_kaleidoSides);
  uv = refractDistort(uv, u_time, offset);
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