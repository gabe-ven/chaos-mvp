# Branch Naming Conventions

To maintain consistency across the project, please follow these branch naming conventions:

## Format

```
<type>/<short-description>
```

## Types

- **feature/** - New features or enhancements
  - Example: `feature/add-memory-leak-test`
  - Example: `feature/sentry-integration`

- **fix/** - Bug fixes
  - Example: `fix/latency-test-timeout`
  - Example: `fix/score-calculation-error`

- **hotfix/** - Urgent production fixes
  - Example: `hotfix/api-crash`
  - Example: `hotfix/security-vulnerability`

- **docs/** - Documentation changes
  - Example: `docs/update-readme`
  - Example: `docs/add-api-examples`

- **refactor/** - Code refactoring without changing functionality
  - Example: `refactor/cleanup-chaos-tests`
  - Example: `refactor/extract-utility-functions`

- **test/** - Adding or updating tests
  - Example: `test/add-report-builder-tests`
  - Example: `test/improve-coverage`

- **chore/** - Maintenance tasks, dependency updates
  - Example: `chore/update-dependencies`
  - Example: `chore/configure-ci`

- **perf/** - Performance improvements
  - Example: `perf/optimize-test-execution`
  - Example: `perf/reduce-api-latency`

## Guidelines

1. **Use lowercase** - All branch names should be lowercase
2. **Use hyphens** - Separate words with hyphens, not underscores or spaces
3. **Be descriptive** - Name should clearly indicate what the branch does
4. **Keep it short** - Aim for 2-5 words in the description
5. **Include ticket numbers** - If using issue tracking: `feature/123-add-cpu-test`

## Examples

✅ **Good:**
- `feature/add-cascading-failure-test`
- `fix/sentry-initialization-error`
- `docs/update-quickstart-guide`
- `refactor/chaos-test-structure`
- `test/add-integration-tests`

❌ **Bad:**
- `NewFeature` (not descriptive, wrong case)
- `fix_bug` (use hyphens, not underscores)
- `test` (too vague)
- `feature/this-is-a-very-long-branch-name-that-explains-everything-in-detail` (too long)

## Main Branches

- **main** - Production-ready code
- **develop** - Development integration branch (optional)

## Workflow

1. Create a new branch from `main` (or `develop`)
2. Name your branch following the conventions above
3. Make your changes and commit regularly
4. Push your branch and create a Pull Request
5. After review and approval, merge to main
6. Delete the feature branch after merge

## Questions?

If you're unsure about naming, ask in the PR or check existing branches for examples!

