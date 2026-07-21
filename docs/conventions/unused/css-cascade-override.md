# 🎨 Overridden by cascade

- **id:** `unused/css-cascade-override`
- **emoji:** 🎨
- **applies:** `**/*.{scss,module.scss}`

## 📐 Norm

Earlier declarations never applied due to later rules/higher specificity are dead.

## 🔍 Detect

Trace cascade/specificity.

## 🔧 Fix

Remove the never-applied declaration

## 📝 Examples

### ❌ Bad

`.item { color: red; color: blue; }`

### ✅ Good

`.item { color: blue; }`
