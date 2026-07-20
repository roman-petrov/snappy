# 🗑️ Unused CSS mixins

- **id:** `unused/css-mixins`
- **emoji:** 🗑️
- **applies:** `**/*.{scss,module.scss}`

## 📐 Norm

`@mixin name` never `@include`d must be removed.

## 🔍 Detect

Extract mixin names; grep `@include name`.

## 🔧 Fix

Remove the mixin

## 📝 Examples

### ❌ Bad

`@mixin unused-shadow { … }` never included

### ✅ Good

Remove the unused mixin
