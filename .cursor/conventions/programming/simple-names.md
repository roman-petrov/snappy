# 📝 Simple names

- **id:** `programming/simple-names`
- **emoji:** 📝
- **applies:** `*`

## 📐 Norm

Use the simplest names. In function names avoid `get`, `create`, `make`, `calculate`, `compute`. Avoid `utils`,
`utilities`, `util`, `factory`, `helper`, `wrapper`, `manager` in names.

## 🔍 Detect

Grep identifiers for those words.

## 🔧 Fix

Rename: drop auxiliary verbs; replace generic suffixes with concrete names.

## 📝 Examples

### ❌ Bad

`Rect.calculateArea` / `Rect.getArea`

### ✅ Good

`Rect.area`
