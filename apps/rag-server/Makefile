start:
	uv run chroma run ./chroma.yaml
lint-check:
	uv run ruff check
	uv run ruff format --check
	# uv run mypy .
lint-fix:
	uv run ruff check --fix
	uv run ruff format
