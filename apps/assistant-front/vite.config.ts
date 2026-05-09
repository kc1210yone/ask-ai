/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: {
        'ask-ai-assistant': fileURLToPath(
          new URL('./src/scripts/ask-ai-assistant.ts', import.meta.url),
        ),
      },
      formats: ['es'],
    },
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: false,
    rolldownOptions: {
      // input: {},
      output: {
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      '#src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  test: {
    include: ['src/**/*.{test,spec}.ts?(x)'],
  },
});
