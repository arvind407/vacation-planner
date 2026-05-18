# format-code

Automatically format code using Prettier and fix linting issues with ESLint. Works on individual files or all recently changed files.

## Instructions

You are running the format-code skill to automatically format and fix code. Follow these steps:

### 1. Determine Target Files

Extract file path(s) from $ARGUMENTS:

- **If specific file(s) provided**: Use those exact paths
- **If no arguments provided**: Find recently changed files using git:
  ```bash
  git diff --name-only HEAD
  git diff --cached --name-only
  git ls-files --others --exclude-standard
  ```
  Combine all results (staged, unstaged, and untracked files) and filter for files that exist in the repository.

### 2. Run Prettier (All File Types)

For each target file, run Prettier with auto-fix:

```bash
npx prettier --write <file-path>
```

Prettier handles:
- JavaScript (.js, .jsx)
- TypeScript (.ts, .tsx)
- CSS (.css)
- JSON (.json)
- Markdown (.md)
- HTML (.html)

**Capture output**: Note which files were formatted vs. unchanged.

### 3. Run ESLint (JS/JSX Files Only)

For JavaScript and JSX files only, run ESLint with auto-fix:

```bash
npx eslint --fix <file-path>
```

**Capture output**: Parse ESLint output to identify:
- Auto-fixed issues (warnings/errors that were fixed)
- Remaining issues (warnings/errors that need manual attention)

### 4. Compile Results

Create a summary report with three sections:

#### ✅ Successfully Formatted
List files that were formatted by Prettier:
```
✅ Successfully Formatted:
  - src/components/Button.jsx
  - src/screens/HomeScreen.jsx
  - styles/main.css
```

#### 🔧 Auto-Fixed Issues
List ESLint issues that were automatically fixed:
```
🔧 Auto-Fixed Issues:
  src/components/Button.jsx:
    - Line 12: Missing semicolon (semi)
    - Line 25: Unnecessary else after return (no-else-return)
```

#### ⚠️ Manual Attention Required
List ESLint issues that need manual fixes:
```
⚠️ Manual Attention Required:
  src/screens/HomeScreen.jsx:
    - Line 45: 'fetchData' is missing in useEffect dependency array (react-hooks/exhaustive-deps)
    - Line 78: Unexpected console statement (no-console)
```

### 5. Present Results to User

Show the complete summary report with:
1. Total files processed
2. Files formatted by Prettier
3. Number of issues auto-fixed by ESLint
4. Number of issues requiring manual attention
5. If manual issues exist, provide the file paths with line numbers for easy navigation

Example output:
```
📝 Format Code Results

Processed 5 files

✅ Successfully Formatted (5 files):
  - src/components/Button.jsx
  - src/components/Card.jsx
  - src/screens/HomeScreen.jsx
  - src/hooks/useDestinations.js
  - styles/main.css

🔧 Auto-Fixed Issues (3 issues):
  src/components/Button.jsx:12 - Missing semicolon
  src/components/Button.jsx:25 - Unnecessary else after return

⚠️ Manual Attention Required (2 issues):
  src/screens/HomeScreen.jsx:45 - Missing dependency in useEffect
  src/screens/HomeScreen.jsx:78 - Unexpected console statement

All files have been formatted! 2 issues need manual review.
```

### 6. Error Handling

If Prettier or ESLint commands fail:
- Check if the tools are installed (run `npm list prettier eslint` to verify)
- If not installed, inform the user to run: `npm install`
- If a file doesn't exist, skip it and note it in the report
- If ESLint config is missing, skip ESLint and only run Prettier

### Important Notes

- **Run commands sequentially, not in parallel**: Prettier first, then ESLint
- **Always run Prettier on all file types**: Don't skip non-JS files
- **Only run ESLint on .js and .jsx files**: Skip other file types for ESLint
- **Use --write flag for Prettier**: This modifies files in place
- **Use --fix flag for ESLint**: This auto-fixes what it can
- **Parse ESLint JSON output for better reporting**: Use `--format json` for structured output
- **No need to ask for confirmation**: The skill auto-fixes by design
- **Report file paths with line numbers**: Use format `file.js:line` for easy IDE navigation
