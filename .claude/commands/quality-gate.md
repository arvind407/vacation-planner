# quality-gate

Run comprehensive quality checks before merging a pull request. This command performs formatting, code review, test generation, and accessibility verification on all staged files.

## Instructions

You are running the quality gate check. This is a critical workflow that must be completed before any code is merged. Follow these steps sequentially and stop if any high-severity issues are found.

### Setup

Create a tracking structure to record results:

```javascript
const results = {
  formatCode: { status: 'pending', issues: 0, githubIssues: 0 },
  reviewComponent: { status: 'pending', issues: 0, githubIssues: 0 },
  buildTests: { status: 'pending', issues: 0, githubIssues: 0 },
  adaVerify: { status: 'pending', issues: 0, githubIssues: 0 }
}
```

### Step 1: Get Staged Files

Run git command to get all staged files:

```bash
git diff --cached --name-only
```

**If no files are staged:**
- Report: "❌ Quality Gate Failed: No files are staged for commit."
- Exit the quality gate
- Do NOT proceed with any checks

**If files are staged:**
- Parse the output to get a list of files
- Filter for `.js` and `.jsx` files for component review
- Store the list for use in subsequent steps

### Step 2: Format Code

Run the format-code skill on all staged files:

```
/format-code staged
```

**Wait for the skill to complete.** Analyze the output:

- **Success criteria:** No linting errors remain that require manual fixes
- **Failure criteria:** ESLint reports errors that couldn't be auto-fixed

**If formatting fails:**
- Set `results.formatCode.status = 'failed'`
- Count and record the number of issues in `results.formatCode.issues`
- **STOP the quality gate** and report:
  ```
  ❌ Quality Gate Failed at Step 2: Format Code

  Reason: [X] files have linting errors that require manual fixes

  Fix these issues before running the quality gate again.
  ```
- Generate summary table (see below) and exit

**If formatting succeeds:**
- Set `results.formatCode.status = 'passed'`
- Continue to next step

### Step 3: Review Components

For each `.js` or `.jsx` file in the staged files list, run the review-component skill:

```
/review-component [file-path]
```

**Wait for each review to complete.** Analyze the output for each file:

- **High severity issues:** Critical problems, security vulnerabilities, performance issues, accessibility violations
- **Medium/Low severity issues:** Code style suggestions, minor improvements

**Track results:**
- Count total issues found across all files
- Count how many GitHub issues were created
- If ANY file has **High severity issues**:
  - Set `results.reviewComponent.status = 'failed'`
  - Record total issues in `results.reviewComponent.issues`
  - Record GitHub issues created in `results.reviewComponent.githubIssues`
  - **STOP the quality gate** and report:
    ```
    ❌ Quality Gate Failed at Step 3: Review Component

    Reason: High severity issues found in the following files:
    - [file1.jsx]: [issue description]
    - [file2.jsx]: [issue description]

    GitHub issues created: [X]

    Fix these issues before running the quality gate again.
    ```
  - Generate summary table (see below) and exit

**If all reviews pass or only have Medium/Low issues:**
- Set `results.reviewComponent.status = 'passed'`
- Record total issues and GitHub issues created
- Continue to next step

### Step 4: Build Tests

For each `.js` or `.jsx` file in the staged files list, run the build-tests skill:

```
/build-tests [file-path]
```

**Wait for each test generation to complete.** Analyze the output:

- **Success criteria:** Test file was generated and is runnable
- **Failure criteria:** Test generation failed, tests don't compile, or critical test cases are missing

**Track results:**
- Count how many test files were generated
- If ANY test generation fails:
  - Set `results.buildTests.status = 'failed'`
  - Record issues in `results.buildTests.issues`
  - **STOP the quality gate** and report:
    ```
    ❌ Quality Gate Failed at Step 4: Build Tests

    Reason: Test generation failed for the following files:
    - [file1.jsx]: [error description]
    - [file2.jsx]: [error description]

    Fix these issues before running the quality gate again.
    ```
  - Generate summary table (see below) and exit

**If all test generation succeeds:**
- Set `results.buildTests.status = 'passed'`
- Record number of test files generated in `results.buildTests.issues` (0 means all succeeded)
- Continue to next step

### Step 5: Accessibility Verification

Run the ada-verify skill with NO arguments to prompt for screen selection:

```
/ada-verify
```

**Important:** Since no argument is provided, the skill will ask which screen to check. You should check ALL screens that might be affected by the staged changes:

- Home (/)
- Explore (/explore)
- Planner (/planner)
- Hotels (/hotels)
- Profile (/profile)

