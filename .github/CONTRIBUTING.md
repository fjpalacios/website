# Contributing Guide

## Branch Protection

The `master` branch is protected with the following rules:

### Required Status Checks

All PRs must pass these checks before merging:

- ✅ Lint & Format Check
- ✅ Unit Tests (95%+ coverage required)
- ✅ E2E Tests
- ✅ Build Check

### Pull Request Rules

- ❌ **No direct commits to `master`** - All changes must go through PRs
- ❌ **No force pushes** - Prevents rewriting history
- ❌ **No branch deletion** - Master branch cannot be deleted
- ✅ **Require conversation resolution** - All review comments must be resolved

### Workflow

#### 1. Create a feature branch

```bash
# Update master first
git checkout master
git pull origin master

# Create and checkout new branch
git checkout -b feature/your-feature-name

# Or for fixes:
git checkout -b fix/issue-description
```

#### 2. Make your changes

```bash
# Make changes to files
# ...

# Stage and commit
git add .
git commit -m "feat: add new feature"

# Push to GitHub
git push -u origin feature/your-feature-name
```

#### 3. Create Pull Request

```bash
# Via GitHub CLI
gh pr create --title "feat: add new feature" --body "Description of changes"

# Or open in browser
gh pr create --web
```

#### 4. Wait for CI/CD

All status checks must pass:

- Lint & Format Check
- Unit Tests
- E2E Tests
- Build Check
- Lighthouse CI (optional for PRs)

#### 5. Merge

```bash
# Via GitHub CLI (after approval and checks pass)
gh pr merge --squash --delete-branch

# Or merge from GitHub web interface
```

## Branch Naming Conventions

Use conventional commit prefixes for branch names:

- `feature/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `ci/` - CI/CD changes

Examples:

```
feature/add-contact-form
fix/lighthouse-ci-failing
chore/update-dependencies
docs/update-readme
refactor/extract-theme-logic
test/add-e2e-tests
ci/update-github-actions
```

## Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `perf`: Performance improvements

### Examples

```bash
git commit -m "feat(auth): add login functionality"
git commit -m "fix(ci): resolve Lighthouse server issue"
git commit -m "docs: update contributing guide"
git commit -m "chore(deps): update Astro to 5.16.6"
```

## Pre-commit Hooks

Pre-commit hooks run automatically before each commit:

1. **Lint-staged**: Lints and formats only staged files
2. **Unit tests**: Runs all unit tests to catch regressions

If hooks fail:

```bash
# Fix linting issues
bun run lint

# Fix formatting
bun run format

# Run tests manually
bun run test:run
```

## Testing Requirements

### Unit Tests

- Must maintain 95%+ coverage
- Run: `bun run test:coverage`

### E2E Tests

- All existing tests must pass
- Add tests for new features
- Run: `bun run test:e2e`

### Manual Testing

Before creating PR:

```bash
# Test dev server
bun run dev

# Test production build
bun run build
bun run preview

# Test in both languages
# - http://localhost:4321/es/
# - http://localhost:4321/en/
```

## Code Review

PRs are automatically assigned to @fjpalacios.

Review checklist:

- [ ] Code follows project conventions
- [ ] All tests pass
- [ ] Coverage remains above 95%
- [ ] No console errors/warnings
- [ ] Works in both languages (es/en)
- [ ] Works in both themes (dark/light)
- [ ] Responsive design maintained
- [ ] Accessibility standards met (WCAG 2.1 AA)

## Merging Strategy

**Squash and merge** is the default strategy:

- Keeps `master` history clean
- All PR commits squashed into one
- Commit message uses PR title

## Emergency Hotfixes

For critical production issues:

1. Create hotfix branch from `master`:

   ```bash
   git checkout master
   git pull origin master
   git checkout -b hotfix/critical-issue
   ```

2. Make minimal changes to fix the issue

3. Create PR with `[HOTFIX]` prefix:

   ```bash
   gh pr create --title "[HOTFIX] fix critical issue"
   ```

4. Fast-track review and merge

## Getting Help

- **Issues**: <https://github.com/fjpalacios/website/issues>
- **Discussions**: <https://github.com/fjpalacios/website/discussions>

## Resources

- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
