# 🧹 Cleanup: Unused Code and Convention Violations

<!-- cspell:word inlines -->

**Goal:** Find unused code and convention violations, produce a report, then fix only after the user confirms.

**How to run (summary):** Load conventions (groups below) → build file list → scan files in order → **stop on first file
with any violation** → for that file only, run all loaded convention Detect checks using **grep/search (do not rely on
memory)** → build linear report (emoji + where + what + fix) → output and ask; **do not apply fixes until user
confirms.**

---

## 📋 Algorithm (strict step-by-step)

### 1️⃣ Step 1 — Load conventions

- Read `docs/conventions/README.md` for the load protocol and applies filter.
- Load these groups **in order** (skip `agent/` — not an audit checklist):
  1. `unused`
  2. `programming`
  3. `typescript`
  4. `react`
  5. `css`
  6. `testing`
  7. `eslint`
  8. `markdown`
- Do **not** copy convention checklists into this command — the loaded atoms are the only checklist.

---

### 2️⃣ Step 2 — Analyze project patterns

- Determine which patterns the project uses: barrel files, View/State in React, pure vs factory modules, test structure,
  etc.
- Use this to make checks relevant (e.g. only check View/State where the pattern exists).

---

### 3️⃣ Step 3 — Build file list

- If the user specified a **file or folder** together with the command — run the audit for that path only (that file, or
  all files in that folder).
- If no file is specified — **build the list via tools:** use glob/search to get all source files (exclude
  `node_modules`, build output, generated files). Do not rely on "currently open" or "recent" files; use a deterministic
  order (e.g. alphabetical by path), then scan in order until the first file with violations is found.

---

### 4️⃣ Step 4 — Scan with stop-on-first-file

- For **each** file in the list (in order):
  1. Run Detect/Fix from every loaded convention that **applies** to this file, in load order (unused group first, then
     style groups).
  2. **Use tools for detection:** for each atom use `grep` / codebase search (or read file) as described in Detect; do
     not rely on memory or prior context.
  3. If **at least one** violation is found in this file:
     - **Stop** scanning other files.
     - Continue checking **only this file** for **all** applicable conventions.
     - Collect every violation in this file into the report.
  4. If no violation is found — proceed to the next file.

Do **not** continue to the next file after finding the first file with violations; focus only on that one file and
complete the full list of its violations. Do not skip a check because the file "looks clean."

---

### 5️⃣ Step 5 — Build report and fix plan

- **Load the file:** read the full contents of the file that has violations (so fixes are consistent with current code).
- Compose a **user-facing report** as a single linear list of violations. Do **not** list or enumerate convention ids in
  the report.
- For **each** violation include:
  - **Emoji** — the atom’s `emoji` field (see `docs/conventions/README.md`).
  - **Where** — file path and location (e.g. line, symbol name).
  - **What is violated** — short description of the problem (no convention id).
  - **What will be fixed** — short, actionable fix (what will be done).

---

### 6️⃣ Step 6 — Output and ask

- Emit the full report in the chat (linear list only).
- Ask the user whether to apply the fixes ("Apply these fixes?").
- Do **not** change the codebase until the user confirms.

---

## 📄 Report format (mandatory)

**Present the report as a single linear list of violations. Use lists only (no tables). Do not list or cite convention
ids. Each list item MUST start with the `emoji` field of the atom that produced the finding.**

**Each item:** emoji + where + what violated + what will be fixed.

**Example:**  
`🗑️`**`src/Button.module.scss:12`** — Unused class `.oldButton` never referenced. → Remove selector and its rule block.

At the end of the report, offer the user to fix all problems ("Apply these fixes?").
