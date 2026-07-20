# ⚛️ View/State state

- **id:** `react/view-state-state`
- **emoji:** ⚛️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

State hook holds all logic. No JSX. No CSS modules. No `t(...)`. Pass-through props via `...rest`. Handlers are
imperatives without `on` prefix (`setText`, `clear`); view wires `onClick={clear}`. Same name in state and return — no
rename in return.

## 🔍 Detect

Find JSX, CSS module imports, `t(`, or `on*` handler names in `*.state.*`.

## 🔧 Fix

Move markup/styles/i18n to view; rename handlers to imperatives

## 📝 Examples

### ❌ Bad

`return { onClear: clear };`

### ✅ Good

`return { clear };`
