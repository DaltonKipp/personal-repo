// Optimized Terrain Generator with dat.GUI and Offscreen Buffer

let terrainTypes = [];
let gui, params;

let zoomFactor = 200;
let mapChanged = true;
let xOffset = 100;
let yOffset = 100;
const cameraSpeed = 10;

let isDragging = false;
let lastMouseX, lastMouseY;

let terrainBuffer;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
  noSmooth(); // disable anti-aliasing
  initGUI();
  updateTerrainTypes();

  terrainBuffer = createGraphics(width, height);
  pixelDensity(params.pixelDensity);
  noiseDetail(params.octaves, params.falloff);
}

function draw() {
  handleMovement();

  if (mapChanged) {
    terrainBuffer.clear();
    terrainBuffer.noStroke();
    terrainBuffer.pixelDensity(1); // ensure buffer isn't high-DPI

    for (let x = 0; x < width; x += params.resolution) {
      for (let y = 0; y < height; y += params.resolution) {
        const xVal = (x - width / 2) / zoomFactor + xOffset;
        const yVal = (y - height / 2) / zoomFactor + yOffset;
        const noiseValue = noise(xVal, yVal);

        const terrainColor = getColorForNoise(noiseValue);
        terrainBuffer.fill(terrainColor);
        terrainBuffer.rect(x, y, params.resolution, params.resolution);
      }
    }

    mapChanged = false;
  }

  image(terrainBuffer, 0, 0);
}

function handleMovement() {
  if (keyIsDown(RIGHT_ARROW)) {
    xOffset += 1 / zoomFactor * cameraSpeed;
    mapChanged = true;
  }
  if (keyIsDown(LEFT_ARROW)) {
    xOffset -= 1 / zoomFactor * cameraSpeed;
    mapChanged = true;
  }
  if (keyIsDown(UP_ARROW)) {
    yOffset -= 1 / zoomFactor * cameraSpeed;
    mapChanged = true;
  }
  if (keyIsDown(DOWN_ARROW)) {
    yOffset += 1 / zoomFactor * cameraSpeed;
    mapChanged = true;
  }
}

function mouseWheel(event) {
  zoomFactor -= event.delta / 10;
  zoomFactor = max(10, zoomFactor);
  mapChanged = true;
}

function mousePressed() {
  isDragging = true;
  lastMouseX = mouseX;
  lastMouseY = mouseY;
  cursor('grabbing');
}

function mouseReleased() {
  isDragging = false;
  cursor('grab');
}

function mouseDragged() {
  if (isDragging) {
    let dx = mouseX - lastMouseX;
    let dy = mouseY - lastMouseY;

    xOffset -= dx / zoomFactor;
    yOffset -= dy / zoomFactor;

    lastMouseX = mouseX;
    lastMouseY = mouseY;

    mapChanged = true;
  }
}

class TerrainType {
  constructor(minHeight, maxHeight, minColor, maxColor, lerpAdjustment = 0) {
    this.minHeight = minHeight;
    this.maxHeight = maxHeight;
    this.minColor = minColor;
    this.maxColor = maxColor;
    this.lerpAdjustment = lerpAdjustment;
  }

  matches(value) {
    return value < this.maxHeight;
  }

  getColor(value) {
    const normalized = normalize(value, this.maxHeight, this.minHeight);
    return lerpColor(this.minColor, this.maxColor, constrain(normalized + this.lerpAdjustment, 0, 1));
  }
}

function getColorForNoise(value) {
  for (let terrain of terrainTypes) {
    if (terrain.matches(value)) {
      return terrain.getColor(value);
    }
  }
  return terrainTypes[terrainTypes.length - 1].getColor(value);
}

function normalize(value, max, min) {
  if (value > max) return 1;
  if (value < min) return 0;
  return (value - min) / (max - min);
}

