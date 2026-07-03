---
name: responsible-code-changes
description: Use this skill when making code changes in an existing repository, especially open-source projects. It ensures the code follows the repository's existing style, avoids unnecessary changes, adds no comments, and includes a clear explanation of what was done and why.
---
# Skill: Responsible AI-Assisted Code Changes for Existing Repositories

## Purpose

Use this skill whenever working on an existing codebase, especially open-source repositories with established maintainers, architecture, conventions, review expectations, and contributor workflows.

The objective is to help produce repository-native code that solves the reported issue with the smallest reasonable change. The implementation should match the project's existing patterns rather than introducing generic AI-generated solutions.

Treat all generated code as a draft that must be adapted to the repository.

The goal is not to generate large amounts of code. The goal is to make focused, maintainable, review-friendly changes that fit naturally into the codebase.

---

# Contributor Responsibilities

Before making any code changes:

1. Understand the issue completely.
2. Identify the actual problem being reported.
3. Inspect relevant files and execution paths.
4. Search for existing implementations of similar behavior.
5. Review repository conventions before introducing new code.
6. Determine whether the change is a bug fix, feature addition, refactor, documentation update, or test update.
7. Review repository guidance when available.
8. Ask for clarification when requirements are ambiguous.
9. Do not assume the first solution is correct. 
10. Reason through the codebase before modifying anything. 


---

# Repository-First Development

Always prioritize repository conventions over generic best practices.

Match existing patterns for naming, structure, error handling, logging, validation, async handling, testing, imports, formatting, linting, and abstraction levels.

If the repository already has a pattern for solving a problem, follow that pattern.

---

# Change Scope

Make the smallest reasonable change that solves the issue.

Avoid unrelated refactors, rewrites, formatting-only changes, unnecessary renaming, dependency updates, broad cleanup work,Public API changes without need,Touching unrelated files,Mixing multiple concerns into one change or future-proof abstractions.

If unrelated problems are discovered, mention them separately instead of fixing them in the same patch.

---

# Open-Source Contribution Standards

Work like a careful contributor.
Respect maintainers' review time. 

Changes should be focused, low-risk, easy to review, and directly related to the reported issue.

When multiple solutions are possible, prefer the solution that: 
1. Solves the issue directly. 
2. Requires the smallest change. 
3. Reuses existing patterns. 
4. Avoids new dependencies. 
5. Is easy to test. 
6. Is easy to review. 
7. Minimizes risk of regressions
---

# Dependency Rules

Dependency Rules

Do not add a dependency unless there is a strong reason.

Before adding a dependency:

1. Check whether the repository already contains a utility.
2. Check whether the language or framework provides a built-in solution.
3. Consider whether a small local implementation is sufficient.
4. Consider:Bundle size,Maintenance cost,Security,implications,Project conventions

Prefer existing repository tools over new packages.

If a dependency is added, explain:

What was added
Why it was needed
Alternatives considered
Why alternatives were not used
Impact on maintenance, runtime, security, or build size
---

# Natural Repository-Fitting Code

The goal is not to hide AI usage.

The goal is to make code fit naturally within the repository.

Avoid common AI-generated patterns such as:

1. Overly generic comments
2. Unnecessary abstractions
3. Excessive helper functions
4. Large rewrites for small issues
5. Generic naming
6. Over-engineered solutions
7. New files when an existing file is appropriate
8. Unnecessary configuration changes
9. Broad error handling inconsistent with the project
10. Generic textbook-style structures
11. Implementing behavior that was not requested

The code should look like it was written by someone who studied the repository

---

# Handling Ambiguity

If the issue is unclear, do not guess silently.
Ask for clarification when needed.
If there are multiple valid solutions, explain the options briefly and recommend the one that best fits the repository.
When choosing between approaches, prefer the option that:
- Solves the issue directly.
- Requires the smallest reasonable change.
- Follows existing repo patterns.
- Avoids new dependencies.
- Is easy to test.
- Is easy for maintainers to review.
- Has the lowest risk of breaking existing behavior.

---

# Humanized Code Standards

When writing or modifying code, make it fit naturally with the nearby code.
Use the same style as the existing repo, even if another style might look cleaner in isolation.
Concrete matching rules:
- If nearby code uses short helper functions, use short helper functions.
- If nearby code keeps logic inline, avoid extracting unnecessary helpers.
- If nearby code uses explicit conditionals, do not replace everything with clever one-liners.
- If nearby code uses existing utility functions, prefer those utilities.
- If nearby code uses a certain naming pattern, follow that naming pattern.
- If nearby tests are written in a certain structure, follow that structure.
The change should not look like a separate coding style was dropped into the project.
The goal is to make the patch easy for maintainers to review because it looks and behaves like the rest of the project.

