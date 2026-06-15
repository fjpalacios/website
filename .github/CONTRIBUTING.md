# Contributing Guide

This is a personal Astro site, not a large product team repository. Keep changes small, explicit, and easy to review.

## Workflow

1. Start from `master`:

   ```bash
   git checkout master
   git pull --ff-only
   ```

2. Create a focused branch:

   ```bash
   git checkout -b fix/short-description
   ```

3. Make the smallest change that solves the problem.

4. Stage only intended files:

   ```bash
   git add path/to/file
   ```

   Avoid `git add .` unless you have inspected the working tree first.

5. Commit with a Conventional Commit message:

   ```bash
   git commit -m "fix: describe the fix"
   ```

6. Push and open a PR:

   ```bash
   git push -u origin your-branch
   gh pr create
   ```

## Branch Naming

Use the same intent as Conventional Commits:

- `feat/...` — new functionality or content features
- `fix/...` — bug fixes
- `chore/...` — dependencies, maintenance, generated data
- `docs/...` — documentation-only changes
- `refactor/...` — behavior-preserving code cleanup
- `test/...` — tests only
- `ci/...` — GitHub Actions or CI config

## Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```txt
<type>(optional-scope): short imperative summary
```

Examples:

```bash
fix(routing): preserve props in dev-server routes
chore(deps): upgrade astro to 6.4.6
docs: simplify contribution guide
```

## Checks

Run the checks that match the change. CI will run the full required set for PRs.

| Change type                | Useful local checks                                       |
| -------------------------- | --------------------------------------------------------- |
| Code / config              | `bun run lint:check`, `bun run typecheck`, `bun run test` |
| Astro routing / dev server | `bun run test:e2e:dev-server`                             |
| UI / templates             | `bun run test:e2e`                                        |
| Content                    | `bun run validate`, language-specific manual review       |
| Dependencies               | affected test command + CI                                |

Available commands:

```bash
bun run lint:check
bun run format:check
bun run typecheck
bun run test
bun run test:coverage
bun run test:e2e
bun run test:e2e:dev-server
bun run validate
```

## Project-Specific Rules

- This is a bilingual site. User-facing content usually needs ES and EN versions.
- Changing a URL requires updating `public/_redirects`.
- Astro routing or dependency changes must consider the dev-server path, not only build/preview.
- Dependency PRs should stay one dependency at a time unless versions are explicitly coupled.
- PR descriptions should explain the PR contents, rationale, and validation. Do not mention unrelated local working-tree state.

## Pull Requests

Keep PR descriptions short and useful:

- what changed;
- why it changed;
- how it was validated;
- any real risk or follow-up.

Delete template sections that do not apply.

## Merging

Use squash merge by default. Do not merge until required checks pass.
