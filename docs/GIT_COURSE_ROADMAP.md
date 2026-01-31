# Git Course Roadmap - From Zero to Mastery

Complete roadmap for the "Domina Git desde cero" course, covering Git fundamentals, workflows, remote collaboration, and productivity optimization.

## Course Philosophy

- **Audience**: Complete beginners with zero Git knowledge, also developers from other VCS
- **Goal**: Master Git for professional development workflows
- **Approach**: Hands-on learning with real-world scenarios and best practices
- **Quality**: Clear explanations, practical examples, progressive complexity

## Current State Analysis

### Existing Tutorials (14 lessons)

The course currently has **14 tutorials** covering core Git concepts:

1. **¿Qué es Git?** (Order 1) - Introduction to version control systems
2. **Cómo instalar Git** (Order 2) - Installation on Linux, macOS, Windows
3. **Primeros pasos con Git** (Order 3) - First commit, basic workflow
4. **Los tres estados de Git** (Order 4) - Modified, staged, committed states
5. **Cómo recuperar ficheros** (Order 5) - Recovering modified files with `checkout` and `reset`
6. **Introducción a las ramas (I)** (Order 6) - Branches concept and use cases
7. **Introducción a las ramas (II)** (Order 7) - Branches practical commands (`checkout`, `merge`, conflicts)
8. **Introducción a los remotos** (Order 8) - Remote repositories concept
9. **Creando primer repositorio en GitHub** (Order 9) - Creating GitHub repository
10. **Clonando y obteniendo commits** (Order 10) - `git clone` and `git pull`
11. **Cómo deshacer commits** (Order 11) - `git reset` vs `git revert`
12. **Utilizando alias de Git** (Order 12) - Creating Git aliases for productivity
13. **Lanzando versiones con tags** (Order 13) - Git tags (annotated and lightweight)
14. **Alias de Oh My ZSH!** (Order 14) - Oh My ZSH! Git aliases

### Strengths

✅ **Solid Foundation**: Good coverage of essential Git concepts  
✅ **Progressive Learning**: Logical order from basics to advanced topics  
✅ **Practical Examples**: Real-world scenarios with code examples  
✅ **Bilingual Content**: Spanish and English versions available  
✅ **Productivity Focus**: Includes efficiency tools (aliases, Oh My ZSH!)

### Areas for Improvement

#### 1. **Missing Core Topics**

- **`.gitignore` files**: Not covered (essential for real projects)
- **`git stash`**: Not mentioned (critical for context switching)
- **`git diff`**: Only briefly mentioned, needs dedicated coverage
- **Merge strategies**: Fast-forward mentioned but not other strategies
- **Rebase**: Not covered (important for clean history)
- **Cherry-pick**: Not covered (useful for selective commits)
- **Interactive rebase**: Not covered (essential for history cleanup)
- **Submodules**: Not covered (useful for dependencies)
- **Git hooks**: Not covered (automation and validation)
- **Git bisect**: Not covered (debugging tool)
- **Reflog**: Not covered (recovery tool)

#### 2. **Workflow Gaps**

- **Git Flow**: Industry-standard workflow not explained
- **Feature branch workflow**: Pattern mentioned but not formalized
- **Pull Requests**: Concept not covered
- **Code Review**: Not mentioned
- **Commit message conventions**: No specific guidelines (Conventional Commits)
- **CI/CD integration**: Mentioned (Travis CI) but not explored

#### 3. **Best Practices**

- **Atomic commits**: Concept mentioned but not formalized
- **Commit granularity**: Good practices not explicit
- **Branch naming conventions**: Mentioned but not detailed
- **`.gitattributes`**: Not covered (line endings, diff drivers)
- **Git LFS**: Not covered (large files)

#### 4. **Content Organization**

- **Order 5 placement**: "Recovering files" (order 5) could come after branches (better context)
- **Aliases too early**: Orders 12 and 14 (aliases) could be moved later
- **Missing intermediate**: Gap between basics (order 1-5) and branches (order 6-7)

#### 5. **Modern Git Features**

- **`git switch` and `git restore`**: New commands (Git 2.23+) replacing `checkout` use cases
- **`git worktree`**: Multiple working directories
- **Sparse checkout**: Working with partial repositories
- **Partial clone**: Cloning only what's needed

## Recommended Course Structure

### 📚 MODULE 1: Git Fundamentals (Lessons 1-5) ✅ COMPLETE

**Status**: Solid foundation, minor improvements needed

1. ✅ **What is Git?** (Existing - Order 1)
2. ✅ **Installing Git** (Existing - Order 2)
3. ✅ **First Steps with Git** (Existing - Order 3)
4. ✅ **The Three States of Git** (Existing - Order 4)
5. 🔄 **Understanding `git status` and `git log`** (NEW - Order 5)
   - Deep dive into `git status` flags
   - `git log` formatting options
   - Visualizing history with `--graph`, `--oneline`, `--decorate`

**Improvements**:

- Add lesson 5 on status/log before moving to recovery
- Emphasize hands-on practice with all commands

---

### 📚 MODULE 2: Working with Files (Lessons 6-8)

**Status**: Needs new content

6. 🆕 **Tracking and Ignoring Files** (NEW - Order 6)
   - What files to track vs ignore
   - Creating and using `.gitignore` patterns
   - Global `.gitignore` configuration
   - `.gitattributes` introduction (line endings, merge drivers)
   - Common `.gitignore` templates (Node.js, Python, etc.)

