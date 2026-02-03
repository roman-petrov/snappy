---
name: typescript-programmer
description: TypeScript coding style — functional, minimal, no OOP. Use when writing or reviewing TypeScript: general principles (DRY, type inference, naming, undefined, ===, braces), pure functions, type (not interface), arrow functions, module export conventions.
---

# TypeScript Programmer

## Philosophy

- **Occam's razor** — don't write code "for the future"; only what's needed now.
- **Simplicity** — keep code simple and compact.
- **No OOP** — don't use classes or object-oriented style.

---

## General Programming Principles

### Don't duplicate code

- Extract repeated logic into functions or shared constants.
- **Single source of truth** for types and values: derive types from data instead of manually duplicating enums.

### Infer types from values

Prefer **inferring types from values** so data and types stay in sync. Annotate explicitly only when inference is
impossible or hurts readability.

| Situation                     | How to infer                                               |
| ----------------------------- | ---------------------------------------------------------- |
| Literal array/tuple           | `const X = [...] as const` → `type T = (typeof X)[number]` |
| Constant object (keys/values) | `keyof typeof OBJ`, `(typeof OBJ)[key]`                    |
| Function return type          | `ReturnType<typeof fn>`                                    |
| Function parameters           | `Parameters<typeof fn>`                                    |

One example for array and object:

```ts
const STATUSES = ["pending", "done", "failed"] as const;
type Status = (typeof STATUSES)[number];

const CONFIG = { timeout: 5000, retries: 3 } as const;
type ConfigKey = keyof typeof CONFIG;
```

### File naming

- TypeScript files — **PascalCase**, except: `main.ts`, `index.ts`.
- Examples: `UserService.ts`, `ApiClient.ts`, `FormatDate.ts`, `main.ts`, `index.ts`.

### undefined instead of null

- Don't use `null`; use **`undefined`** for "absent" values.
- Replace `T | null` with `T | undefined` (or optional field without explicit type).

### Strict comparison

- Always use **`===`** and **`!==`**, not `==` / `!=`.

### Braces in conditionals

- In **`if`** (and in `else`, `else if`) always use **curly braces**, even for a single statement.

---

## Code Style

### Functional style

- The main unit is the **function**.
- Prefer **pure functions**: extract to separate files and cover with tests.
- Use **arrow functions** everywhere, not regular `function`.

### Types

- Use only **`type`**, not `interface`.
- **Don't specify types** where the compiler infers them.

### Comments

- Don't comment the obvious; only **non-obvious** points.
- Comment language — **English**.

---

## Module Export Rules

### No variables in module scope

- Don't use **`let`** at module level (only `const` or functions).

### Module of pure functions

Export as an **object of functions**: `export const <ModuleName> = { fn1, fn2, ... }`. Functions are declared in the
same file.

### Module with side effects

Export as a **closure (factory)** that returns an API: `export const <ModuleName> = (deps?) => ({ method1, method2 })`.
Inside — `let` in the closure, reset via `undefined`, checks via `===` and braces in `if`.

```ts
export const Timer = (delay: number) => {
  let id: ReturnType<typeof setInterval> | undefined = undefined;
  const stop = () => {
    if (id !== undefined) {
      clearInterval(id);
      id = undefined;
    }
  };
  return { start, stop };
};
```

---

## Quick Checklist

**Principles**

- [ ] No code duplication
- [ ] Types inferred from values where possible
- [ ] Files in PascalCase (except main.ts, index.ts)
- [ ] Use undefined, not null
- [ ] Comparisons only === / !==
- [ ] All if statements have curly braces

**Style**

- [ ] No extra "future-proof" code; code is simple and short
- [ ] No classes or OOP
- [ ] Arrow functions everywhere
- [ ] Only `type`, no `interface`
- [ ] Types omitted where inferred
- [ ] Comments only for non-obvious things, in English
- [ ] Pure functions extracted and under tests

**Modules**

- [ ] No `let` at module level (except in factory closure)
- [ ] Pure module → `export const X = { fn1, fn2 }`
- [ ] Module with side effects → `export const X = (deps) => ({ ... })`
