# ⚛️ View/State view

- **id:** `react/view-state-view`
- **emoji:** ⚛️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

View: receive props, render JSX only. No hooks. No business conditionals/computed values/class-name building. `t(...)`
and CSS modules only in the view when it does not make the code much harder.

## 🔍 Detect

Find hooks/logic in `*.view.*`; CSS modules / `t(` outside view.

## 🔧 Fix

Move logic to state; keep i18n/styles in view

## 📝 Examples

### ❌ Bad

```tsx
const label = active ? "On" : "Off";
return <span>{label}</span>;
```

### ✅ Good

```tsx
export const ItemView = ({ label }: ItemViewProps) => <span>{label}</span>;
```
