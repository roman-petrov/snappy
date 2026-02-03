---
name: programmer
description:
  Applies general programming principles (functional, minimal, no OOP; DRY, single source of truth, pure functions,
  comments). Use when writing or reviewing code in any language.
---

# 📘 Programmer

## 📋 Principles

1. **Keep it simple** — always aim for the simplest solution possible.
2. **Don't repeat yourself** — avoid duplicating code and maintain a single source of truth.
3. **Write code for humans, not machines** — make your code readable and understandable to other developers.
4. **Keep functions small and focused** — each function should perform a single task.
5. **Maintain consistency** — follow established coding conventions and patterns.
6. **Write tests for code** — ensure that your code is correct and works as expected.
7. **Avoid over-optimization** — only optimize when necessary and measure the impact of changes.
8. **Keep dependencies to a minimum** — depend only on what is necessary for your code to work.
9. **Document code** — write clear and concise comments and documentation to help other developers understand your code.
10. **Refactor often** — always look for ways to improve your code and make it more efficient.

---

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

### Prefer immutability

- **Do not use mutation**; use **immutable data** always if possible.

### Comments

- Don't comment the obvious; only **non-obvious** points.
- Comment language — **English**.

### Boolean parameters & properties

Boolean parameters and properties should always be **optional** and should have default value of **`false`**: when we
pass `true` we intend to activate something that is disabled by default.

### 🧹 Remove unused code

Watch for unused code: unused variables, function parameters, imports, and the like. **Always** remove unused code.

### 🔄 Inline one-off code

If a variable or function is used only once and not reused elsewhere — **always** remove it and inline its usage to
shorten and simplify the code.

### 📝 Simple names

Use the **simplest possible names** (Occam's razor). In **function names** avoid auxiliary words such as **get**,
**create**, **make**, **calculate**, **compute**: in a functional style we already know that functions return values, so
these words add noise. In names of variables, functions, or units avoid **utils**, **utilities**, **util**, **factory**,
**helper**, **wrapper**, **manager** and the like — they introduce unnecessary abstractions and obscure what the code
does.

**Example:** prefer `Rect.area(width, height)` over `Rect.calculateArea(width, height)` or
`Rect.getArea(width, height)`.

---

## ✅ Quick Checklist

- [ ] No code duplication; single source of truth
- [ ] No extra "future-proof" code; code is simple and short
- [ ] No classes or OOP
- [ ] Pure functions extracted and under tests
- [ ] Immutable data; no mutation where possible
- [ ] Unused code removed (variables, parameters, imports, etc.)
- [ ] One-off variables/functions inlined where used only once
- [ ] Simple names; no auxiliary words in functions (get, make, create, calculate); no utils/helper/manager etc.
- [ ] Comments only for non-obvious things, in English
