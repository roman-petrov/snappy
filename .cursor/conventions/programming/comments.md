# 💬 Comments

- **id:** `programming/comments`
- **emoji:** 💬
- **applies:** `*`

## 📐 Norm

Don't comment the obvious; only non-obvious points. Comment language is English. Remove obsolete comments and
AI/narrative comments ("ensure that…", step-by-step essays). Keep ESLint / Stylelint / cspell directives. Keep short
English notes for non-obvious intent or non-trivial algorithms.

## 🔍 Detect

Read comments; flag obvious, non-English, obsolete, or AI-narrative ones. Do not remove linter/cspell directives.

## 🔧 Fix

Delete or rewrite; keep directives and non-obvious intent

## 📝 Examples

### ❌ Bad

```ts
// Add one
count += 1;
```

### ✅ Good

```ts
// Wrap at API max (legacy)
count = count >= max ? 0 : count + 1;
```
