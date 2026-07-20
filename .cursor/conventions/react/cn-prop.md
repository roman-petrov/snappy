# ⚛️ cn prop

- **id:** `react/cn-prop`
- **emoji:** ⚛️
- **applies:** `**/*.{ts,tsx}`

## 📐 Norm

For component props use `cn` (not `className`). Compose with `_.cn(...)`.

## 🔍 Detect

Find public `className` props on project components; find manual class string concat.

## 🔧 Fix

Rename to `cn`; use `_.cn(...)`

## 📝 Examples

### ❌ Bad

`type ItemProps = { className?: string };`

### ✅ Good

`type ItemProps = { cn?: string };`
