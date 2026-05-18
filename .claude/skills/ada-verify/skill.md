# ada-verify

Check screens for WCAG 2.1 Level AA accessibility compliance using live browser inspection via Playwright MCP. This skill inspects the actual rendered DOM in a real browser, not just the source code.

## Instructions

You are running the ada-verify skill to check a screen for accessibility compliance. Follow these steps:

### 1. Parse Arguments and Determine Target

Extract the screen/route from the arguments or ask the user:

**Accepted inputs:**

- Screen name: `HomeScreen`, `Planner`, `Hotels`
- Route path: `/`, `/planner`, `/hotels/:id`
- Full URL: `http://localhost:5174/planner`

**If no argument provided:** Ask the user which screen they want to check.

**Route mapping (from App.jsx):**

- `/` → HomeScreen
- `/explore` → ExploreScreen
- `/planner` → PlannerScreen
- `/hotels` → HotelsScreen
- `/hotels/:id` → HotelDetailScreen
- `/profile` → ProfileScreen

### 2. Verify Dev Server is Running

Before starting Playwright, check if the dev server is running:

```bash
curl -s http://localhost:5174 > /dev/null && echo "Server running" || echo "Server not running"
```

**If server is not running:**

- Inform the user to start the dev server with `npm run dev`
- Exit the skill

### 3. Open the Screen in Playwright

Use the Playwright MCP `browser_navigate` tool to open the target URL:

```
mcp__playwright__browser_navigate
url: http://localhost:5174/[route]
```

Wait for the page to load and stabilize (2-3 seconds if needed).

### 4. Capture Accessibility Snapshot

Use `browser_snapshot` to get the accessibility tree:

```
mcp__playwright__browser_snapshot
boxes: true
```

This provides:

- Accessible roles
- Labels and names
- Hierarchy
- Element positions

### 5. Check Console for Accessibility Warnings

Use `browser_console_messages` to check for React or browser accessibility warnings:

```
mcp__playwright__browser_console_messages
level: "warning"
all: false
```

Look for warnings about:

- Missing ARIA labels
- Invalid ARIA attributes
- Missing alt text
- Form label issues

### 6. Perform WCAG 2.1 Level AA Compliance Checks

Systematically check the following criteria:

#### A. Perceivable

**1.1 Text Alternatives**

- [ ] All images have alt text (check `<img>` elements)
- [ ] Decorative images have empty alt (`alt=""`)
- [ ] SVG icons have `aria-label` or `aria-hidden="true"` if decorative
- [ ] Complex images have longer descriptions when needed

**1.3 Adaptable**

- [ ] Proper heading hierarchy (h1 → h2 → h3, no skipping)
- [ ] Semantic HTML used (header, nav, main, section, article, footer)
- [ ] Lists use `<ul>`, `<ol>`, `<li>` elements
- [ ] Forms use proper `<label>` elements associated with inputs
- [ ] Tables have `<th>` headers with proper scope

**1.4 Distinguishable**

- [ ] Text has sufficient color contrast (4.5:1 for normal text, 3:1 for large text)
- [ ] Interactive elements visible when focused
- [ ] Text can be resized to 200% without loss of functionality
- [ ] No information conveyed by color alone

#### B. Operable

**2.1 Keyboard Accessible**

- [ ] All interactive elements accessible via keyboard (Tab, Enter, Space)
- [ ] Visible focus indicators on all focusable elements
- [ ] Logical tab order follows visual layout
- [ ] No keyboard traps
- [ ] Skip navigation link available (if applicable)

**2.4 Navigable**

- [ ] Page has a descriptive `<title>`
- [ ] Links have descriptive text (not "click here")
- [ ] Headings describe topic or purpose
- [ ] Focus order is logical
- [ ] Multiple ways to navigate (menu, search, etc.)

**2.5 Input Modalities**

- [ ] Click targets are at least 44×44 pixels
- [ ] Touch targets don't overlap
- [ ] Gestures have keyboard alternatives

#### C. Understandable

**3.1 Readable**

- [ ] Page language is set (`<html lang="en">`)
- [ ] Language changes are marked when content switches language

**3.2 Predictable**

- [ ] Navigation is consistent across screens
- [ ] Components behave consistently
- [ ] No unexpected context changes on focus
- [ ] No unexpected context changes on input

