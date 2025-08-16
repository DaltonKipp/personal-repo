import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Horizontal chunk-shift glitch
export function GlitchPass(params) {
  const shader = {
    uniforms: {
      tDiffuse:     { value: null },
      u_resolution: { value: new THREE.Vector2(1,1) },
      u_time:       { value: 0 },
      u_glitchStrength: { value: params.strength },
      u_chunkSize:      { value: params.chunkSize }, // in pixels
      u_glitchSpeed:    { value: params.glitchSpeed },
      u_glitchChance:   { value: params.chance },
    },
    vertexShader:`
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position,1.0); }
    `,
    fragmentShader:`
      precision mediump float;
      uniform sampler2D tDiffuse;
      uniform vec2  u_resolution;
      uniform float u_time;
      uniform float u_glitchStrength;
      uniform float u_chunkSize;   // pixels
      uniform float u_glitchSpeed;
      uniform float u_glitchChance;
      varying vec2 vUv;

      float rand(float y){
        return fract(sin(y*43758.5453 + u_time * u_glitchSpeed) * 12345.6789);
      }

      void main(){
        float chunkNorm = u_chunkSize / u_resolution.y;
        float idx = floor(vUv.y / chunkNorm);

        float g = step(1.0 - u_glitchChance, rand(idx));
        float off = (rand(idx + 1.0) * 2.0 - 1.0) * u_glitchStrength * g;

        vec2 uv = vUv;
        uv.x += off; // shift this row
        gl_FragColor = texture2D(tDiffuse, uv);
      }`
  };

  const pass = new ShaderPass(shader);
  pass.name = 'GlitchPass';

  const u = pass.material.uniforms;
  pass.onBeforeRender = () => {
    u.u_resolution.value.set(window.innerWidth, window.innerHeight);
    u.u_glitchStrength.value = params.strength;
    u.u_chunkSize.value      = Math.max(1, params.chunkSize);
    u.u_glitchSpeed.value    = params.glitchSpeed;
    u.u_glitchChance.value   = params.chance;
  };

  return pass;
}