7. 🆕 **Understanding File Changes** (NEW - Order 7)
   - `git diff` - working directory vs staged
   - `git diff --staged` - staged vs committed
   - `git diff HEAD` - working directory vs last commit
   - `git diff branch1..branch2` - comparing branches
   - Using diff tools (`git difftool`)

8. 🔄 **Recovering Files** (Existing - Move from Order 5 to Order 8)
   - `git checkout -- <file>` (recovering modified files)
   - `git reset HEAD <file>` (unstaging files)
   - Modern alternatives: `git restore` (Git 2.23+)
   - Distinction between `git restore --worktree` and `git restore --staged`

---

### 📚 MODULE 3: Branching and Merging (Lessons 9-12)

**Status**: Good foundation, needs expansion

9. ✅ **Introduction to Branches (I)** (Existing - Order 6 → 9)
   - Branches concept and use cases
   - Why branches matter

10. ✅ **Introduction to Branches (II)** (Existing - Order 7 → 10)
    - Creating and switching branches
    - Merging branches
    - Resolving conflicts

11. 🆕 **Advanced Branching** (NEW - Order 11)
    - Fast-forward vs non-fast-forward merges
    - Merge strategies (recursive, ours, theirs)
    - `git branch` management (list, rename, delete)
    - `git switch` (Git 2.23+) as `checkout` alternative
    - Detached HEAD state (understanding and recovering)

12. 🆕 **Stashing Changes** (NEW - Order 12)
    - What is `git stash`?
    - `git stash save` / `git stash push`
    - `git stash list`, `git stash show`
    - `git stash apply` vs `git stash pop`
    - `git stash branch` for complex scenarios
    - Practical use cases (context switching)

---

### 📚 MODULE 4: Remote Collaboration (Lessons 13-17)

**Status**: Good coverage, needs expansion

13. ✅ **Introduction to Remotes** (Existing - Order 8 → 13)
    - Remote repositories concept
    - Not just GitHub/GitLab

14. ✅ **Creating Repository on GitHub** (Existing - Order 9 → 14)
    - GitHub account setup
    - Creating repositories
    - SSH vs HTTPS

15. 🆕 **Working with Remotes** (NEW - Order 15)
    - `git remote add`, `git remote remove`
    - `git remote -v` (listing remotes)
    - `git remote show origin` (detailed info)
    - Multiple remotes (origin, upstream)
    - Tracking branches explanation

16. ✅ **Cloning and Pulling** (Existing - Order 10 → 16)
    - `git clone`
    - `git pull` (`git fetch` + `git merge`)
    - Keeping repositories synchronized

17. 🆕 **Pushing and Fetching** (NEW - Order 17)
    - `git push origin <branch>`
    - `git push -u origin <branch>` (setting upstream)
    - `git fetch` vs `git pull` (key differences)
    - `git fetch --prune` (cleaning deleted remote branches)
    - Force pushing dangers (`--force` vs `--force-with-lease`)

---

### 📚 MODULE 5: History Management (Lessons 18-22)

**Status**: Basic coverage, needs expansion

18. ✅ **Undoing Commits** (Existing - Order 11 → 18)
    - `git reset` (soft, mixed, hard)
    - `git revert`
    - When to use each

19. 🆕 **Rewriting History with Rebase** (NEW - Order 19)
    - What is rebasing?
    - `git rebase <branch>` basics
    - Rebase vs merge (pros and cons)
    - Golden rule: never rebase public branches
    - Resolving rebase conflicts
    - `git rebase --abort` and `git rebase --continue`

20. 🆕 **Interactive Rebase** (NEW - Order 20)
    - `git rebase -i HEAD~n`
    - Operations: `pick`, `reword`, `edit`, `squash`, `fixup`, `drop`
    - Cleaning up commit history
    - Reordering commits
    - Splitting commits
    - Practical use cases

21. 🆕 **Cherry-Picking Commits** (NEW - Order 21)
    - `git cherry-pick <commit>`
    - Cherry-picking multiple commits
    - Cherry-pick conflicts
    - Use cases (backporting fixes)

22. 🆕 **Recovering Lost Work** (NEW - Order 22)
    - Understanding `git reflog`
    - Finding lost commits
    - Recovering from hard reset
    - Recovering deleted branches
    - Time-travel with reflog

---

### 📚 MODULE 6: Debugging and Troubleshooting (Lessons 23-25)

**Status**: Missing, needs creation

23. 🆕 **Finding Bugs with Git Bisect** (NEW - Order 23)
    - Binary search for bugs
    - `git bisect start`, `git bisect good`, `git bisect bad`
    - Automated bisect with scripts
    - `git bisect reset`
    - Practical debugging workflow

24. 🆕 **Blame and History Exploration** (NEW - Order 24)
    - `git blame <file>` (who changed what)
    - `git log -p` (commit patches)
    - `git log --follow <file>` (file history across renames)
    - `git log -S "string"` (finding when code was added/removed)
    - `git show <commit>:<file>` (viewing file at specific commit)

25. 🆕 **Resolving Complex Conflicts** (NEW - Order 25)
    - Understanding conflict markers
    - Three-way merge visualization
    - Using merge tools (`git mergetool`)
    - Aborting merges (`git merge --abort`)
    - Strategies for complex conflicts
    - Preventing conflicts (communication and conventions)

