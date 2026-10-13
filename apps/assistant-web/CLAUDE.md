# Assistant Web

AIアシスタントのブラウザ用FE。
このディレクトリはモノレポのワークスペースの一つである。
成果物であるJSファイルを管理ユーザーが自社のウェブサイトに組み込むことで、簡単にAIアシスタントを設置できる。

## 技術スタック

- Lucide for React
- React 19
- React Hook Form 7.x, @hookform/resolvers/zod
- Tailwind Variants
- tiny-invariant
- Zod 4
- Tailwind CSS 4
- React Compiler
- Vite
- Vitest

## コードスタイル

特になし。

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行。

- `npm run dev -w @internal/assistant-web`: Devサーバ起動。
- `npm run test:typecheck -w @internal/assistant-web`: TypeScriptのタイプチェック。
- `npm run test:vitest -w @internal/assistant-web`: Vitestによるテスト。
- `npm run lint:check -w @internal/assistant-web`: ESLint/Prettierによるチェック。
- `npm run lint:fix -w @internal/assistant-web`: ESLint/Prettierによる自動Fix。

## アーキテクチャ

- `./public`: Publicディレクトリ。
- `#src` (`./src`): ソースディレクトリ。
- `#src/features`: 各機能。
- `#src/lib`: 共通ロジック。
- `#src/pages`: ページ。この層はできるだけ薄くする。
- `#src/scripts`: 出力するスクリプトファイルのエントリーポイント。この層はできるだけ薄くする。
- `#src/types`: 共通で使う型。

## その他注意事項

- テストは書かない。
