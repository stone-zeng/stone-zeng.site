import { defineConfig, presetAttributify, presetUno } from 'unocss';
import transformerDirective from '@unocss/transformer-directives';

export default defineConfig({
  rules: [
    ['font-sans', { 'font-family': '"Inter", sans-serif' }],
    ['font-mono', { 'font-family': '"JetBrains Mono", monospace' }],
  ],
  presets: [presetUno(), presetAttributify()],
  transformers: [transformerDirective()],
});
