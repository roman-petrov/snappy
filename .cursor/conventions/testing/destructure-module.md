# 🧪 Destructure module under test

- **id:** `testing/destructure-module`
- **emoji:** 🧪
- **applies:** `**/*.test.{ts,tsx}`

## 📐 Norm

For object-of-functions modules: import, destructure at top, call without module prefix. Factory modules: create an
instance; don't destructure the factory.

## 🔍 Detect

Tests calling `Module.fn` without top-level destructure for object modules.

## 🔧 Fix

Destructure at top; call `fn()`

## 📝 Examples

### ❌ Bad

`Math.add(1, 2)` throughout the file

### ✅ Good

`const { add } = Math;` then `add(1, 2)`
