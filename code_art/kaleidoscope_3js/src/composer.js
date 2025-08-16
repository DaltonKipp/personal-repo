import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }     from 'three/addons/postprocessing/RenderPass.js';

import { BasePatternPass }   from './passes/BasePatternPass.js';
import { SpiralPass }        from './passes/SpiralPass.js';
import { ChromaticBlurPass } from './passes/ChromaticBlurPass.js';
import { GlowPass }          from './passes/GlowPass.js';
import { GlitchPass }        from './passes/GlitchPass.js';
import { OutputPass }        from './passes/OutputPass.js';

export function buildComposer(renderer, scene, camera, params) {
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  // Build passes in order (you can reorder later)
  const basePatternPass = BasePatternPass(params);
  const spiralPass      = SpiralPass(params);
  const chromaPass      = ChromaticBlurPass(params);
  const glowPass        = GlowPass(params);
  const glitchPass      = GlitchPass(params);
  const outputPass      = OutputPass();

  composer.addPass(basePatternPass);
  composer.addPass(spiralPass);
  composer.addPass(chromaPass);
  composer.addPass(glowPass);
  composer.addPass(glitchPass);
  composer.addPass(outputPass);

  const passes = [basePatternPass, spiralPass, chromaPass, glowPass, glitchPass, outputPass];
  return { composer, passes };
}
