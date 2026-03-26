# Project Development Guidelines

## Testing Strategy

- Use Vitest for unit tests and Playwright for e2e tests.
- Keep unit tests focused and small.
- Maintain 95% coverage thresholds for lines, statements, functions, and branches.

## Folder Structure

- Keep source code in `src/`.
- Place reusable components under `src/components/`.
- Place e2e tests under `playwright/`.
- Place test setup in `test/`.

## Code Organization

- Keep one component per file when adding components.
- Prefer named exports for utilities and components.
- Keep files focused on a single responsibility.

## Formatting

- No semicolons.
- Single quotes for strings.
- Double quotes for JSX attributes.
- Trailing commas in multi-line arrays and objects.
- 100 character line width.
- Arrow functions always use parentheses.

## Linting

- Use `oxlint` with `.oxlintrc.json`.
- Ensure linting passes before commit.

## Commit Convention

- Follow Conventional Commits.
- Types: feat, fix, docs, style, refactor, test, chore.
- Format: `type(scope): description`.
