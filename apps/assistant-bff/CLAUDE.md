# Assistant BFF

AIアシスタントのBFF。
このディレクトリはモノレポのワークスペースの一つである。

## 技術スタック

- Amazon Bedrock Agent
- Amazon Bedrock Knowledge Base
- Express
- Zod 4
- Vitest

## コードスタイル

特になし。

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行。

- `npm run dev -w @internal/assistant-bff`: Devサーバ起動。
- `npm run test:typecheck -w @internal/assistant-bff`: TypeScriptのタイプチェック。
- `npm run test:vitest -w @internal/assistant-bff`: Vitestによるテスト。
- `npm run lint:check -w @internal/assistant-bff`: ESLint/Prettierによるチェック。
- `npm run lint:fix -w @internal/assistant-bff`: ESLint/Prettierによる自動Fix。

## アーキテクチャ

- `#src` (`./src`): ソースディレクトリ。
- `#src/bootstrap`: 起動関係。
- `#src/features`: 各機能。
- `#src/lib`: 共通ロジック。

## その他注意事項

- テストは書かない。
