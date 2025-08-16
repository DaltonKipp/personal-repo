import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export function BasePatternPass(params) {
  const shader = {
    uniforms: {
      tDiffuse:         { value: null }, // required by ShaderPass signature
      u_resolution:     { value: new THREE.Vector2(1,1) },
      u_time:           { value: 0 },
      u_tileCount:      { value: params.tileCount },
      u_squareSize:     { value: params.squareSize },
      u_thickness:      { value: params.thickness },
      u_kaleidoSides:   { value: params.kaleidoSides },
      u_distortionAmp:  { value: params.distortionAmp },
      u_distortionFreq: { value: params.distortionFreq },
      u_speed:          { value: params.speed },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */`
      precision mediump float;
      varying vec2 vUv;

      uniform vec2  u_resolution;
      uniform float u_time;
      uniform float u_tileCount, u_squareSize, u_thickness;
      uniform float u_kaleidoSides, u_distortionAmp, u_distortionFreq;
      uniform float u_speed;

      // centered square outline
      float square(vec2 uv, float size){
        vec2 d = abs(uv - 0.5);
        return step(max(d.x, d.y), size);
      }

      vec2 kaleido(vec2 uv, float sides){
        uv -= 0.5;
        float a = atan(uv.y, uv.x);
        float r = length(uv);
        a = mod(a, 6.2831853 / sides);
        a = abs(a - 3.14159265 / sides);
        return vec2(cos(a), sin(a))*r + 0.5;
      }

      vec2 refractDistort(vec2 uv, float time) {
        float f = u_distortionFreq;
        float amp = u_distortionAmp;
        uv.x += sin(uv.y * f + time * 2.0) * amp;
        uv.y += cos(uv.x * f - time * 2.0) * amp;
        return uv;
      }

      float renderPattern(vec2 uv) {
        float time = u_time * u_speed;

        // aspect fix
        uv -= 0.5;
        uv.x *= u_resolution.x / u_resolution.y;
        uv += 0.5;

        uv = kaleido(uv, u_kaleidoSides);
        uv = refractDistort(uv, time);

        uv = fract(uv * u_tileCount);

        float outer = square(uv, u_squareSize);
        float inner = square(uv, u_squareSize - u_thickness);
        return outer - inner;
      }

      void main() {
        float m = renderPattern(vUv);
        gl_FragColor = vec4(vec3(m), 1.0);
      }
    `
  };

  const pass = new ShaderPass(shader);
  pass.name = 'BasePatternPass';

  // bind params → uniforms (live updates)
  const u = pass.material.uniforms;
  pass.onBeforeRender = () => {
    const { innerWidth:w, innerHeight:h } = window;
    u.u_resolution.value.set(w, h);
    u.u_tileCount.value      = params.tileCount;
    u.u_squareSize.value     = params.squareSize;
    u.u_thickness.value      = params.thickness;
    u.u_kaleidoSides.value   = params.kaleidoSides;
    u.u_distortionAmp.value  = params.distortionAmp;
    u.u_distortionFreq.value = params.distortionFreq;
    u.u_speed.value          = params.speed;
  };

  return pass;
}