---

### 📚 MODULE 7: Git Workflows and Best Practices (Lessons 26-30)

**Status**: Missing, needs creation

26. 🆕 **Commit Best Practices** (NEW - Order 26)
    - Atomic commits principle
    - Commit message conventions (Conventional Commits)
    - Structure: `type(scope): subject`
    - Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
    - Writing meaningful commit messages
    - Using commit body and footer

27. 🆕 **Branch Naming Conventions** (NEW - Order 27)
    - Common patterns: `feature/`, `bugfix/`, `hotfix/`, `release/`
    - Including issue numbers: `feature/123-add-login`
    - Team conventions vs personal preferences
    - Branch lifecycle management

28. 🆕 **Git Flow Workflow** (NEW - Order 28)
    - Introduction to Git Flow
    - Main branches: `master` (production), `develop` (integration)
    - Supporting branches: `feature/`, `release/`, `hotfix/`
    - Branch flow diagram
    - Git Flow commands (`git flow init`, etc.)
    - When to use Git Flow

29. 🆕 **GitHub Flow (Feature Branch Workflow)** (NEW - Order 29)
    - Simpler alternative to Git Flow
    - Main branch: `main` (always deployable)
    - Feature branches from `main`
    - Pull Requests for code review
    - Merge to `main` and deploy
    - When to use GitHub Flow

30. 🆕 **Pull Requests and Code Review** (NEW - Order 30)
    - What are Pull Requests (PRs)?
    - Creating PRs on GitHub/GitLab
    - Writing good PR descriptions
    - Requesting reviews
    - Responding to feedback
    - PR best practices (small, focused changes)

---

### 📚 MODULE 8: Advanced Git Features (Lessons 31-35)

**Status**: Missing, needs creation

31. ✅ **Git Tags** (Existing - Order 13 → 31)
    - Lightweight vs annotated tags
    - Creating, listing, pushing tags
    - Semantic versioning (SemVer)

32. 🆕 **Git Submodules** (NEW - Order 32)
    - What are submodules?
    - Adding submodules (`git submodule add`)
    - Cloning repos with submodules (`git clone --recurse-submodules`)
    - Updating submodules (`git submodule update`)
    - Removing submodules
    - When to use submodules (and when not to)

33. 🆕 **Git Hooks** (NEW - Order 33)
    - What are Git hooks?
    - Client-side hooks: `pre-commit`, `prepare-commit-msg`, `commit-msg`, `post-commit`
    - Server-side hooks: `pre-receive`, `update`, `post-receive`
    - Practical examples (linting, tests, commit message validation)
    - Tools: Husky, pre-commit framework

34. 🆕 **Git Worktrees** (NEW - Order 34)
    - Multiple working directories from one repository
    - `git worktree add`
    - Use cases (working on multiple branches simultaneously)
    - Managing worktrees (`git worktree list`, `git worktree remove`)

35. 🆕 **Large File Storage (Git LFS)** (NEW - Order 35)
    - Problem with large binary files in Git
    - Git LFS overview
    - Installing and configuring Git LFS
    - Tracking file types with LFS
    - Cloning LFS repositories
    - Alternatives to LFS

---

### 📚 MODULE 9: Productivity and Tooling (Lessons 36-38)

**Status**: Partial coverage, needs expansion

36. ✅ **Git Aliases** (Existing - Order 12 → 36)
    - Creating custom aliases
    - Global vs local aliases
    - Chaining commands in aliases

37. ✅ **Oh My ZSH! Aliases** (Existing - Order 14 → 37)
    - Pre-configured Git aliases
    - Most useful Oh My ZSH! aliases
    - Customizing ZSH Git plugin

38. 🆕 **Git Configuration and Optimization** (NEW - Order 38)
    - Global vs local vs system config
    - Essential config options (`user.name`, `user.email`, `core.editor`)
    - Useful aliases and shortcuts
    - Performance optimizations
    - Color configuration
    - Default branch name (`init.defaultBranch`)
    - Config file locations

---

### 📚 MODULE 10: Modern Git and CI/CD Integration (Lessons 39-40)

**Status**: Missing, needs creation

39. 🆕 **Modern Git Commands** (NEW - Order 39)
    - `git switch` vs `git checkout` (Git 2.23+)
    - `git restore` vs `git checkout -- <file>` (Git 2.23+)
    - `git sparse-checkout` (working with large repos)
    - Partial clone (`--filter=blob:none`)
    - `git maintenance` (background optimization)

40. 🆕 **Git in CI/CD Pipelines** (NEW - Order 40)
    - Git in automated workflows
    - GitHub Actions basics
    - GitLab CI/CD basics
    - Automated testing on commits
    - Automated deployments
    - Git operations in CI (shallow clones, caching)
    - Best practices for CI/CD Git usage

---

## Implementation Recommendations

### Phase 1: Fill Core Gaps (Priority 1) 🔴

**Lessons to create immediately**:

1. **Lesson 5**: Understanding `git status` and `git log` (before recovery)
2. **Lesson 6**: Tracking and Ignoring Files (`.gitignore`)
3. **Lesson 7**: Understanding File Changes (`git diff`)
4. **Lesson 12**: Stashing Changes (`git stash`)
5. **Lesson 15**: Working with Remotes (remote management)
6. **Lesson 17**: Pushing and Fetching (fetch vs pull)

**Why priority 1?**: These are essential daily-use commands missing from the course.

