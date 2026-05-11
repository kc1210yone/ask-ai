# DB

システムで利用するすべてのRDBのスキーマ。
このディレクトリはモノレポのワークスペースの一つである。
他のワークスペースでDBを操作する時、このワークスペースのビルド成果物を利用する。

## 技術スタック

- Prisma
- MySQL 8.4

## コードスタイル

特になし。

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行。

- `npm run build -w @internal/db`: ビルド。
- `npm run test:typecheck -w @internal/db`: TypeScriptのタイプチェック。
- `npm run lint:check -w @internal/db`: ESLint/Prettierによるチェック。
- `npm run lint:fix -w @internal/db`: ESLint/Prettierによる自動Fix。
- `npx -w @internal/db prisma <command>`: Prismaのコマンドを実行。

## アーキテクチャ

- `./prisma`: Prismaのスキーマ。
- `#db` (`./src`): ソースディレクトリ。
- `#db/generated/prisma`: Prismaの自動生成コード。

## その他注意事項

- テストは書かない。
