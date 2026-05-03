# RAG Server

AIアシスタントが回答する時に参照するデータをベクトル化して入れるRAGサーバ。
このディレクトリはモノレポのワークスペースの一つである。

## 技術スタック

- uv
- Python 3.13
- Chroma
- Ruff
- mypy

## コードスタイル

lint-checkやlint-fixのコマンドを用いてコードのスタイリングを行うこと。

## コマンド

Workspaceのディレクトリではなくプロジェクトルートのディレクトリから実行。

- `make -C ./apps/rag-server start`: RAGサーバ（Chroma）起動。Chromaの不具合でシグナル送信で終了しないため、終了したい場合は人間に依頼すること。
- `make -C ./apps/rag-server lint-check`: Ruff check, Ruff format, mypyによるチェックを行う。コードの変更はしない。
- `make -C ./apps/rag-server lint-fix`: Ruff check, Ruff formatによるコードの自動修正を行う。

## アーキテクチャ

- ソースコードなし。

## その他注意事項

- 特になし。
