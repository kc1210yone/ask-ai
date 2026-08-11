# RDB

システムで利用するすべてのRDBのスキーマ。
このディレクトリはモノレポのワークスペースの一つである。
他のワークスペースでRDBを操作する時、このワークスペースのビルド成果物を利用する。

## 技術スタック

- Prisma
- MySQL 8.4

## コードスタイル

特になし。

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行。

- `npm run build -w @internal/rdb`: ビルド。
- `npm run test:typecheck -w @internal/rdb`: TypeScriptのタイプチェック。
- `npm run lint:check -w @internal/rdb`: ESLint/Prettierによるチェック。
- `npm run lint:fix -w @internal/rdb`: ESLint/Prettierによる自動Fix。
- `npx -w @internal/rdb prisma <command>`: Prismaのコマンドを実行。
  `<command>`は`migrate dev`, `generate`, `studio`など。

## アーキテクチャ

- `./prisma`: Prismaのスキーマ。
- `#rdb` (`./src`): ソースディレクトリ。
- `#rdb/generated/prisma`: Prismaの自動生成コード。

## その他注意事項

- テストは書かない。
