# Manager

管理ユーザー用の管理画面。
AIアシスタントが回答するときに参照するデータを入稿するシステム。
このディレクトリはモノレポのワークスペースの一つである。

## 技術スタック

- React 19
- Next.js 16
- Tailwind CSS 4
- shadcn/ui
- Vitest
- React Compiler
- React Hook Form 7.x, @hookform/resolvers/zod
- Prisma
- AWS Cognito
- AWS Amplify
- date-fns
- tiny-invariant
- Zod 4

## コードスタイル

- test:typecheck, lint:check, lint:fixのコマンドを用いてエラーや警告を消すこと。
- `function xxx() {}`ではなく`const xxx = () => {}`を使うこと。
  ただし、クラスのメソッドでは`xxx () {}`を使うこと。
- 関数を定義する場合は戻り値の型を明記すること。
  ただし、戻り値の型が複雑な書き方しかできない場合は省略すること。

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行。

- `npm run dev -w @internal/manager`: Next.jsのDevモード起動。
- `npm run test:typecheck -w @internal/manager`: TypeScriptのタイプチェック。
- `npm run test:vitest -w @internal/manager`: Vitestによるテスト。
- `npm run lint:check -w @internal/manager`: ESLint/Prettierによるチェック。
- `npm run lint:fix -w @internal/manager`: ESLint/Prettierによる自動Fix。
- `npx -w @internal/manager shadcn add <component>`: shadcn/uiのコンポーネント追加。追加後、スタイルのFixを実行すること。
- `npx -w @internal/manager prisma <command>`: Prismaのコマンドを実行。

## アーキテクチャ

### 全体構成

- `#src` (`./src`): ソースディレクトリ。
- `#src/app`: ルーティング。この層は薄くし、機能の実装はできるだけfeaturesに置く。
- `#src/components`: 共通で使うコンポーネント。
- `#src/components/ui`: 共通で使うUIパーツ。shadcn/uiのコンポーネントを入れる。
- `#src/features`: 各機能の実装。
- `#src/hooks`: 共通で使うフック。
- `#src/lib`: 共通で使うロジック。
- `#src/types`: 共通で使う型。

### app配下

- `#src/app/(private)`: 認証が必要なページ。
- `#src/app/(private)/(with-user)`: DBにすでにユーザーが存在する場合用のページ。
- `#src/app/(private)/(with-user)/(with-project)`: プロジェクトが選択されている時用のページ。
- `#src/app/(private)/(with-user)/(without-project)`: プロジェクトが選択されていない時用や、特定のプロジェクトに依存しないページ。
- `#src/app/(private)/(without-user)`: ログインはなされているけれどもまだDBにユーザーが存在しない時用のページ。
- `#src/app/(public)`: 認証が不要なページ。
- `#src/app/(public)/auth`: サインアップやログインなど認証関係のページ。

### features配下

- `#src/features/auth`: 認証・認可関係。
- `#src/features/documents`: ドキュメント関係。
- `#src/features/faqs`: FAQ関係。
- `#src/features/layouts`: レイアウト。
- `#src/features/projects`: プロジェクト関係。
- `#src/features/theme`: テーマ関係。
- `#src/features/users`: ユーザー関係。

### 各feature配下

- `#src/features/*/actions`: サーバアクション。
- `#src/features/*/components`: コンポーネント。
- `#src/features/*/hooks`: フック。
- `#src/features/*/lib`: ロジック。
- `#src/features/*/providers`: プロバイダ。
- `#src/features/*/server`: サーバサイドのロジック。
- `#src/features/*/types`: 型。
- `#src/features/*/index.ts`: featureの外部に公開したいものをexportする。

## その他注意事項

- テストは書かない。
