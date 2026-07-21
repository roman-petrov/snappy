<!-- cspell:word typecheckers oneline lockfiles dedupe Чеклист -->

# 🔍 Review

**Mode:** Plan mode only (`SwitchMode` → `plan` if needed). Analysis only — no edits, no linters/typecheckers/tests.
Deliverable: hierarchical report → user picks what to fix → **`CreatePlan`** (Russian). No CreatePlan before the user
answers.

**Flow:** load `docs/review/**/*.md` → menu → wait → git scope → file list → context pack → parallel `Task` agents →
merge → report → **stop** → user choice → load conventions → `CreatePlan`.

---

## 📄 Agent docs

Glob `docs/review/**/*.md`, skip `README.md`, sort lex. Menu `N` = index; H1 = label. New agent = new `NN-kebab.md`.

```markdown
# <emoji> <Title>

- **id:** `kebab-name`
- **emoji:** <same as H1>
- **severity:** `must-fix` | `optional-cleanup`

## 🎯 Scope

## 🔍 Look for

## 🔎 Detect

## 🔧 Fix

## 📐 Conventions
```

English; fixed headings only. Link conventions — no atom paste. Finding emoji: doc `emoji`, or atom `emoji` for atom
hits. Shared constraints / output / merge / plan — only in this file.

---

## 📋 Algorithm

### 1 — Menu

Read all agent docs. Show:

```text
Каких агентов запустить? (номера через запятую, или all)
N. <H1>
```

Accept `N` / list / `all`. Empty, unknown numbers, or refuse → ask again (refuse to run any → **stop**, no review).

### 2 — Scope

**Feature branch** (not `main`/`master`): base = `merge-base` with `main`, else `master`. Collect `diff --name-status`,
full `diff`, `log --oneline` for `<base>...HEAD`. Empty → stop.

**On `main`/`master`:** latest commit only (`HEAD~1..HEAD`; root → `diff-tree` / `git show`). Empty → stop.

If the user named a **file or folder with the `/review` invocation**, keep only paths under that filter inside the diff.
Neither base exists → ask; do not guess. Merge-commit HEAD on base → diff vs first parent; note in резюме.

### 3 — File list

Added/modified from diff; deletes only if they may break external callers. Exclude: CSS-module `*.d.ts`, Prisma
`generated/`, lockfiles. Sort A–Z.

### 4 — Context pack

Root, branch, scope label, git commands (name-status + patch + log), file list, path filter if any. Omit huge patches;
subagents re-run the git commands.

### 5 — Agents

One parallel `Task` (`explore`, very thorough) per selected doc. Prompt = context pack + absolute path to that doc
(«read and follow in full») + constraints + output schema. Await all. Failure → retry once; still failing → note in
резюме, continue.

**Constraints:** no edits; no eslint/tsc/Vitest/Knip/Stylelint/`bun do`; no live app; only this mechanic; only scoped
changes; reason from code/call sites/types.

**Output schema:**

```text
## Category: <id>
## Findings
- <emoji> `path:line` — problem → fix
## Notes
- none
```

No findings → `- none`. Uncertain → Notes only (not Findings).

### 6 — Merge / risk

Dedupe same path/symbol + same issue → one finding. Prefer higher severity (`must-fix` > `optional-cleanup`); if equal,
keep the one from the **lower menu N** and show it only under that `N` in the report. Risk: 🔴 any must-fix, 🟡 only
optional, 🟢 none. Unconfirmed Notes: drop, or list under резюме as неподтверждённые. No atom ids/bodies in Находки.

### 7 — Report (stop)

Russian chat report (not CreatePlan):

1. **Краткое резюме** — scope, files, risk, failed agents
2. Per selected doc (menu `N`):

```text
N. <H1>
  N.1 <emoji> `path:line` — problem → fix
```

Empty agent → `нет`. Ask what to include in the plan (free-form: `N.M`, ranges, «все», «только must-fix», …). **Stop.**

### 8 — CreatePlan (after user choice)

Parse the answer against the report numbers. Unclear → ask again. Explicit decline / nothing to fix → CreatePlan with
`Исправления не требуются` (and todo `no-fixes-needed`). Otherwise only the chosen items.

Load `docs/conventions/README.md`, then groups in order: `agent`, `unused`, `programming`, `typescript`, `react`, `css`,
`testing`, `eslint`, `markdown`. Drop any remaining `simplify` item whose fix would violate an applicable atom. Prefer
small/simple fixes; no convention ids in Находки; no atom paste.

Call `CreatePlan`:

- **name:** `План исправлений по review`
- **overview / plan / todos:** Russian
- **plan** (lists only): **Краткое резюме** → **Находки** (`N`/`N.M`, or `- нет`) → **План исправлений** → **Чеклист
  завершения**
- Steps: file + place + exact change + why; must-fix first then optional; one concern; no soft hedges. Subsections
  **Обязательные (must-fix)** / **Опциональная зачистка** when both exist; else one list from `1`. None →
  `Исправления не требуются.`
- Todos: one per step

**Чеклист завершения** — copy verbatim:

- [ ] Все шаги **Обязательные (must-fix)** выполнены (N/A — таких шагов не было)
- [ ] Все шаги **Опциональная зачистка** выполнены (N/A — таких шагов не было; либо пользователь в этом чате явно
      отказался от опциональной зачистки)
- [ ] Diff содержит только изменения из шагов плана — без посторонних правок
- [ ] Правки упрощают код или устраняют реальную проблему / нарушение conventions; нет лишних абстракций, обёрток и
      файлов «на вырост»
- [ ] Для каждого файла, изменённого при выполнении плана, прогнаны Detect-проверки всех применимых atoms из групп
      `unused`, `programming`, `typescript`, `react`, `css`, `testing`, `eslint`, `markdown` (фильтр `applies`)
- [ ] Scope правок соответствует `agent/surgical-changes`, `agent/simplicity-first`, `agent/goal-driven`
- [ ] После выполнения шагов плана прогнан check-workflow через MCP `project-0-snappy-do` / `workflow_run` (N/A — шагов
      плана не было: `Исправления не требуются`)
- [ ] В изменённом коде нет TODO/заглушек, не закрытых отдельным шагом плана

After CreatePlan: no implementation here. Lint/tests later via `workflow_run`.
