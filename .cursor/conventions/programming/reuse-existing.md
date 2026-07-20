# 🔧 Reuse existing project APIs

- **id:** `programming/reuse-existing`
- **emoji:** 🔧
- **applies:** `*`

## 📐 Norm

Prefer existing project functions over new helpers. Prefer project utilities over built-in equivalents when valid.
Search `@snappy/core` (`_`: `cn`, `clamp`, `kebabCase`, `isString`, …; `Time`, `DateTime`, `Json`, `Translate`, …),
`@snappy/hooks`, `@snappy/browser`, `@snappy/ui`, `@snappy/theme` (SCSS tokens/mixins), package barrels, and the current
package before inventing helpers. Prefer existing UI primitives over one-off markup/CSS. Prefer barrel imports over deep
paths.

## 🔍 Detect

Before accepting a new helper, search the codebase and those packages for the same or similar API.

## 🔧 Fix

Replace reinvention with the project API; delete the duplicate.
