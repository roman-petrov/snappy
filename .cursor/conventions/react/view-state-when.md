# ⚛️ View/State when to use

- **id:** `react/view-state-when`
- **emoji:** ⚛️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Use entry/state/view when the component has logic/state (hooks, derived values, handlers, conditionals) and the state
hook uses the component's props. Skip when trivial/presentational or when state would not use props — keep a single
file.

## 🔍 Detect

Check whether a split exists or is missing relative to logic complexity.

## 🔧 Fix

Split or keep single file accordingly

## 📝 Examples

### ❌ Bad

Split View/State for a pure `<span>{text}</span>`

### ✅ Good

One file when there is no logic/state
