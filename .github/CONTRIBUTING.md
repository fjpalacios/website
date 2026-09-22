# Contributing Guide

This is a personal Astro site, not a large product team repository. Keep changes small, explicit, and easy to review. The process should help the code, not become a second project to maintain.

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

6. Push and open a PR when the change benefits from review:

   ```bash
   git push -u origin your-branch
   gh pr create
   ```

`master` is protected, so every change goes through a branch and a PR, including tiny documentation fixes. The lightness belongs in the conversation around the change, not in bypassing the guardrails that keep the default branch healthy.

## Issues and Pull Requests

Issues are optional. Open one when a change needs discussion, contains several steps, or should remain visible until someone picks it up. For a small, well-understood fix, go straight to a branch and a PR.

Pull requests do not require a pre-approved issue, special labels, or a particular closing keyword. A useful PR is simply a short narrative:

1. What changed?
2. Why was it needed?
3. How was it checked?
4. Is there any real risk or follow-up?

Dependabot PRs follow the same rule. Keep them focused, investigate failures before merging, and do not add unrelated cleanup just because the dependency update happens to touch the repository.

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

## Pull Request Writing

Write PR descriptions like a short explanation to a colleague, not like a legal form. Start with the problem, explain the change that solves it, and finish with the evidence that it works. Keep the tone direct and human; delete template sections that do not apply.

## Merging

Use squash merge by default. Do not merge until required checks pass.