### Phase 2: History and Workflows (Priority 2) 🟡

**Lessons to create next**:

7. **Lesson 19**: Rewriting History with Rebase
8. **Lesson 20**: Interactive Rebase
9. **Lesson 26**: Commit Best Practices
10. **Lesson 28**: Git Flow Workflow
11. **Lesson 29**: GitHub Flow
12. **Lesson 30**: Pull Requests and Code Review

**Why priority 2?**: Professional workflows and clean history management are crucial for team collaboration.

### Phase 3: Advanced Features (Priority 3) 🟢

**Lessons to create later**:

13. **Lesson 21**: Cherry-Picking Commits
14. **Lesson 22**: Recovering Lost Work (reflog)
15. **Lesson 23**: Finding Bugs with Git Bisect
16. **Lesson 24**: Blame and History Exploration
17. **Lesson 33**: Git Hooks
18. **Lesson 34**: Git Worktrees

**Why priority 3?**: Advanced but less frequently used. Important for power users.

### Phase 4: Modern Git (Priority 4) ⚪

**Lessons to create eventually**:

19. **Lesson 39**: Modern Git Commands (`switch`, `restore`, etc.)
20. **Lesson 40**: Git in CI/CD Pipelines
21. **Lesson 32**: Git Submodules
22. **Lesson 35**: Git LFS

**Why priority 4?**: Cutting-edge or specialized topics. Important but not daily essentials.

---

## Existing Lessons - Improvement Suggestions

### Lesson 1: ¿Qué es Git? ✅

**Current state**: Good introduction  
**Improvements**:

- Add comparison table (Git vs SVN vs Mercurial)
- Include diagram of distributed vs centralized VCS
- Mention Git's data model (snapshots, not diffs)

### Lesson 2: Cómo instalar Git ✅

**Current state**: Comprehensive installation guide  
**Improvements**:

- Add verification commands after installation
- Include troubleshooting section
- Mention `git --version` to check installation
- Add section on updating Git

### Lesson 3: Primeros pasos con Git ✅

**Current state**: Good first commit tutorial  
**Improvements**:

- Add visual diagram of Git workflow (working directory → staging → repository)
- Include more examples with different file types
- Explain what happens when you run `git init` (`.git` folder structure)

### Lesson 4: Los tres estados de Git ✅

**Current state**: Excellent explanation of Git states  
**Improvements**:

- Add state transition diagram
- Include more examples of state changes
- Clarify `git commit --amend` usage (when to use, when not to)

### Lesson 5: Cómo recuperar ficheros ✅

**Current state**: Good practical examples  
**Improvements**:

- Move to after branches (Order 8 suggested)
- Add section on `git restore` (Git 2.23+) as modern alternative
- Include warning about data loss with `reset --hard`
- Add recovery scenarios flowchart

### Lesson 6-7: Introducción a las ramas ✅

**Current state**: Excellent branch introduction with practical scenario  
**Improvements**:

- Add branch visualization diagrams
- Explain fast-forward vs non-fast-forward merges explicitly
- Include section on merge conflict anatomy
- Add best practices for when to branch

### Lesson 8: Introducción a los remotos ✅

**Current state**: Good conceptual introduction  
**Improvements**:

- Add diagram of distributed Git architecture
- Include section on multiple remotes
- Explain tracking branches concept
- Add practical example with local remote

### Lesson 9: Creando primer repositorio en GitHub ✅

**Current state**: Clear step-by-step guide  
**Improvements**:

- Add section on SSH key setup (why use SSH over HTTPS)
- Include troubleshooting common issues
- Explain README.md importance
- Add section on repository visibility (public vs private)

### Lesson 10: Clonando y obteniendo commits ✅

**Current state**: Good practical examples  
**Improvements**:

- Clarify `git fetch` vs `git pull` distinction
- Add section on clone depth (`--depth` for shallow clones)
- Include diagram of pull operation (fetch + merge)
- Explain what happens during clone (all branches, all history)

### Lesson 11: Cómo deshacer commits ✅

**Current state**: Good explanation of reset vs revert  
**Improvements**:

- Add decision flowchart (when to use reset vs revert)
- Include visual representation of what each reset mode does
- Add warning boxes for destructive operations
- Include section on recovering from mistakes (reflog preview)

### Lesson 12: Utilizando alias de Git ✅

**Current state**: Good introduction to aliases  
**Improvements**:

- Move to later in course (after workflows covered)
- Add more practical alias examples
- Include section on complex aliases with functions
- Add link to community alias collections

### Lesson 13: Lanzando versiones con tags ✅

**Current state**: Clear explanation of tags  
**Improvements**:

- Move to advanced section (Order 31 suggested)
- Add section on semantic versioning (SemVer)
- Include GitHub releases integration
- Add tag management best practices

### Lesson 14: Alias de Oh My ZSH! ✅

**Current state**: Useful Oh My ZSH! alias list  
**Improvements**:

- Move to productivity module (Order 37 suggested)
- Add section on customizing Oh My ZSH! Git plugin
- Include installation guide for Oh My ZSH!
- Add comparison with vanilla Git aliases

---

## Content Style Recommendations

### Consistency

- ✅ All lessons follow similar structure (intro → theory → practice → recap)
- ✅ Code examples are clear and well-formatted
- ✅ Real-world scenarios make concepts relatable

### Improvements Needed

