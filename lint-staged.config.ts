import type { Configuration } from 'lint-staged';

export default {
  './apps/manager/**/*': [
    'npx -w @internal/manager eslint --fix --no-warn-ignored',
    'npx -w @internal/manager prettier --write --ignore-unknown',
  ],
} satisfies Configuration;