---

# Avoid Generic AI Output Phrases

The explanation should not sound generic or robotic.
Avoid vague phrases such as:
- "This improves the overall functionality."
- "This enhances robustness."
- "This ensures seamless integration."
- "This optimizes the user experience."
- "This makes the code more efficient and scalable."
Use specific explanations instead.
Bad explanation:
Updated the logic to improve validation and enhance maintainability.
Better explanation:
Added a duplicate-name check before saving the workspace so the create flow now matches the existing update flow. This reuses the same validation helper already used in workspace settings.
Be specific about what changed and why.

# Comment Policy

Do not generate any comments in the code. No filler comments, no explanatory comments, nothing, unless the user explicitly asks for them.
All explanations belong in the final response to the user, not inside the code itself.
If an existing comment must be removed or modified because the code it describes was changed, mention that in the explanation but do not add new comments.

---

# Testing Requirements

When the repository contains tests for the affected area:

1. Add or update tests.
2. Match the existing testing style.
3. Verify important behavior.
4. Cover relevant edge cases.

Do not introduce a new testing pattern unless necessary.

If no tests are added, explain why.

Possible reasons include:

1. No test infrastructure exists for the affected area.
2. The change is documentation-only.
3. Existing tests already cover the behavior.
4. Additional tests are not justified for the scope of the change.

Never skip test discussion silently.
---

# Required Post-Change Explanation

After making changes, explain the work clearly so the user can review it and create the pull request independently.
Include the following sections:
### 1. What I Changed
Explain the issue addressed and the implemented solution in plain language.
### 2. Files Changed
List every modified file and describe what changed in each.
### 3. Why This Approach
Explain why the selected solution fits the issue and the repository.
### 4. Existing Repository Patterns Followed
Identify the specific project conventions and patterns reused.
### 5. Functions, Helpers, or Dependencies Used
Explain:
1. What was used
2. Why it was used
3. How it fits the codebase

### 6. Alternatives Considered

Explain alternative approaches and why they were not chosen.

### Why Other Functions, Helpers, or Dependencies Were Not Used

Explain why existing alternatives were unsuitable or unnecessary.

### Code Walkthrough

Explain important logic and design decisions, including:

- Why conditions were added
- Why values are normalized
- Why early returns exist
- Why helpers were reused or created
- Why code was placed in a specific location
- How data flows through the implementation
- Edge cases handled
- Assumptions made
- Potential failure points if assumptions are incorrect

The user should understand the implementation well enough to answer maintainer questions.

### Tests

Explain:

1. What tests were added or modified
2. What behavior they verify
3. Why coverage is sufficient
4. Cases considered but not tested
5. Any manual verification performed

### Verification Steps

List repository-appropriate commands such as:

npm test
npm run lint
npm run typecheck
pnpm test
pnpm lint
pytest
go test ./...
cargo test

Only suggest commands that actually apply to the repository.
Never claim tests passed unless they were run.

### Risks and Assumptions
Document:
- Remaining risks
- Assumptions
- Known limitations
- Potential edge cases

---

# Quality Checklist

- The issue is directly addressed.
- The diff is focused.
- Repository patterns are followed.
- Naming matches surrounding code.
- No unnecessary abstractions were added.
- No unnecessary dependencies were added.
- Existing helpers were reused where appropriate.
- Tests were updated when appropriate.
- Edge cases were considered.
- Verification steps are provided.
- Design decisions are explained.
- Alternatives are explained.
- Dependency decisions are explained.
- The implementation can be defended during code review.
- It should feel like a natural contribution to the repository, like a good open source contributor has done it, because it follows the existing codebase, solves the issue directly, avoids unnecessary changes, and includes a clear explanation of what was done and why.
- No comments were generated in the code unless explicitly requested.
- No generic AI-style output phrases were used in the explanation.
- Humanized code standards were followed to match surrounding code style.
- Ambiguity was handled by asking for clarification when needed.
- Post-change explanation sections are clearly separated with proper headers.

---

# Final Principle
Behave like a careful open-source contributor.
Prefer:

- Clarity over cleverness
- Consistency over novelty
- Small patches over rewrites
- Existing repository patterns over new ideas

The final result should feel like a natural contribution to the repository, not a generic AI-generated patch.
