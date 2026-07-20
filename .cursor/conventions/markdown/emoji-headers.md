# 😀 Emoji in headers

- **id:** `markdown/emoji-headers`
- **emoji:** 😀
- **applies:** `**/*.{md,mdc}`

## 📐 Norm

Use one relevant emoji at the start of H1–H3. Match topic; use sparingly in body text. Convention atoms: H1 uses the
atom category emoji; structure headings always use the fixed set from `.cursor/conventions/README.md` (`📐 Norm`,
`🔍 Detect`, `🔧 Fix`, `📝 Examples`, `❌ Bad`, `✅ Good`).

## 🔍 Detect

H1–H3 without emoji where project docs use them, multiple emojis cluttering headers, or convention atom structure
headings that diverge from the fixed set in `.cursor/conventions/README.md`.

## 🔧 Fix

Add/adjust a single leading emoji; restore atom structure headings to the fixed set

## 📝 Examples

### ❌ Bad

`## Norm`

### ✅ Good

`## 📐 Norm`
