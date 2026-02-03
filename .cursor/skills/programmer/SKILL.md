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

- **🔥 Occam's razor** — don't write unnecessary code; remove everything you can do without. Write **maximally concise**
  code. Don't write code "for the future"; only what's needed now.
- **Simplicity** — keep code simple and compact.
- **No OOP** — don't use classes or object-oriented style.
- **📐 Use principles** **DRY** (Don't Repeat Yourself), **KISS** (Keep It Simple, Stupid), **YAGNI** (You Aren't Gonna
  Need It).

---

## 📐 General Principles

### Don't duplicate code

- Extract repeated logic into functions or shared constants.
- **Single source of truth** — derive from data instead of manually duplicating types and values.

### ♻️ Reuse existing functions

Prefer **existing project functions** over writing new ones. Prefer project utilities over built-in or standard-library
equivalents when they are a valid alternative. Before adding a function that might be reusable, **check** that the
project does not already have the same or similar one.

### Single source of truth (data)

When working with data, keep **one canonical place** for each fact or value. All other uses should **derive** from that
source instead of storing copies. Avoid duplicating the same data in multiple variables, configs, or structures — if
something changes, you should only update it in one place. Prefer computing derived values (e.g. lists, summaries,
flags) from the source data rather than maintaining them in parallel.

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

### Don't duplicate context in names

The **parent scope** (function, method, class, module, block) already carries context. Identifiers declared **inside**
that scope — variables, nested functions, methods, parameters, locals — should **not repeat** words or concepts that are
already implied by the parent's name or surrounding context. Shorter, context-free names in the child scope are
preferred; the reader infers the rest from the parent.

**Example:** inside a function `sendMessage`, name a variable `text` or `body`, not `messageText` or `messageBody`.
Inside a function `parseUserInput`, a helper might be `validate` or `normalize`, not `validateUserInput`.

Applies to any language and any construct: variables, functions, methods, parameters, constants, types — wherever a
parent scope already establishes context, avoid echoing that context in child identifiers.

---

## ✅ Quick Checklist

- [ ] No code duplication; single source of truth (one canonical place for data, derive the rest)
- [ ] Existing project functions reused; no duplicate helpers before checking the project
- [ ] No extra "future-proof" code; code is simple and short
- [ ] No classes or OOP
- [ ] Pure functions extracted and under tests
- [ ] Immutable data; no mutation where possible
- [ ] Unused code removed (variables, parameters, imports, etc.)
- [ ] One-off variables/functions inlined where used only once
- [ ] Simple names; no auxiliary words in functions (get, make, create, calculate); no utils/helper/manager etc.
- [ ] No redundant context in names: child identifiers don't repeat words already implied by the parent scope
- [ ] Comments only for non-obvious things, in English
