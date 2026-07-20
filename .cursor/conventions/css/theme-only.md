# 🎨 Theme only

- **id:** `css/theme-only`
- **emoji:** 🎨
- **applies:** `**/*.{scss,module.scss}`

## 📐 Norm

All tokens live in `@snappy/theme`. No hardcoded colors, font sizes, spacing, radii, shadows, or transitions in
components. Import via `@use "pkg:@snappy/theme/<module>"`. If missing, extend the theme — don't bypass it. Read
`packages/theme/src/` when unsure.

## 🔍 Detect

Find raw color/size/spacing values in component SCSS.

## 🔧 Fix

Replace with theme functions/mixins; add tokens if needed

## 📝 Examples

### ❌ Bad

`color: #333;` / `padding: 16px;` in a component

### ✅ Good

Theme token / function from `@snappy/theme`