1. **Visual Aids**: Add more diagrams (Git workflows, state transitions, branch graphs)
2. **Warning Boxes**: Highlight dangerous operations (reset --hard, force push)
3. **Best Practices Sections**: Dedicate sections to "dos and don'ts"
4. **Exercises**: Add practical exercises at the end of each lesson
5. **Cheat Sheets**: Create summary cards for each module
6. **Video Supplements**: Consider adding video walkthroughs

---

## Modern Git Considerations

### Git 2.23+ (August 2019)

- Introduce `git switch` instead of `git checkout` for branch switching
- Introduce `git restore` instead of `git checkout --` for file recovery
- Explain why these new commands exist (clearer semantics)

### Git 2.35+ (January 2022)

- `git sparse-checkout` improvements (working with monorepos)
- Better partial clone support

### Current Best Practices (2026)

- **Default branch**: Use `main` instead of `master` (industry standard)
- **Commit signing**: GPG/SSH commit signing for security
- **Conventional Commits**: Structured commit messages
- **Trunk-based development**: Alternative to Git Flow for some teams
- **GitHub Actions / GitLab CI**: Modern CI/CD integration

---

## Missing Topics Summary

### Critical Missing Topics 🔴

1. `.gitignore` and `.gitattributes`
2. `git diff` deep dive
3. `git stash` for context switching
4. `git fetch` vs `git pull` clarification
5. Remote management commands
6. `git rebase` (normal and interactive)
7. Pull Requests and code review process
8. Commit message conventions
9. Git workflows (Git Flow, GitHub Flow)

### Important Missing Topics 🟡

10. `git cherry-pick`
11. `git reflog` for recovery
12. `git bisect` for debugging
13. `git blame` and history exploration
14. Conflict resolution strategies
15. Branch naming conventions
16. Git hooks for automation

### Advanced Missing Topics 🟢

17. `git submodules`
18. `git worktree`
19. Git LFS for large files
20. Modern commands (`switch`, `restore`)
21. CI/CD integration
22. Performance optimization

---

## Suggested Course Completion Timeline

### Immediate (Next 2-4 weeks)

- Create Lessons 5-7 (status/log, gitignore, diff)
- Reorganize existing lessons (move aliases to later)
- Add improvements to existing lessons (diagrams, warnings)

### Short-term (1-2 months)

- Create Lessons 12, 15, 17 (stash, remotes, fetch/push)
- Create Lessons 19-20 (rebase, interactive rebase)
- Create Lessons 26-30 (workflows and best practices)

### Medium-term (3-4 months)

- Create Lessons 21-25 (cherry-pick, reflog, bisect, blame, conflicts)
- Create Lessons 31-35 (tags, submodules, hooks, worktrees, LFS)

### Long-term (5-6 months)

- Create Lessons 36-40 (productivity, modern Git, CI/CD)
- Add video walkthroughs for complex topics
- Create interactive exercises and quizzes
- Build comprehensive cheat sheets

---

## Course Quality Metrics

### Current Course Assessment

- **Coverage**: 60% (missing critical topics)
- **Depth**: 70% (good explanations, could go deeper)
- **Modern**: 50% (uses older Git commands, needs Git 2.23+ updates)
- **Practical**: 80% (good hands-on examples)
- **Structure**: 75% (logical flow, minor reordering needed)

### Target Course Assessment (After Completion)

- **Coverage**: 95% (comprehensive Git knowledge)
- **Depth**: 90% (deep dives into complex topics)
- **Modern**: 95% (up-to-date with latest Git features)
- **Practical**: 90% (exercises, real-world scenarios)
- **Structure**: 95% (optimized learning path)

---

## Final Recommendations

### Immediate Actions

1. ✅ **Keep existing 14 lessons** - they form a solid foundation
2. 🔄 **Reorganize order** - move aliases and tags to later modules
3. 🆕 **Create 6 priority lessons** - gitignore, diff, stash, remotes, fetch, rebase
4. 📊 **Add visual diagrams** - Git workflows, state transitions, branch graphs
5. ⚠️ **Add warning sections** - highlight dangerous operations

### Content Gaps to Address First

1. `.gitignore` (critical daily tool)
2. `git diff` (understanding changes)
3. `git stash` (context switching)
4. `git rebase` (history management)
5. Workflows (Git Flow, GitHub Flow)
6. Pull Requests (collaboration)

### Long-term Vision

- **40 comprehensive lessons** covering Git from zero to mastery
- **Visual learning aids** (diagrams, flowcharts, animations)
- **Interactive exercises** for hands-on practice
- **Video supplements** for complex topics
- **Cheat sheets and quick references**
- **Real-world case studies** (open source contributions, team workflows)
- **Integration with modern tooling** (CI/CD, IDE integration)

---

## Conclusion

The current Git course has a **solid foundation with 14 well-written lessons**. The content is clear, practical, and beginner-friendly. However, to truly "dominate Git from scratch," the course needs:

1. **Core topic additions** (gitignore, diff, stash, rebase)
2. **Workflow coverage** (Git Flow, GitHub Flow, Pull Requests)
3. **Advanced features** (hooks, submodules, worktrees)
4. **Modern Git** (switch, restore, CI/CD integration)

With the proposed 40-lesson structure, students will have comprehensive Git mastery covering daily workflows, advanced techniques, team collaboration, and modern best practices.

**Overall Assessment**: 7.5/10 → Target: 9.5/10

---

