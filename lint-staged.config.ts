import type { Configuration } from 'lint-staged';

export default {
  '*': ['eslint --fix --no-warn-ignored', 'prettier --write --ignore-unknown'],
} satisfies Configuration;
