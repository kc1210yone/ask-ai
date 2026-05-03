import type { Configuration } from 'lint-staged';

export default {
  '!{apps,packages}/**': [
    'eslint --fix --no-warn-ignored',
    'prettier --write --ignore-unknown',
  ],
  ...Object.fromEntries(
    ['apps/functions', 'apps/manager'].map((workspace) => [
      `${workspace}/**/*`,
      [
        `npx -w ./${workspace} eslint --fix --no-warn-ignored`,
        `npx -w ./${workspace} prettier --write --ignore-path ../../.prettierignore --ignore-unknown`,
      ],
    ]),
  ),
} satisfies Configuration;
