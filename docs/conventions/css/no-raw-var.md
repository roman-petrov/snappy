# 🎨 No raw var()

- **id:** `css/no-raw-var`
- **emoji:** 🎨
- **applies:** `**/*.{scss,module.scss}`

## 📐 Norm

Never read CSS custom properties with `var()` in component styles. Don't introduce new component-level CSS custom
properties — prefer SCSS vars and theme tokens.

## 🔍 Detect

Grep for `var(--` and `--` custom props in component SCSS.

## 🔧 Fix

Use theme functions; move shared values into `@snappy/theme`

## 📝 Examples

### ❌ Bad

`color: var(--text);`

### ✅ Good

`color: $text;` from theme / SCSS — not `var()`
