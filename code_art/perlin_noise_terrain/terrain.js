// GPU-Accelerated Terrain Generator with Shader Controls via dat.GUI

let terrainShader;
let params;
let isDragging = false;
let lastMouseX, lastMouseY;
let guiDragging = false; // flag for GUI interaction

// Inline GLSL vertex shader
const vertSrc = `
#ifdef GL_ES
precision mediump float;
#endif

attribute vec4 aPosition;
attribute vec2 aTexCoord;
varying vec2 vTexCoord;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  vTexCoord = aTexCoord;
  gl_Position = uProjectionMatrix * uModelViewMatrix * aPosition;
}
`;

// Inline GLSL fragment shader with fBm and adjustable thresholds
const fragSrc = `
#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vTexCoord;
uniform vec2 u_resolution;
uniform vec2 u_offset;
uniform float u_zoom;
uniform float u_time;
uniform float u_noiseScale;
uniform float u_timeScale;
uniform float u_octaves;
uniform float u_floorOffset;
uniform vec2 u_threshWater;
uniform vec2 u_threshSand;
uniform vec2 u_threshGrass;
uniform vec2 u_threshTrees;
uniform vec2 u_threshMountain;
uniform vec2 u_threshSnow;

// permutation hash
vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
  return -1.0 + 2.0 * fract(sin(p)*43758.5453123);
}

// single octave noise
float noise2D(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  float n00 = dot(hash(i), f);
  float n10 = dot(hash(i+vec2(1.0,0.0)), f-vec2(1.0,0.0));
  float n01 = dot(hash(i+vec2(0.0,1.0)), f-vec2(0.0,1.0));
  float n11 = dot(hash(i+vec2(1.0,1.0)), f-vec2(1.0,1.0));
  return mix(mix(n00,n10,u.x), mix(n01,n11,u.x), u.y);
}

// fractal Brownian motion
float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for(int i=0; i<10; i++) {
    if(i >= int(u_octaves)) break;
    sum += amp * noise2D(p * freq);
    freq *= 2.0;
    amp *= 0.5;
  }
  return sum;
}

// map to color
vec3 getColor(float v) {
  if (v < u_threshWater.x)        return mix(vec3(0.12,0.69,0.98), vec3(0.16,1.0,1.0), smoothstep(u_threshWater.x, u_threshWater.y, v));
  else if (v < u_threshSand.x)   return mix(vec3(0.84,0.75,0.62), vec3(1.0,0.96,0.76), smoothstep(u_threshSand.x, u_threshSand.y, v));
  else if (v < u_threshGrass.x)  return mix(vec3(0.01,0.65,0.61), vec3(0.46,0.93,0.49), smoothstep(u_threshGrass.x, u_threshGrass.y, v));
  else if (v < u_threshTrees.x)  return mix(vec3(0.09,0.71,0.55), vec3(0.04,0.57,0.44), smoothstep(u_threshTrees.x, u_threshTrees.y, v));
  else if (v < u_threshMountain.x) return mix(vec3(0.43,0.43,0.43), vec3(0.59,0.59,0.59), smoothstep(u_threshMountain.x, u_threshMountain.y, v));
  else                             return mix(vec3(0.59,0.59,0.59), vec3(1.0,1.0,1.0), smoothstep(u_threshSnow.x, u_threshSnow.y, v));
}

void main() {
  vec2 uv = vTexCoord;
  vec2 pos = (uv - 0.5) * u_resolution / u_zoom + u_offset;
  float v = fbm(pos * u_noiseScale + u_time * u_timeScale) + u_floorOffset;
  v = clamp(v, 0.0, 1.0);
  vec3 col = getColor(v);
  gl_FragColor = vec4(col, 1.0);
}
`;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();
  terrainShader = createShader(vertSrc, fragSrc);

  // default params
  params = {
    zoom: 1,
    noiseScale: 0.005,
    timeScale: 0.0001,
    octaves: 10,
    floorOffset: 0.075,    // raise/lower base terrain
    seed: () => { params.xOffset = random(0, 10000); params.yOffset = random(0, 10000); },
    xOffset: random(0, 10000),
    yOffset: random(0, 10000),
    terrain: {
      water:    { x: 0.001, y: 0.02 },
      sand:     { x: 0.02, y: 0.05 },
      grass:    { x: 0.05, y: 0.095 },
      trees:    { x: 0.095, y: 0.135 },
      mountain: { x: 0.135, y: 0.175 },
      snow:     { x: 0.175, y: 0.25 }
    }
  };

  // GUI
  const gui = new dat.GUI();
  gui.add(params, 'zoom', 0.1, 5, 0.1);
  gui.add(params, 'noiseScale', 0.001, 0.02, 0.0005);
  gui.add(params, 'timeScale', 0, 0.1, 0.01);
  gui.add(params, 'octaves', 1, 10, 1);
  gui.add(params, 'floorOffset', -0.5, 0.5, 0.001).name('Elevation Offset');
  gui.add(params, 'seed').name('Random Seed');

  const keys = ['water','sand','grass','trees','mountain','snow'];
  const tf = gui.addFolder('Thresholds');
  keys.forEach((key, i) => {
    const t = params.terrain[key];
    const prevMax = i > 0 ? params.terrain[keys[i-1]].y : 0;
    const nextMin = i < keys.length-1 ? params.terrain[keys[i+1]].x : 1;
    tf.add(t, 'x', 0, 1, 0.01)
      .name(key + ' min')
      .onChange(val => { t.x = constrain(val, prevMax + 0.01, t.y); });
    tf.add(t, 'y', 0, 1, 0.01)
      .name(key + ' max')
      .onChange(val => { t.y = constrain(val, t.x, nextMin - 0.01); });
  });

  // GUI interaction flags
  gui.domElement.addEventListener('mousedown', () => guiDragging = true);
  window.addEventListener('mouseup',() => guiDragging = false);
}

function draw() {
  // compute sorted thresholds
  const thresh = {};
  for (let key in params.terrain) {
    const t = params.terrain[key];
    thresh[key] = [t.x, t.y];
  }

  shader(terrainShader);
  terrainShader.setUniform('u_resolution', [width, height]);
  terrainShader.setUniform('u_offset', [params.xOffset, params.yOffset]);
  terrainShader.setUniform('u_zoom', params.zoom);
  terrainShader.setUniform('u_time', millis() * 0.001);
  terrainShader.setUniform('u_noiseScale', params.noiseScale);
  terrainShader.setUniform('u_timeScale', params.timeScale);
  terrainShader.setUniform('u_octaves', params.octaves);
  terrainShader.setUniform('u_floorOffset', params.floorOffset);
  terrainShader.setUniform('u_threshWater', thresh.water);
  terrainShader.setUniform('u_threshSand', thresh.sand);
  terrainShader.setUniform('u_threshGrass', thresh.grass);
  terrainShader.setUniform('u_threshTrees', thresh.trees);
  terrainShader.setUniform('u_threshMountain', thresh.mountain);
  terrainShader.setUniform('u_threshSnow', thresh.snow);
  plane(width, height);
}

function mousePressed() { isDragging = true; lastMouseX = mouseX; lastMouseY = mouseY; }
function mouseReleased() { isDragging = false; }
function mouseDragged() {
  if (guiDragging) return;
  if (isDragging) {
    params.xOffset -= (mouseX - lastMouseX) / params.zoom;
    params.yOffset -= (mouseY - lastMouseY) / params.zoom;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseWheel(event) { params.zoom = max(0.5, params.zoom - event.delta * 0.01); }
function windowResized() { resizeCanvas(windowWidth, windowHeight); }
