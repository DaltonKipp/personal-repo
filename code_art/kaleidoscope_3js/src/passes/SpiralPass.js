import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export function SpiralPass(params) {
  const shader = {
    uniforms: {
      tDiffuse:       { value: null },
      u_resolution:   { value: new THREE.Vector2(1, 1) },
      u_time:         { value: 0.0 }, // updated from main loop
      u_strength:     { value: params.spiralStrength },   // 0..1-ish
      u_speed:        { value: params.spiralSpeed },      // Hz-ish
      u_mode:         { value: (params.spiralMode | 0) }, // 0 non-comp, 1 comp
      u_radius:       { value: params.spiralRadius },     // 0..1.5 normalized
      u_falloffExp:   { value: params.spiralFalloffExp }, // 0.2..4
    },
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position,1.0); }
    `,
    fragmentShader: `
      precision mediump float;

      uniform sampler2D tDiffuse;
      uniform vec2  u_resolution;
      uniform float u_time, u_strength, u_speed;
      uniform float u_radius, u_falloffExp;
      uniform int   u_mode;
      varying vec2  vUv;

      // Mirror wrapping to avoid edge smearing
      float mirror1D(float x){
        float m = mod(x, 2.0);
        return (m > 1.0) ? (2.0 - m) : m;
      }
      vec2 mirrorUV(vec2 uv){ return vec2(mirror1D(uv.x), mirror1D(uv.y)); }

      void main(){
        float aspect = u_resolution.x / u_resolution.y;

        // NDC around center, aspect corrected
        vec2 p = vUv * 2.0 - 1.0;
        p.x *= aspect;

        // Normalize radius so corners ≈ 1.0 regardless of aspect
        float r = length(p);
        float maxR = length(vec2(aspect, 1.0));
        float rNorm = r / maxR;     // 0 at center, ~1 at furthest corner

        // Falloff you can control: radius + exponent
        float falloff = pow(smoothstep(u_radius, 0.0, rNorm), u_falloffExp);

        // Twist amount: non-compounding vs compounding
        float twist;
        if (u_mode == 0) {
          // oscillates (no long-term accumulation)
          twist = u_strength * sin(u_time * (6.28318530718 * u_speed)) * rNorm * falloff;
        } else {
          // increases over time (keeps spinning)
          twist = u_strength * (u_time * u_speed) * rNorm * falloff;
        }

        float ang = atan(p.y, p.x) + twist;

        // Reproject to UV
        vec2 q = vec2(cos(ang), sin(ang)) * r;
        q.x /= aspect;
        vec2 uv = q * 0.5 + 0.5;

        // Prevent out-of-range sampling artifacts
        uv = mirrorUV(uv);

        gl_FragColor = texture2D(tDiffuse, uv);
      }
    `
  };

  const pass = new ShaderPass(shader);
  pass.name = 'SpiralPass';
  pass.uniforms = pass.material.uniforms;

  const u = pass.material.uniforms;
  pass.onBeforeRender = () => {
    u.u_resolution.value.set(window.innerWidth, window.innerHeight);
    u.u_strength.value   = params.spiralStrength;
    u.u_speed.value      = params.spiralSpeed;
    u.u_mode.value       = (params.spiralMode | 0);
    u.u_radius.value     = params.spiralRadius;
    u.u_falloffExp.value = params.spiralFalloffExp;
    // u_time is updated from main loop if present
  };

  return pass;
}
