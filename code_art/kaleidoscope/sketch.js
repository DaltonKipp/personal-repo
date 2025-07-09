let kaleidoShader; // Holds the custom shader

let params = {
  tileCount: 16.0,       // Number of times to tile the square pattern
  squareSize: 0.4,      // Size of the square in each tile
  thickness: 0.18,      // Thickness of the square border
  kaleidoSides: 12.0,    // Number of angular kaleidoscope slices
  distortionAmp: 0.09  // Refraction wobble strength
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

  // Draw a fullscreen quad in clip-space (-1 to 1) to run the shader across every pixel
  quad(-1, -1, 1, -1, 1, 1, -1, 1);
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

// Inputs
uniform vec2 u_resolution;
uniform float u_time;

uniform float u_tileCount;     // how many tiles across screen
uniform float u_squareSize;    // size of each square
uniform float u_thickness;     // border thickness
uniform float u_kaleidoSides;  // number of symmetry wedges
uniform float u_distortionAmp; // refraction amplitude

varying vec2 vUv;

// Square pattern: returns 1.0 inside the square, 0.0 outside
float square(vec2 uv, float size) {
  vec2 d = abs(uv - 0.5); // distance from center
  return step(max(d.x, d.y), size);
}

// Kaleidoscope transformation using polar angle mirroring
vec2 kaleido(vec2 uv, float sides) {
  uv -= 0.5;
  float angle = atan(uv.y, uv.x);
  float radius = length(uv);
  angle = mod(angle, 6.28318 / sides); // 2π = 6.28318
  angle = abs(angle - 3.14159 / sides);
  return vec2(cos(angle), sin(angle)) * radius + 0.5;
}

// Refractive wave distortion (like wobbling glass)
vec2 refractDistort(vec2 uv, float time) {
  float freq = 5.0;
  float amp = u_distortionAmp;
  uv.x += sin(uv.y * freq + time * 2.0) * amp;
  uv.y += cos(uv.x * freq - time * 2.0) * amp;
  return uv;
}

void main() {
  vec2 uv = vUv;

  // Fix for non-square screens
  uv -= 0.5;
  uv.x *= u_resolution.x / u_resolution.y;
  uv += 0.5;

  // Apply kaleidoscope symmetry
  uv = kaleido(uv, u_kaleidoSides);

  // Apply refraction distortion
  uv = refractDistort(uv, u_time);

  // Tile the pattern multiple times
  uv = fract(uv * u_tileCount);

  // Create bordered square pattern (outline only)
  float outer = square(uv, u_squareSize);
  float inner = square(uv, u_squareSize - u_thickness);
  float border = outer - inner;

  // Color: black background, white border
  vec3 color = mix(vec3(0.0), vec3(1.0), border);

  gl_FragColor = vec4(color, 1.0);
}`;