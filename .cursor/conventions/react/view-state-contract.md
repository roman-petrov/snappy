# ⚛️ View/State contract

- **id:** `react/view-state-contract`
- **emoji:** ⚛️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

View props type is `ReturnType<typeof useComponentState>` (not hand-written). Entry renders
`<View {...useComponentState(props)} />`.

## 🔍 Detect

Hand-duplicated view props types; entry not composing state+view.

## 🔧 Fix

Derive view props with `ReturnType`; compose in entry

## 📝 Examples

### ❌ Bad

`type ItemViewProps = { value: string; setValue: (v: string) => void };`

### ✅ Good

`type ItemViewProps = ReturnType<typeof useItemState>;`
