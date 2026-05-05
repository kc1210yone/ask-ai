import { defineConfig } from 'eslint/config';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh';
import rootConfig from '../../eslint.config.ts';

export default defineConfig(
  rootConfig,
  {
    ...eslintPluginReact.configs.flat['recommended'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      ...eslintPluginReact.configs.flat['recommended']!.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
  eslintPluginReactHooks.configs.flat.recommended,
  eslintPluginReactRefresh.configs.vite,
);
