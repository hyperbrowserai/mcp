PYTHON ?= python3
PACKAGE = hyperbrowser_mcp

.PHONY: install
install:
	$(PYTHON) -m pip install --upgrade pip
	$(PYTHON) -m pip install -e .[dev]

.PHONY: format
format:
	ruff format .

.PHONY: lint
lint:
	ruff check .
	mypy $(PACKAGE)

.PHONY: test
test:
	pytest

.PHONY: coverage
coverage:
	pytest --cov=$(PACKAGE) --cov-report=term-missing

.PHONY: serve
serve:
	hyperbrowser-mcp serve

.PHONY: clean
clean:
	rm -rf .pytest_cache .mypy_cache .ruff_cache dist build *.egg-info