function updateTerrainTypes() {
  terrainTypes = [
    new TerrainType(params.terrain.water.min,    params.terrain.water.max,    color(30, 176, 251), color(40, 255, 255), 0.1),
    new TerrainType(params.terrain.sand.min,     params.terrain.sand.max,     color(215, 192, 158), color(255, 246, 193), 0.2),
    new TerrainType(params.terrain.grass.min,    params.terrain.grass.max,    color(2, 166, 155), color(118, 239, 124), 0.1),
    new TerrainType(params.terrain.trees.min,    params.terrain.trees.max,    color(22, 181, 141), color(10, 145, 113), 0.2),
    new TerrainType(params.terrain.mountain.min, params.terrain.mountain.max, color(110, 110, 110), color(150, 150, 150), 0.5),
    new TerrainType(params.terrain.snow.min,     params.terrain.snow.max,     color(200, 200, 200), color(255, 255, 255))
  ];
  mapChanged = true;
}

const defaultTerrainThresholds = {
  water:    { min: 0.35, max: 0.45 },
  sand:     { min: 0.45, max: 0.50 },
  grass:    { min: 0.50, max: 0.65 },
  trees:    { min: 0.65, max: 0.75 },
  mountain: { min: 0.75, max: 0.80 },
  snow:     { min: 0.80, max: 0.95 }
};

function resetThresholds() {
  for (const key in defaultTerrainThresholds) {
    params.terrain[key].min = defaultTerrainThresholds[key].min;
    params.terrain[key].max = defaultTerrainThresholds[key].max;
  }

  // Update GUI display and terrain logic
  for (let controller of gui.__folders['Terrain Thresholds'].__controllers || []) {
    controller.updateDisplay();
  }
  for (let folder of Object.values(gui.__folders['Terrain Thresholds'].__folders)) {
    folder.__controllers.forEach(c => c.updateDisplay());
  }

  updateTerrainTypes();
}

function initGUI() {
  params = {
    resolution: 5,
    pixelDensity: 1,
    octaves: 8,
    falloff: 0.5,
    terrain: {
      water:    { min: 0.20, max: 0.45 },
      sand:     { min: 0.45, max: 0.50 },
      grass:    { min: 0.50, max: 0.65 },
      trees:    { min: 0.65, max: 0.75 },
      mountain: { min: 0.75, max: 0.85 },
      snow:     { min: 0.85, max: 0.99 }
    },
    regenerate: () => {
      pixelDensity(params.pixelDensity);
      noiseDetail(params.octaves, params.falloff);
      updateTerrainTypes();
      mapChanged = true;
    }
  };

  gui = new dat.GUI();
  gui.add(params, 'resolution', 1, 20, 1).onChange(() => mapChanged = true);
  gui.add(params, 'pixelDensity', 0.5, 2, 0.1).onChange(params.regenerate);
  gui.add(params, 'octaves', 1, 10, 1).onChange(params.regenerate);
  gui.add(params, 'falloff', 0, 1, 0.01).onChange(params.regenerate);
  gui.add(params, 'regenerate');

  const terrainFolder = gui.addFolder('Terrain Thresholds');
  const terrainKeys = Object.keys(params.terrain);

  terrainKeys.forEach((key, index) => {
    const tf = terrainFolder.addFolder(key);
    const t = params.terrain[key];

    tf.add(t, 'min', 0, 1, 0.01).onChange((val) => {
      const prevKey = terrainKeys[index - 1];
      const maxLimit = t.max - 0.01;
      const prevMax = prevKey ? params.terrain[prevKey].max : 0;
      t.min = constrain(val, prevMax + 0.01, maxLimit);
      updateTerrainTypes();
    });

    tf.add(t, 'max', 0, 1, 0.01).onChange((val) => {
      const nextKey = terrainKeys[index + 1];
      const minLimit = t.min + 0.01;
      const nextMin = nextKey ? params.terrain[nextKey].min : 1;
      t.max = constrain(val, minLimit, nextMin - 0.01);
      updateTerrainTypes();
    });
  });

  terrainFolder.add({ reset: resetThresholds }, 'reset').name('Reset Thresholds');
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  terrainBuffer = createGraphics(width, height);
  mapChanged = true;
}