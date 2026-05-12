import { type Config } from 'prettier';

export default {
  plugins: ['prettier-plugin-tailwindcss'],
  singleQuote: true,
  overrides: [
    {
      files: ['*.yml', '*.yaml'],
      options: {
        singleQuote: false,
      },
    },
  ],
} satisfies Config;
