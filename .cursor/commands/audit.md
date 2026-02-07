# 🔍 Audit: Rules Compliance

**Goal:** thorough audit of code compliance with project rules. **Result:** detailed report in chat. **Do not modify the
codebase.**

---

## 📋 Algorithm (strict step-by-step)

### 1️⃣ Load rules

- Read all rule files from `.cursor/rules/` (`.mdc`, `.md`).
- For each rule, determine: `globs` (if any) and `alwaysApply`.
- Rules are the single source of truth for the audit.

---

### 2️⃣ Determine scope and file list

- If the user specified a folder or file — audit only that scope.
- Otherwise — cover the entire project (source code, exclude `node_modules`, build output, dependencies).
- Build the full list of files to audit.

---

### 3️⃣ For each file — step-by-step rule check

For **each** file in the list:

1. Determine which rules apply (by globs and `alwaysApply`).
2. Load file contents.
3. Walk through **each applicable rule** in the order they appear in the rule files.
4. For each rule, walk through **each item** (sub-item) in that rule.
5. For each item:
   - Check the code for compliance.
   - If violated: record in the report (file, line/context, rule, item, violation description).

Check **sequentially**: first all items of rule A, then all items of rule B, etc.

---

### 4️⃣ Build the report

- Do **not** save the report to a file — output it in the chat.
- Format: file → list of violations with exact location and description.

---

## 📄 Report format (example)

```text
# Audit Report

## file1.ts

| # | Rule       | Item                    | Location   | Violation                                  |
|---|------------|-------------------------|------------|--------------------------------------------|
| 1 | programming| Minimal parameters      | fn foo     | Receives full User, uses only name         |
| 2 | typescript | Destructure parameters  | bar()      | Uses opts.x instead of ({ x }: Opts)       |

## file2.ts

| # | Rule       | Item                    | Location   | Violation                                  |
|---|------------|-------------------------|------------|--------------------------------------------|
| 1 | typescript | Ternary over multiple   | label()    | Multiple if-return instead of ternary      |

---
Total: 2 files, 3 violations
```

---

## ⚠️ Important

- **Do not modify the codebase** — analysis and report only.
- Use search (grep, codebase search) when it helps find violations.
- Interpret findings against the full rule text, not keywords alone.
- Record every violation: file, rule, item, location, description.

---

## ✅ Cursor checklist

- [ ] Rules loaded
- [ ] Scope and file list determined
- [ ] For each file, all applicable rules checked item by item
- [ ] Report built and output in chat
- [ ] Code **not** modified