**For each screen affected by staged changes, run:**

```
/ada-verify [screen-name]
```

**Wait for each verification to complete.** Analyze the output:

- **Critical issues:** Missing alt text, form labels, ARIA violations, keyboard accessibility issues
- **High priority issues:** Missing semantic HTML, focus indicators, state announcements
- **Medium/Low priority issues:** Skip links, page titles, minor improvements

**Track results:**
- Count total accessibility violations across all screens
- Count how many GitHub issues were created
- If ANY screen has **Critical or High Priority accessibility issues**:
  - Set `results.adaVerify.status = 'failed'`
  - Record total issues in `results.adaVerify.issues`
  - Record GitHub issues created in `results.adaVerify.githubIssues`
  - **STOP the quality gate** and report:
    ```
    ❌ Quality Gate Failed at Step 5: Accessibility Verification

    Reason: Critical/High priority accessibility issues found on the following screens:
    - [Screen1]: [X] critical, [Y] high priority issues
    - [Screen2]: [X] critical, [Y] high priority issues

    GitHub issues created: [X]

    Fix these issues before running the quality gate again.
    ```
  - Generate summary table (see below) and exit

**If all screens pass or only have Medium/Low issues:**
- Set `results.adaVerify.status = 'passed'`
- Record total issues and GitHub issues created
- Continue to final summary

### Step 6: Generate Summary Table

After all steps complete (whether passed or failed), generate a summary table:

```markdown
## Quality Gate Summary

| Skill             | Status | Issues Found | GitHub Issues Created |
|-------------------|--------|--------------|----------------------|
| Format Code       | [✅/❌] | [X]          | [X]                  |
| Review Component  | [✅/❌] | [X]          | [X]                  |
| Build Tests       | [✅/❌] | [X]          | [X]                  |
| Ada Verify        | [✅/❌] | [X]          | [X]                  |

**Overall Status:** [✅ PASSED / ❌ FAILED]

[If passed:]
✅ All quality checks passed! This code is ready to merge.

[If failed:]
❌ Quality gate failed. Please fix the issues above and run `/quality-gate` again.
```

### Important Notes

1. **Sequential Execution:** Each step must complete before moving to the next
2. **Stop on High Severity:** If ANY step finds high severity issues, STOP immediately
3. **Track Everything:** Keep count of all issues and GitHub issues created
4. **Clear Reporting:** Make it obvious which step failed and why
5. **No Guessing:** If a skill's output is unclear, ask the user to clarify or re-run
6. **Staged Files Only:** Only check files that are currently staged for commit

### Exit Codes

- **Quality Gate Passed:** All checks completed successfully with no high severity issues
- **Quality Gate Failed - Step X:** Failed at step X with high severity issues (stop immediately)
- **Quality Gate Aborted:** No staged files or user requested cancellation

### Example Output

```
🚀 Running Quality Gate Checks...

Step 1: Getting staged files...
✅ Found 3 staged files: HomeScreen.jsx, Navbar.jsx, useTrips.js

Step 2: Formatting code...
✅ All files formatted successfully

Step 3: Reviewing components...
  - Reviewing HomeScreen.jsx... ✅ Passed (2 low priority issues)
  - Reviewing Navbar.jsx... ✅ Passed (0 issues)
  - Reviewing useTrips.js... ✅ Passed (1 medium priority issue)
✅ Component reviews passed

Step 4: Building tests...
  - Building tests for HomeScreen.jsx... ✅ Generated HomeScreen.test.jsx
  - Building tests for Navbar.jsx... ✅ Generated Navbar.test.jsx
  - Building tests for useTrips.js... ✅ Generated useTrips.test.js
✅ All tests generated successfully

Step 5: Verifying accessibility...
  - Checking HomeScreen... ✅ Passed (3 medium priority issues)
✅ Accessibility verification passed

## Quality Gate Summary

| Skill             | Status | Issues Found | GitHub Issues Created |
|-------------------|--------|--------------|----------------------|
| Format Code       | ✅     | 0            | 0                    |
| Review Component  | ✅     | 3            | 0                    |
| Build Tests       | ✅     | 0            | 0                    |
| Ada Verify        | ✅     | 3            | 0                    |

**Overall Status:** ✅ PASSED

✅ All quality checks passed! This code is ready to merge.
```

## Usage

```bash
# Make sure you have staged files first
git add src/screens/HomeScreen.jsx

# Run the quality gate
/quality-gate
```

**Before merging any PR, always run `/quality-gate` to ensure code quality and accessibility standards.**