## 🚀 IMPLEMENTATION PLAN - OPTION B (AMBITIOUS)

### Three-Phase Approach

We will implement the complete 40-lesson course structure following this strategic plan:

---

### **PHASE 1: Reorganize and Improve Existing Lessons** 🔄

**Objective**: Optimize the current 14 lessons by reordering them and applying all recommended improvements.

#### Step 1.1: Reorder Existing Tutorials

Update the `order` field in frontmatter for the following tutorials:

| Tutorial File                               | Current Order | New Order | Module   |
| ------------------------------------------- | ------------- | --------- | -------- |
| `que-es-git.mdx`                            | 1             | **1**     | Module 1 |
| `como-instalar-git-linux-macos-windows.mdx` | 2             | **2**     | Module 1 |
| `primeros-pasos-con-git.mdx`                | 3             | **3**     | Module 1 |
| `los-tres-estados-de-git.mdx`               | 4             | **4**     | Module 1 |
| `como-recuperar-ficheros-git.mdx`           | 5             | **8**     | Module 2 |
| `introduccion-ramas-git-1.mdx`              | 6             | **9**     | Module 3 |
| `introduccion-ramas-git-2.mdx`              | 7             | **10**    | Module 3 |
| `introduccion-remotos-git.mdx`              | 8             | **13**    | Module 4 |
| `creando-primer-repositorio-github.mdx`     | 9             | **14**    | Module 4 |
| `clonando-obteniendo-commits-git.mdx`       | 10            | **16**    | Module 4 |
| `como-deshacer-commits-git.mdx`             | 11            | **18**    | Module 5 |
| `utilizando-alias-git-productividad.mdx`    | 12            | **36**    | Module 9 |
| `lanzando-versiones-tags-git.mdx`           | 13            | **31**    | Module 8 |
| `alias-utiles-oh-my-zsh-git.mdx`            | 14            | **37**    | Module 9 |

**Git Workflow for Step 1.1**:

```bash
# Create feature branch from master
git checkout -b refactor/reorder-git-course-lessons

# Update order fields in each MDX file
# (Edit frontmatter: order: X → order: Y)

# Stage changes
git add src/content/tutorials/*git*.mdx

# Commit with clear message
git commit -m "refactor(git-course): reorder existing 14 lessons to new course structure

- Move lesson 5 (recovering files) to order 8
- Move lesson 8 (remotes intro) to order 13
- Move lesson 9 (GitHub repo) to order 14
- Move lesson 10 (cloning) to order 16
- Move lesson 11 (undoing commits) to order 18
- Move lesson 12 (aliases) to order 36
- Move lesson 13 (tags) to order 31
- Move lesson 14 (Oh My ZSH aliases) to order 37

This reorganization follows the new 40-lesson roadmap structure
with 10 modules for better learning progression."

# Push to remote
git push -u origin refactor/reorder-git-course-lessons

# Create Pull Request on GitHub
gh pr create --title "refactor: Reorder Git course lessons to new structure" \
  --body "$(cat <<'EOF'
## Summary

Reorganizes the existing 14 Git course lessons according to the new 40-lesson roadmap structure.

## Changes

- ✅ Reordered 8 out of 14 lessons to optimal learning positions
- ✅ Lessons 1-4 remain unchanged (solid foundation)
- ✅ Recovery lesson moved after branches (better context)
- ✅ Remote lessons grouped together
- ✅ Productivity lessons (aliases) moved to end of course

## Rationale

This reordering prepares the course for the addition of 26 new lessons, ensuring:
- Logical progression from basics to advanced topics
- Better grouping of related concepts
- Space for new lessons in appropriate positions

## Next Steps

After merge: Apply content improvements to all 14 existing lessons (Phase 1.2)

## Documentation

See `docs/GIT_COURSE_ROADMAP.md` for complete course structure.
EOF
)"
```

**Deliverable**: PR ready for review with reordered lessons.

---

#### Step 1.2: Improve All 14 Existing Lessons (Single PR)

**Objective**: Apply recommended improvements to all existing lessons in ONE comprehensive PR.

**Git Workflow**:

