/// <reference types="vitest/config" />
import { fileURLToPath } from 'node:url';
import babel from '@rolldown/plugin-babel';
import tailwindcss from '@tailwindcss/vite';
import react, { reactCompilerPreset } from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  const shared = {
    resolve: {
      alias: {
        '#src': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
    test: {
      passWithNoTests: true,
      include: ['src/**/*.{test,spec}.ts?(x)'],
    },
  };

  if (command === 'serve') {
    // dev モードでは ask-ai-assistant-front.js を仮想モジュールとして提供し
    // src/index.tsx に解決させることで public/index.html の script タグを統一する
    const devSdkPlugin = {
      name: 'dev-sdk',
      resolveId(source: string): string | undefined {
        if (source.endsWith('ask-ai-assistant-front.js')) {
          return '\0virtual:ask-ai-assistant-front';
        }
        return undefined;
      },
      load(id: string): string | undefined {
        if (id === '\0virtual:ask-ai-assistant-front') {
          return `import '/src/index.tsx';`;
        }
        return undefined;
      },
    };

    return {
      ...shared,
      plugins: [...shared.plugins, devSdkPlugin],
      build: {
        rolldownOptions: {
          input: {
            index: fileURLToPath(new URL('./public/index.html', import.meta.url)),
          },
        },
      },
    };
  }

  return {
    ...shared,
    build: {
      lib: {
        entry: fileURLToPath(new URL('./src/index.tsx', import.meta.url)),
        name: 'AskAiAssistantFront',
        formats: ['iife'],
        fileName: () => 'ask-ai-assistant-front.js',
      },
      // IIFE + cssCodeSplit:true → Vite が CSS を JS 内に style タグとして自動インジェクト
      cssCodeSplit: true,
      target: 'es2018',
      minify: 'esbuild',
      sourcemap: true,
    },
  };
});