**3.3 Input Assistance**

- [ ] Form fields have labels
- [ ] Error messages are clear and helpful
- [ ] Error prevention for important actions (confirmations)
- [ ] Required fields are indicated

#### D. Robust

**4.1 Compatible**

- [ ] Valid HTML (no duplicate IDs, proper nesting)
- [ ] ARIA roles, states, and properties used correctly
- [ ] Status messages use proper ARIA live regions
- [ ] Custom components have proper ARIA attributes

### 7. Test Interactive Elements

For interactive components, test keyboard navigation:

**Forms:**

- Tab through all fields
- Use Enter to submit
- Use Space to toggle checkboxes/buttons

**Buttons and Links:**

- Tab to focus
- Enter/Space to activate

**Dropdowns/Selects:**

- Tab to focus
- Arrow keys to navigate options
- Enter/Space to select

**Modal Dialogs:**

- Focus trapped within modal when open
- Escape key closes modal
- Focus returns to trigger element on close

Use Playwright's `browser_press_key` to test keyboard interactions:

```
mcp__playwright__browser_press_key
key: "Tab"
```

### 8. Check for Common Accessibility Issues

Look for these specific problems:

**Critical Issues (Must Fix):**

- Images without alt text
- Form inputs without labels
- Buttons without accessible names
- Missing `lang` attribute on `<html>`
- Invalid ARIA attributes
- Insufficient color contrast (below 3:1)
- Keyboard traps

**High Priority Issues (Should Fix):**

- Missing heading structure
- Non-descriptive link text ("click here", "read more")
- Missing focus indicators
- Small touch targets (<44px)
- Non-semantic HTML
- Missing ARIA labels on icon buttons

**Medium Priority Issues (Consider Fixing):**

- Inconsistent navigation patterns
- Missing skip links
- Non-descriptive page titles
- Long blocks of text without headings
- Missing landmark regions

**Low Priority Issues (Nice to Have):**

- Could use more descriptive labels
- Consider adding ARIA descriptions
- Could improve error messages

### 9. Generate Accessibility Report

Create a structured report with the following format:

````markdown
# Accessibility Report: [Screen Name]

**Screen:** [Name] ([URL])
**Date:** [Current Date]
**WCAG Level:** AA
**Status:** [Pass / Fail / Warnings]

## Summary

- ✅ Passed: X checks
- ⚠️ Warnings: Y checks
- ❌ Failed: Z checks

## Critical Issues (Must Fix)

[List critical accessibility violations with details]

### Issue: [Title]

