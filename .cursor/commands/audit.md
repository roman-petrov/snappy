# 🔍 Audit: rules compliance

1. **📂 Load rules** Read all rule files in `.cursor/rules/` (`.mdc` / `.md`). Treat them as the single source of truth
   for this audit.

2. **🔎 Audit** For the whole workspace (or the scope the user chose):
   - Go through the project systematically (e.g. by folder or by file type).
   - For each file, check compliance with every rule that applies to it (by globs and `alwaysApply`).
   - Use search where it helps to spot possible violations; always interpret findings against the full rule text, not
     keywords alone.
   - Record every violation: file, location, rule, and required fix.

3. **🔧 Fix** Apply fixes for all recorded violations. One logical change per edit when possible. After edits, run the
   project checks (e.g. via MCP or scripts) if available and fix any issues they report.

4. **📌 Scope** If the user selected a folder or file, limit the audit and fixes to that scope; otherwise cover the
   entire project.

Use the rules you read from `.cursor/rules/` as the only reference.
