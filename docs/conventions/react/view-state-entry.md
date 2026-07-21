# ⚛️ View/State entry

- **id:** `react/view-state-entry`
- **emoji:** ⚛️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

Entry (`ComponentName.tsx`): props type, call state hook, render view. No layout JSX, no logic, no hooks beyond the
state hook composition.

## 🔍 Detect

Entry files with layout JSX, conditionals, or extra logic.

## 🔧 Fix

Move layout/logic to view/state

## 📝 Examples

### ❌ Bad

Logic + JSX in `Item.tsx`

### ✅ Good

`export const Item = (props: ItemProps) => <ItemView {...useItemState(props)} />;`
