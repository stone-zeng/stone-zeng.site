import { defineConfig, presetAttributify, presetUno } from 'unocss';
import transformerDirective from '@unocss/transformer-directives';

export default defineConfig({
  rules: [
    ['font-sans', { 'font-family': '"Inter", sans-serif' }],
    ['font-mono', { 'font-family': '"JetBrains Mono", monospace' }],
    ['font-display', { 'font-family': '"Inter Display", sans-serif' }],
  ],
  presets: [presetUno({ dark: 'media' }), presetAttributify()],
  transformers: [transformerDirective()],
});
