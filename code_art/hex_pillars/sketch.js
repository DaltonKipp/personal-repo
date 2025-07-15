// ===== GLOBALS =====
let shaderProgram;
let gui, params;
let hexGeom;

let rotationX = -30
let rotationY = 30
let isDragging = false;
let lastMouseX, lastMouseY;
let guiDragging = false;
let rotationXController, rotationYController;

// ===== SETUP =====
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  shaderProgram = createShader(vertSrc, fragSrc);
  setupGUI();
  hexGeom = createHexPrismModel(15, 60, 6);
}

// Resize Window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// ===== DRAW LOOP =====
function draw() {
  background(10);
  shader(shaderProgram);

  shaderProgram.setUniform("uTime", millis() / 1000);
  shaderProgram.setUniform("uMaxHeight", params.maxHeight);
  shaderProgram.setUniform("uSpeed", params.speed);
  shaderProgram.setUniform("uNoiseIntensity", params.noiseIntensity);
  shaderProgram.setUniform("uColor1", params.color1.map(c => c / 255));
  shaderProgram.setUniform("uColor2", params.color2.map(c => c / 255));

  push();
  rotateX(radians(rotationX));
  rotateY(radians(rotationY));

  let rowSpacing = params.spacing * 0.866;

  for (let row = -params.gridSize; row <= params.gridSize; row++) {
    for (let col = -params.gridSize; col <= params.gridSize; col++) {
      let xOffset = (row % 2 === 0) ? 0 : params.spacing / 2;
      let x = col * params.spacing + xOffset;
      let z = row * rowSpacing;

      // Shaded pillar
      shaderProgram.setUniform("uGridOffset", [x, z]);
      model(hexGeom);

      // Outline (after shaded draw)
      if (params.showEdges) {
        resetShader(); // Use default shader for outlines
        noFill();
        stroke(255, 100);
        strokeWeight(1.2);

        push();
        // Position the wireframe pillar in the same place as the shaded one
        translate(x, 0, z);
        model(hexGeom);
        pop();

        shader(shaderProgram); // Re-activate shader for next pillar
      }
    }
  }

  pop();
}

// ===== GUI SETUP =====
function setupGUI() {
  params = {
    gridSize: 50,
    spacing: 30,
    maxHeight: 100,
    speed: 2.0,
    noiseIntensity: 3.5,
    color1: [0, 50, 75],
    color2: [255, 125, 177],
    rotationX: rotationX,
    rotationY: rotationY,
    showEdges: false
  };

  gui = new dat.GUI();
  gui.add(params, "gridSize", 1, 50, 1);
  gui.add(params, "spacing", 20, 80, 1);
  gui.add(params, "maxHeight", 0, 100, 1);
  gui.add(params, "speed", 0.1, 5.0, 0.1);
  gui.add(params, "noiseIntensity", 0.0, 10.0, 0.05);
  gui.addColor(params, "color1");
  gui.addColor(params, "color2");
  gui.add(params, "showEdges");

  rotationXController = gui.add(params, "rotationX", -90, 90, 1).onChange(val => rotationX = val);
  rotationYController = gui.add(params, "rotationY", -180, 180, 1).onChange(val => rotationY = val);

  const guiContainer = document.querySelector('.dg.ac');
  guiContainer.addEventListener('mouseenter', () => guiDragging = true);
  guiContainer.addEventListener('mouseleave', () => guiDragging = false);
}

// ===== MOUSE INTERACTION =====
function mousePressed() {
  if (!guiDragging) {
    isDragging = true;
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

function mouseReleased() {
  isDragging = false;
}

function mouseDragged() {
  if (isDragging) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;
    rotationY += dx * 0.5;
    rotationX += dy * 0.5;
    rotationX = constrain(rotationX, -90, 90);
    params.rotationX = rotationX;
    params.rotationY = rotationY;
    rotationXController.updateDisplay();
    rotationYController.updateDisplay();
    lastMouseX = mouseX;
    lastMouseY = mouseY;
  }
}

// ===== HEX PRISM GENERATION =====
function createHexPrismModel(radius, height, sides) {
  const g = new p5.Geometry();
  let angleStep = TWO_PI / sides;

  let topVerts = [], bottomVerts = [];
  for (let i = 0; i < sides; i++) {
    let angle = i * angleStep;
    let x = cos(angle) * radius;
    let z = sin(angle) * radius;
    topVerts.push([x, height / 2, z]);
    bottomVerts.push([x, -height / 2, z]);
  }

  let topCenter = [0, height / 2, 0];
  let bottomCenter = [0, -height / 2, 0];
  let faces = [];

  for (let i = 0; i < sides; i++) {
    let next = (i + 1) % sides;
    faces.push([topVerts[i], bottomVerts[i], bottomVerts[next]]);
    faces.push([topVerts[i], bottomVerts[next], topVerts[next]]);
    faces.push([topCenter, topVerts[i], topVerts[next]]);
    faces.push([bottomCenter, bottomVerts[next], bottomVerts[i]]);
  }

  for (let tri of faces) {
    for (let v of tri) {
      g.vertices.push(createVector(...v));
    }
  }

  return g;
}

// ===== GLSL SHADERS (INLINE) =====
const vertSrc = `
  precision mediump float;

  attribute vec3 aPosition;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  uniform float uTime;
  uniform float uMaxHeight;
  uniform float uSpeed;
  uniform float uNoiseIntensity;
  uniform vec2 uGridOffset;

  varying float vHeight;

  // Perlin Noise (2D)
  vec2 fade(vec2 t) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = fade(f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  void main() {
    vec2 noiseInput = uGridOffset * 0.05 + uTime * uSpeed * 0.1;
    float n = noise(noiseInput);
    float stretch = 0.75 + n * (uMaxHeight / 100.0) * uNoiseIntensity;
    vHeight = stretch;

    vec3 scaled = vec3(aPosition.x, aPosition.y * stretch, aPosition.z);
    scaled.xz += uGridOffset;

    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(scaled, 1.0);
  }`;

const fragSrc = `
  precision mediump float;

  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying float vHeight;

  void main() {
    float mixFactor = 0.5 + 0.5 * sin(vHeight * 3.0);
    vec3 color = mix(uColor1, uColor2, mixFactor);
    gl_FragColor = vec4(color, 1.0);
  }`;