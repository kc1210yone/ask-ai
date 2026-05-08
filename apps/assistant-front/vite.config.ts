/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '#src': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: {
        'my-lib': resolve(import.meta.dirname, 'lib/main.js'),
        secondary: resolve(import.meta.dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rolldownOptions: {
      // ライブラリーにバンドルされるべきではない依存関係を
      // 外部化するようにします
      external: ['vue'],
      output: {
        // 外部化された依存関係のために UMD のビルドで使用する
        // グローバル変数を提供します
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  // build: {
  //   rolldownOptions: {
  //     input: {
  //       example: './src/pages/example/index.html',
  //     },
  //   },
  // },
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  test: {
    passWithNoTests: true,
    include: ['src/**/*.{test,spec}.ts?(x)'],
  },
});

/*

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'AskAiWidget',
      formats: ['iife'],
      fileName: () => 'ask-ai-widget.js',
    },

    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },

    target: 'es2018',
    minify: 'esbuild',
    sourcemap: true,
  },
});
*/
