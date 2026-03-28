import nextEslintPluginNext from '@next/eslint-plugin-next';
import { defineConfig } from 'eslint/config';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import rootConfig from '../../eslint.config.js';

export default defineConfig(
  rootConfig,
  {
    ...eslintPluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...eslintPluginReact.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
  eslintPluginReactHooks.configs.flat.recommended,
  {
    plugins: {
      '@next/next': nextEslintPluginNext,
    },
    rules: {
      ...nextEslintPluginNext.configs.recommended.rules,
      ...nextEslintPluginNext.configs['core-web-vitals'].rules,
    },
  },
);