```bash
# Create single feature branch for all lesson improvements
git checkout master
git pull origin master
git checkout -b feat/improve-all-git-course-lessons

# Apply improvements to ALL 14 lessons:
# - Add diagrams (using MDX components or external tools)
# - Add warning boxes for dangerous operations
# - Include modern Git alternatives (switch, restore)
# - Add practical exercises
# - Improve code examples
# - Add best practices sections

# Stage ALL changed tutorials
git add src/content/tutorials/*git*.mdx

# Commit with comprehensive message
git commit -m "feat(git-course): improve all 14 existing lessons with modern content

Lesson 1 (¿Qué es Git?):
- Add comparison table (Git vs SVN vs Mercurial)
- Include diagram of distributed vs centralized VCS
- Mention Git's data model (snapshots, not diffs)

Lesson 2 (Instalar Git):
- Add verification commands after installation
- Include troubleshooting section
- Add section on updating Git

Lesson 3 (Primeros pasos):
- Add visual diagram of Git workflow
- Include more file type examples
- Explain .git folder structure

Lesson 4 (Tres estados):
- Add state transition diagram
- Include more state change examples
- Clarify git commit --amend usage

Lesson 8 (Recuperar ficheros):
- Add git restore (Git 2.23+) as modern alternative
- Include warning about data loss with reset --hard
- Add recovery scenarios flowchart

Lesson 9 (Ramas I):
- Add branch visualization diagrams
- Include best practices for when to branch

Lesson 10 (Ramas II):
- Explain fast-forward vs non-fast-forward merges explicitly
- Include section on merge conflict anatomy
- Add merge strategies overview

Lesson 13 (Remotos):
- Add diagram of distributed Git architecture
- Include section on multiple remotes
- Explain tracking branches concept
- Add practical example with local remote

Lesson 14 (GitHub repo):
- Add section on SSH key setup
- Include troubleshooting common issues
- Explain README.md importance
- Add section on repository visibility

Lesson 16 (Clonar):
- Clarify git fetch vs git pull distinction
- Add section on clone depth (--depth)
- Include diagram of pull operation (fetch + merge)
- Explain what happens during clone

Lesson 18 (Deshacer commits):
- Add decision flowchart (reset vs revert)
- Include visual representation of reset modes
- Add warning boxes for destructive operations
- Include section on recovering from mistakes (reflog preview)

Lesson 31 (Tags):
- Add section on semantic versioning (SemVer)
- Include GitHub releases integration
- Add tag management best practices

Lesson 36 (Aliases Git):
- Add more practical alias examples
- Include section on complex aliases with functions
- Add link to community alias collections

Lesson 37 (Oh My ZSH):
- Add section on customizing Oh My ZSH! Git plugin
- Include installation guide
- Add comparison with vanilla Git aliases

Implements all improvements from GIT_COURSE_ROADMAP.md"

# Push
git push -u origin feat/improve-all-git-course-lessons

# Create PR
gh pr create --title "feat: Improve all 14 existing Git course lessons" \
  --body "$(cat <<'EOF'
## Summary

Comprehensive improvement of all 14 existing Git course lessons, adding modern content, visual aids, and best practices.

## Changes

### Visual Enhancements
- ✅ Added diagrams for Git workflows, state transitions, and branch structures
- ✅ Added flowcharts for decision-making (reset vs revert, recovery scenarios)
- ✅ Added architecture diagrams (distributed Git, remote repositories)

### Modern Git Features
- ✅ Added `git restore` and `git switch` (Git 2.23+) as alternatives
- ✅ Explained when to use legacy vs modern commands
- ✅ Updated examples to show both approaches

### Safety & Best Practices
- ✅ Added warning boxes for dangerous operations (reset --hard, force push)
- ✅ Added best practices sections for branching, commits, and workflows
- ✅ Added troubleshooting sections where relevant

### Enhanced Content
- ✅ Expanded practical examples with more scenarios
- ✅ Added exercises at the end of applicable lessons
- ✅ Improved code examples with better explanations
- ✅ Added comparison tables (Git vs other VCS, SSH vs HTTPS)

### New Sections
- ✅ Git data model explanation
- ✅ .git folder structure overview
- ✅ Merge strategies (fast-forward, non-fast-forward)
- ✅ Conflict anatomy and resolution
- ✅ Multiple remotes management
- ✅ Semantic versioning (SemVer)
- ✅ GitHub releases integration

## Impact

These improvements bring the existing 14 lessons up to modern standards (2026), preparing them for the addition of 26 new lessons to complete the 40-lesson roadmap.

## Documentation

See `docs/GIT_COURSE_ROADMAP.md` for complete improvement details.
EOF
)"
```

**Lessons Improved (All 14 in One PR)**:

1. **Lesson 1** (¿Qué es Git?) - Comparison table, distributed VCS diagram, data model
2. **Lesson 2** (Instalar Git) - Verification steps, troubleshooting, update guide
3. **Lesson 3** (Primeros pasos) - Workflow diagram, .git folder, more examples
4. **Lesson 4** (Tres estados) - State transition diagram, more examples, amend clarification
5. **Lesson 8** (Recuperar ficheros) - `git restore`, recovery flowchart, warnings
6. **Lesson 9** (Ramas I) - Branch visualization, best practices
7. **Lesson 10** (Ramas II) - Fast-forward explanation, conflict anatomy, strategies
8. **Lesson 13** (Remotos) - Distributed architecture, multiple remotes, tracking branches
9. **Lesson 14** (GitHub repo) - SSH setup guide, troubleshooting, visibility
10. **Lesson 16** (Clonar) - Fetch vs pull, shallow clones, pull diagram
11. **Lesson 18** (Deshacer commits) - Decision flowchart, visual modes, warnings, reflog
12. **Lesson 31** (Tags) - SemVer, GitHub releases, management practices
13. **Lesson 36** (Aliases Git) - Complex examples, functions, community links
14. **Lesson 37** (Oh My ZSH) - Customization, installation, comparison

**Deliverable**: ONE comprehensive PR with all 14 lessons improved.

**Estimated Time**: 2-3 hours per lesson = ~35-45 hours total (Phase 1.2)

---

### **PHASE 2: Create Missing Core Lessons** 🆕

**Objective**: Fill critical gaps in the course by creating essential missing lessons.

#### Step 2.1: Create Lessons 5-7 (Module 2: Working with Files)

**Lesson 5: Understanding `git status` and `git log`** (NEW)

