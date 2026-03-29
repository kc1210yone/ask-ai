# Manager

管理ユーザー用の管理画面。
AIアシスタントが回答するときに参照するデータを入稿するシステム。
このディレクトリはモノレポのワークスペースの一つである。

## 技術スタック

- React 19
- Next.js 16
- Tailwind CSS 4
- Tailwind Variants
- Vitest
- React Compiler
- Prisma

## コードスタイル

- TypeScriptのstrictモード（npmスクリプトの`test:typecheck`）
- ESLint/Prettierに従う（npmスクリプトの`lint`、`fix`）

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行

- `npm run dev -w @internal/manager`: Next.jsのDevモード起動
- `npm run test:typecheck -w @internal/manager`: TypeScriptのタイプチェック
- `npm run test:vitest -w @internal/manager`: Vitestによるテスト（テストはほとんど書かない）
- `npm run lint -w @internal/manager`: ESLint/Prettierによるチェック
- `npm run fix -w @internal/manager`: ESLint/Prettierによる自動Fix

## アーキテクチャ

- `./src`: ソースディレクトリ
- `./src/app`: ルーティング

## その他注意事項

- 特になし
