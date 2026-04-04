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
- React Hook Form 7.x, @hookform/resolvers/zod
- Prisma
- AWS Cognito
- AWS Amplify

## コードスタイル

TypeScriptのタイプチェック、ESLint/Prettierによるスタイルチェックを行うこと。

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行。

- `npm run dev -w @internal/manager`: Next.jsのDevモード起動。
- `npm run test:typecheck -w @internal/manager`: TypeScriptのタイプチェック。
- `npm run test:vitest -w @internal/manager`: Vitestによるテスト。
- `npm run lint -w @internal/manager`: ESLint/Prettierによるチェック。
- `npm run fix -w @internal/manager`: ESLint/Prettierによる自動Fix。

## アーキテクチャ

### 全体構成

- `#src` (`./src`): ソースディレクトリ。
- `#src/app`: ルーティングのみで、機能の実装はできるだけfeaturesに置く。
- `#src/(auth)`: 認証が必要なページ。
- `#src/(public)`: 認証が不要なページ。
- `#src/components`: 共通で使うコンポーネント。
- `#src/components/layout`: 共通で使うレイアウト。
- `#src/components/providers`: 共通で使うProvider。
- `#src/components/ui`: 共通で使うUIパーツ。
- `#src/features`: 各機能の実装。
- `#src/hooks`: 共通で使うフック。
- `#src/lib`: 共通で使うロジック。
- `#src/providers`: 共通で使うProvider。
- `#src/types`: 共通で使う型。

### features配下

- `#src/features/*/actions`: Server Actions。
- `#src/features/*/components`: コンポーネント。
- `#src/features/*/hooks`: フック。
- `#src/features/*/lib`: ロジック。
- `#src/features/*/providers`: Provider。
- `#src/features/*/server`: サーバサイドのロジック。
- `#src/features/*/types`: 型。
- `#src/features/*/index.ts`: featureの外部に公開したいものをexportする。

## その他注意事項

- テストは書かない。
