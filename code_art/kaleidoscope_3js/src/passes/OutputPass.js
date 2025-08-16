import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

// Simply outputs the input (final pass)
export function OutputPass() {
  const shader = {
    uniforms: { tDiffuse: { value: null } },
    vertexShader: `
      varying vec2 vUv;
      void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    fragmentShader: `
      precision mediump float;
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      void main(){ gl_FragColor = texture2D(tDiffuse, vUv); }`
  };
  const pass = new ShaderPass(shader);
  pass.name = 'OutputPass';
  return pass;
}
