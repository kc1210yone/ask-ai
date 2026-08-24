# Ask AI

誰でも簡単にWebサイトにAIアシスタントを設置できるようにするサービス。

## 用語

- 管理ユーザー: Webサイトの所有者で、自社のWebサイトにAIアシスタントを設置する。
- 管理画面: 管理ユーザーが、AIアシスタントに回答時に参照してほしい情報を入稿する画面。
- サイトユーザー: Webサイトの訪問者で、AIアシスタントに質問して回答をもらう。
- AIアシスタント: 管理ユーザーが入稿した情報を踏まえて、サイトユーザーからの質問に回答する。
- RAG DB: AIアシスタントが参照する情報がベクトル化されて保管されたDB。Amazon Bedrock Knowledge Baseを利用。
- プロジェクト: 管理ユーザーが複数のWebサイトを保有しているときに、各Webサイト用に入稿したい情報は異なる。
  各Webサイトを「プロジェクト」として管理画面で登録する。
  プロジェクト配下に、DocumentやFAQがある。
- Document: AIアシスタントが参考にする情報のうち、単一テキスト形式のもの。
- FAQ: AIアシスタントが参考にする情報のうち、QuestionとAnswerのペアの形式のもの。

## 技術スタック

- Node 24
- npm workspaces
- TypeScript

## コードスタイル

- test:typecheck, lint:check, lint:fixのコマンドを用いてエラーや警告を消すこと。
- 関数定義は`function`を用いずにアロー関数で記述すること。
  ただし、クラスメソッドの定義ではアロー関数ではなく`xxx () {}`を使うこと。
- 関数を定義する場合は戻り値の型を明記すること。
  ただし、以下の場合は戻り値の型を省略すること。
  - 戻り値の型が複雑な書き方しかできない場合。
  - `const fn: Fn = () => {...};`のように関数自体の型が指定されている場合。
- 変数名や関数名には単語の省略形を用いないこと。
- 可読性のために日本語のコメントを適宜入れること。
- TypeScriptのコードでは、Assertion（プログラム上の不変条件の検証）には以下を使用すること。
  - サーバサイド：`import assert from 'node:assert/strict';`
  - ブラウザ上：`import invariant from 'tiny-invariant';`
  - ただし、Next.jsのコードはサーバ・ブラウザ両方で使われるため、サーバ用のコードであってもassertではなくinvariant使用に統一。

## アーキテクチャ

npm workspacesを使ったモノレポ構成。
各workspace内のコマンドは、プロジェクトルートディレクトリ内で、`npm run xxx -w @internal/xxx`のように実行。（各workspaceのディレクトリで実行しない。）

- `@internal/admin` (`./apps/admin`): 管理ユーザー用の管理画面。
- `@internal/assistant-bff` (`./apps/assistant-bff`): AIアシスタントのBFF。
- `@internal/assistant-web` (`./apps/assistant-web`): AIアシスタントのWeb FE。
- `@internal/functions` (`./apps/functions`): FaaSの関数群。
- `@packages/rdb` (`./packages/rdb`): RDBの設定。

## その他注意事項

- 特になし。
