---
name: programmer
description:
  Applies general programming principles (functional, minimal, no OOP; DRY, single source of truth, pure functions,
  comments). Use when writing or reviewing code in any language.
---

# 📘 Programmer

## 🧭 Philosophy

- **Occam's razor** — don't write code "for the future"; only what's needed now.
- **Simplicity** — keep code simple and compact.
- **No OOP** — don't use classes or object-oriented style.

---

## 📐 General Principles

### Don't duplicate code

- Extract repeated logic into functions or shared constants.
- **Single source of truth** — derive from data instead of manually duplicating types and values.

### Functional style

- The main unit is the **function**.
- Prefer **pure functions**: extract to separate units and cover with tests.

### Comments

- Don't comment the obvious; only **non-obvious** points.
- Comment language — **English**.

---

## ✅ Quick Checklist

- [ ] No code duplication; single source of truth
- [ ] No extra "future-proof" code; code is simple and short
- [ ] No classes or OOP
- [ ] Pure functions extracted and under tests
- [ ] Comments only for non-obvious things, in English