```bash
git checkout master && git pull
git checkout -b feat/git-lesson-5-status-log

# Create new tutorial file
# File: src/content/tutorials/entendiendo-git-status-log.mdx
# Include: status flags, log formatting, graph visualization

git add src/content/tutorials/entendiendo-git-status-log.mdx
git commit -m "feat(git-course): add lesson 5 - understanding git status and log"
git push -u origin feat/git-lesson-5-status-log
gh pr create --title "feat: Add Git lesson 5 - Understanding git status and log"
```

**Lesson 6: Tracking and Ignoring Files** (NEW)

```bash
git checkout master && git pull
git checkout -b feat/git-lesson-6-gitignore

# Create: src/content/tutorials/rastreando-ignorando-archivos-git.mdx
# Include: .gitignore patterns, global gitignore, .gitattributes

git add src/content/tutorials/rastreando-ignorando-archivos-git.mdx
git commit -m "feat(git-course): add lesson 6 - tracking and ignoring files"
git push -u origin feat/git-lesson-6-gitignore
gh pr create --title "feat: Add Git lesson 6 - Tracking and ignoring files (.gitignore)"
```

**Lesson 7: Understanding File Changes** (NEW)

```bash
git checkout master && git pull
git checkout -b feat/git-lesson-7-git-diff

# Create: src/content/tutorials/entendiendo-cambios-archivos-git-diff.mdx
# Include: git diff variants, difftool, comparing branches

git add src/content/tutorials/entendiendo-cambios-archivos-git-diff.mdx
git commit -m "feat(git-course): add lesson 7 - understanding file changes (git diff)"
git push -u origin feat/git-lesson-7-git-diff
gh pr create --title "feat: Add Git lesson 7 - Understanding file changes (git diff)"
```

---

#### Step 2.2: Create Lessons 11-12 (Module 3: Branching - Advanced)

**Lesson 11: Advanced Branching** (NEW)
**Lesson 12: Stashing Changes** (NEW)

Follow same git workflow pattern as above.

---

#### Step 2.3: Create Lessons 15, 17 (Module 4: Remotes)

**Lesson 15: Working with Remotes** (NEW)
**Lesson 17: Pushing and Fetching** (NEW)

---

#### Step 2.4: Create Lessons 19-22 (Module 5: History Management)

**Lesson 19: Rewriting History with Rebase** (NEW)
**Lesson 20: Interactive Rebase** (NEW)
**Lesson 21: Cherry-Picking Commits** (NEW)
**Lesson 22: Recovering Lost Work (reflog)** (NEW)

---

#### Step 2.5: Create Lessons 23-25 (Module 6: Debugging)

**Lesson 23: Finding Bugs with Git Bisect** (NEW)
**Lesson 24: Blame and History Exploration** (NEW)
**Lesson 25: Resolving Complex Conflicts** (NEW)

**Estimated Time**: ~4 hours per lesson = ~52 hours for 13 new core lessons (Phase 2)

---

### **PHASE 3: Complete Advanced and Modern Topics** 🚀

**Objective**: Create remaining 13 lessons to complete the 40-lesson course.

#### Step 3.1: Create Lessons 26-30 (Module 7: Workflows)

**Lesson 26: Commit Best Practices** (NEW)
**Lesson 27: Branch Naming Conventions** (NEW)
**Lesson 28: Git Flow Workflow** (NEW)
**Lesson 29: GitHub Flow** (NEW)
**Lesson 30: Pull Requests and Code Review** (NEW)

Each follows the same git workflow: feature branch → PR → merge to master.

---

#### Step 3.2: Create Lessons 32-35 (Module 8: Advanced Features)

**Lesson 32: Git Submodules** (NEW)
**Lesson 33: Git Hooks** (NEW)
**Lesson 34: Git Worktrees** (NEW)
**Lesson 35: Git LFS** (NEW)

---

#### Step 3.3: Create Lessons 38-40 (Modules 9-10: Modern Git)

**Lesson 38: Git Configuration and Optimization** (NEW)
**Lesson 39: Modern Git Commands** (NEW)
**Lesson 40: Git in CI/CD Pipelines** (NEW)

**Estimated Time**: ~4 hours per lesson = ~52 hours for final 13 lessons (Phase 3)

---

## 📋 IMPLEMENTATION SUMMARY

### Total Scope

- **Phase 1**: Reorganize + improve 14 existing lessons (~45 hours)
- **Phase 2**: Create 13 core missing lessons (~52 hours)
- **Phase 3**: Create 13 advanced/modern lessons (~52 hours)

**Total estimated time**: ~150 hours of focused work

### Git Workflow Rules

✅ **ALWAYS**:

- Create feature branch from `master` for each change
- One lesson = one PR (atomic changes)
- Run tests before committing: `bun run format && bun run lint && bun run typecheck && bun run test && bun run test:e2e`
- Write clear commit messages following Conventional Commits
- Use `gh pr create` for Pull Requests
- **NEVER commit without explicit user approval**

⚠️ **NEVER**:

- Commit directly to `master` (protected branch)
- Push without user approval
- Skip pre-commit checks
- Make multiple unrelated changes in one PR

### Progress Tracking

Track progress in this roadmap document by updating lesson status:

- 🆕 = Not started
- 🔄 = In progress
- ✅ = Completed and merged

---

## 🎯 NEXT IMMEDIATE ACTION

**Step 1.1**: Create PR to reorder existing 14 lessons.

**Command**:

```bash
git checkout -b refactor/reorder-git-course-lessons
# Update order fields in 8 tutorial files
# Create PR
```

**Awaiting user approval to proceed.**
