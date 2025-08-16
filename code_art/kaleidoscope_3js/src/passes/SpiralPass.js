import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Warps UVs with oscillating or compounding twist
export function SpiralPass(params) {
  const shader = {
    uniforms: {
      tDiffuse:      { value: null },
      u_resolution:  { value: new THREE.Vector2(1,1) },
      u_time:        { value: 0 },
      u_spiralStrength: { value: params.spiralStrength },
      u_spiralSpeed:    { value: params.spiralSpeed },
      u_spiralMode:     { value: params.spiralMode }, // 0/1
    },
    vertexShader:`
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader:`
      precision mediump float;
      uniform sampler2D tDiffuse;
      uniform vec2  u_resolution;
      uniform float u_time;
      uniform float u_spiralStrength, u_spiralSpeed, u_spiralMode;
      varying vec2 vUv;

      vec2 spiralWarp(vec2 uv, float time){
        vec2 c = uv - 0.5;
        float r = length(c);
        float normR = r / 0.7071;
        float a = atan(c.y, c.x);
        float twist = (u_spiralMode > 0.5)
          ? time * u_spiralSpeed
          : sin(time * u_spiralSpeed);
        a += normR * u_spiralStrength * twist;
        return vec2(cos(a), sin(a)) * r + 0.5;
      }

      void main() {
        float t = u_time;
        vec2 uv = vUv;

        // aspect preserve
        uv -= 0.5;
        uv.x *= u_resolution.x / u_resolution.y;
        uv += 0.5;

        uv = spiralWarp(uv, t);
        gl_FragColor = texture2D(tDiffuse, uv);
      }`
  };

  const pass = new ShaderPass(shader);
  pass.name = 'SpiralPass';

  const u = pass.material.uniforms;
  pass.onBeforeRender = () => {
    const { innerWidth:w, innerHeight:h } = window;
    u.u_resolution.value.set(w, h);
    u.u_spiralStrength.value = params.spiralStrength;
    u.u_spiralSpeed.value    = params.spiralSpeed;
    u.u_spiralMode.value     = params.spiralMode; // will be exactly 0 or 1 from GUI
  };

  return pass;
}
