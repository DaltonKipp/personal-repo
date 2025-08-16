import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Simple radial “glow” sampling around each pixel
export function GlowPass(params) {
  const MAX_GLOW_STEPS = 32;

  const shader = {
    uniforms: {
      tDiffuse:     { value: null },
      u_resolution: { value: new THREE.Vector2(1,1) },
      u_glowStrength: { value: params.glowStrength },
      u_glowSteps:    { value: params.glowSteps },
    },
    vertexShader:`
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader:`
      precision mediump float;
      uniform sampler2D tDiffuse;
      uniform vec2 u_resolution;
      uniform float u_glowStrength;
      uniform float u_glowSteps;
      varying vec2 vUv;

      float TWO_PI = 6.2831853;

      void main(){
        // Convert steps to int safely
        float stepsF = clamp(u_glowSteps, 1.0, 32.0);
        int steps = int(stepsF + 0.5);

        float radius = u_glowStrength * 0.01;
        vec3 base = texture2D(tDiffuse, vUv).rgb;
        vec3 sum = base;

        for (int i=0; i<32; i++){
          if (i >= steps) break;
          float a = float(i) * (TWO_PI / float(steps));
          vec2 offset = vec2(cos(a), sin(a)) * radius;
          sum += texture2D(tDiffuse, vUv + offset / u_resolution).rgb;
        }

        vec3 glow = sum / float(steps + 1);
        // Additive-ish glow
        vec3 color = base + (glow - base) * u_glowStrength;
        gl_FragColor = vec4(color, 1.0);
      }`
  };

  const pass = new ShaderPass(shader);
  pass.name = 'GlowPass';

  const u = pass.material.uniforms;
  pass.onBeforeRender = () => {
    u.u_resolution.value.set(window.innerWidth, window.innerHeight);
    u.u_glowStrength.value = params.glowStrength;
    u.u_glowSteps.value    = Math.max(1, Math.min(32, Math.round(params.glowSteps)));
  };

  return pass;
}
