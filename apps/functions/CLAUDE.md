# Functions

FaaSの関数群。
このディレクトリはモノレポのワークスペースの一つである。

## 技術スタック

- AWS Lambda
- Amazon Bedrock Agent
- Amazon Bedrock Knowledge Base
- AWS S3
- Zod 4
- Vitest

## コードスタイル

特になし。

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行。

- `npm run dev -w @internal/functions`: Devモードで起動。
- `npm run test:typecheck -w @internal/functions`: TypeScriptのタイプチェック。
- `npm run test:vitest -w @internal/functions`: Vitestによるテスト。
- `npm run lint:check -w @internal/functions`: ESLint/Prettierによるチェック。
- `npm run lint:fix -w @internal/functions`: ESLint/Prettierによる自動Fix。

## アーキテクチャ

- `#src` (`./src`): ソースディレクトリ。
- `#src/ingest`: Amazon Bedrock Knowledge Baseのインジェスチョンを起動するFunction。
- `#src/upload-knowledge-base`: 管理画面のDBのデータをAmazon Bedrock Knowledge BaseのデータソースにアップロードするFunction。

## その他注意事項

- テストは書かない。