- **Criterion:** WCAG [X.X.X] [Name]
- **Level:** A / AA
- **Impact:** Critical / High / Medium / Low
- **Element:** [Description or selector]
- **Location:** [Where in the UI]
- **Problem:** [What's wrong]
- **Fix:** [How to fix it]
- **Code Example:**

  ```jsx
  // Before (incorrect)
  <button><Icon /></button>

  // After (correct)
  <button aria-label="Close modal"><Icon /></button>
  ```
````

## High Priority Issues (Should Fix)

[Same format as above]

## Medium Priority Issues (Consider Fixing)

[Same format as above]

## Low Priority Issues (Nice to Have)

[Same format as above]

## Passed Checks

- ✅ All images have alt text
- ✅ Proper heading hierarchy
- ✅ Form labels are present
  [etc.]

## Recommendations

1. [General recommendation based on findings]
2. [Specific improvement suggestion]
3. [Best practice to adopt]

## Next Steps

[If issues found:]

- [ ] Fix all critical issues immediately
- [ ] Address high priority issues in next sprint
- [ ] Consider medium priority issues for backlog
- [ ] Review low priority issues as time permits

[If no issues found:]
✅ This screen meets WCAG 2.1 Level AA standards!

```

### 10. Create GitHub Issue (if violations found)

If there are **critical or high priority** accessibility violations, offer to create a GitHub issue:

"I found [X] critical and [Y] high priority accessibility issues. Would you like me to create a GitHub issue to track these fixes?"

If the user agrees, use `mcp__github__create_issue`:

```

mcp**github**create_issue
owner: arvind407
repo: vacation-planner
title: Accessibility violations on [Screen Name] - WCAG 2.1 AA
body: [Include summary from report with critical and high priority issues]
labels: ["accessibility", "a11y", "bug"]

````

**Issue body format:**
```markdown
## Accessibility Violations: [Screen Name]

This screen has accessibility violations that prevent users with disabilities from accessing content. These issues violate WCAG 2.1 Level AA standards.

### Critical Issues (Must Fix)

1. **[Issue Title]**
   - Criterion: WCAG [X.X.X]
   - Impact: [Description]
   - Fix: [How to fix]

[Repeat for each critical issue]

### High Priority Issues (Should Fix)

[Same format]

### Full Report

[Link to or include full report]

### Testing

To verify fixes:
1. Run `/ada-verify [screen-name]`
2. Test with keyboard navigation (Tab, Enter, Escape)
3. Test with screen reader (NVDA, JAWS, VoiceOver)
4. Verify color contrast with browser DevTools

### Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Accessible Components](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
````

### 11. Close Playwright Browser

After completing the audit, close the browser:

```
mcp__playwright__browser_close
```

## Usage Examples

### Example 1: Check a specific screen

```
User: /ada-verify HomeScreen
Assistant: I'll check the HomeScreen for accessibility compliance...
[Runs checks and provides report]
```

### Example 2: Check by route

```
User: /ada-verify /hotels/123
Assistant: I'll check the HotelDetailScreen for accessibility compliance...
[Runs checks and provides report]
```

### Example 3: No argument

```
User: /ada-verify
Assistant: Which screen would you like me to check for accessibility?
- Home (/)
- Explore (/explore)
- Planner (/planner)
- Hotels (/hotels)
- Profile (/profile)
```

## Important Notes

1. **Live Browser Testing:** This skill MUST use Playwright to inspect the live rendered DOM, not just read source files. Many accessibility issues only appear after React renders the component.

2. **Real User Testing:** Automated checks catch ~30-40% of accessibility issues. Manual testing with keyboard, screen readers, and real users is still essential.

3. **Context Matters:** Some WCAG violations may be intentional or acceptable in context. Use judgment and discuss with the team.

4. **Progressive Enhancement:** Not all issues need to be fixed immediately. Prioritize based on impact and user needs.

5. **Screen Reader Testing:** While this skill can detect many issues, it cannot test actual screen reader behavior. Recommend manual testing with:
   - NVDA (Windows)
   - JAWS (Windows)
   - VoiceOver (macOS/iOS)
   - TalkBack (Android)

6. **Color Contrast:** For color contrast checks, note that Playwright doesn't automatically check contrast. You may need to:
   - Note specific color combinations that look suspicious
   - Recommend using browser DevTools or WebAIM contrast checker
   - Flag any light gray text on white backgrounds

7. **Dynamic Content:** For components that change state (modals, dropdowns, etc.), test both states:
   - Default/closed state
   - Active/open state

## Checklist Template

Use this quick checklist when auditing:

- [ ] Server is running
- [ ] Page loaded successfully
- [ ] Captured accessibility snapshot
- [ ] Checked console warnings
- [ ] Images: alt text present
- [ ] Forms: labels associated with inputs
- [ ] Buttons: accessible names
- [ ] Headings: proper hierarchy (h1-h6)
- [ ] Semantic HTML: header, nav, main, footer
- [ ] Keyboard: can tab through all interactive elements
- [ ] Keyboard: visible focus indicators
- [ ] Keyboard: no traps
- [ ] ARIA: roles used correctly
- [ ] ARIA: labels on icon buttons
- [ ] Color: contrast appears sufficient
- [ ] Links: descriptive text
- [ ] Language: lang attribute set
- [ ] Report generated
- [ ] Issues reported to user
- [ ] GitHub issue created (if needed)
- [ ] Browser closed

## Success Criteria

The audit is complete when you have:

1. ✅ Navigated to the target screen
2. ✅ Captured accessibility snapshot
3. ✅ Checked all WCAG 2.1 Level AA criteria
4. ✅ Generated comprehensive report
5. ✅ Created GitHub issue if critical violations found
6. ✅ Closed the browser

Always provide actionable feedback with specific fixes, not just generic "improve accessibility" advice.
