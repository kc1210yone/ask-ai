import type { Configuration } from 'lint-staged';

export default {
  '!{apps,packages}/**': [
    'eslint --fix --no-warn-ignored',
    'prettier --write --ignore-unknown',
  ],
  'apps/manager/**/*': [
    'npx -w @internal/manager eslint --fix --no-warn-ignored',
    'npx -w @internal/manager prettier --write --ignore-unknown',
  ],
} satisfies Configuration;

//
