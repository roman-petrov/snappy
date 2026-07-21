# 🎨 No raw z-index

- **id:** `css/z-index-layers`
- **emoji:** 🎨
- **applies:** `**/*.{scss,module.scss}`

## 📐 Norm

No raw `z-index` in components. Prefer DOM order, then `position: relative` on content, then `@include layer.<name>`
from `@snappy/theme/tokens/layer`. New layers go in theme `layer.scss`.

## 🔍 Detect

Grep for `z-index` in component SCSS.

## 🔧 Fix

Remove or replace with layer mixins / DOM order

## 📝 Examples

### ❌ Bad

`z-index: 999;`

### ✅ Good

`@include layer.modal;`
