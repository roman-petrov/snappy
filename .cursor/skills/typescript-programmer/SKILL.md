---
name: typescript-programmer
description: TypeScript coding style — functional, minimal, no OOP. Use when writing or reviewing TypeScript: general principles (DRY, type inference, naming, undefined, ===, braces), pure functions, type (not interface), arrow functions, module export conventions.
---

# TypeScript Programmer

## Философия

- **Бритва Оккама**: не писать код «на будущее», только то, что нужно сейчас.
- **Простота**: простой и компактный код.
- **Без ООП**: не использовать классы и объектно-ориентированный стиль.

## Общие принципы программирования

### Не дублировать код

- Выносить повторяющуюся логику в функции или общие константы.
- Один источник правды для типов и значений: выводить типы из данных, а не дублировать перечисления вручную.

### Вывод типов из значений

Типы по возможности выводить из значений, чтобы не расходились данные и типы.

- **Литеральный массив/кортеж с `as const`** — тип объединения элементов через `typeof arr[number]`:

```ts
const STATUSES = ['pending', 'done', 'failed'] as const;
type Status = (typeof STATUSES)[number]; // 'pending' | 'done' | 'failed'

const fn = (s: Status) => s;
fn('pending'); // ok
fn('other'); // error
```

- **Объект как константа** — ключи и значения как типы:

```ts
const CONFIG = {
  timeout: 5000,
  retries: 3,
} as const;

type ConfigKey = keyof typeof CONFIG; // 'timeout' | 'retries'
type ConfigValue = (typeof CONFIG)[ConfigKey]; // 5000 | 3
```

- **Тип элемента массива** — из существующего массива/кортежа:

```ts
const ROUTES = ['/home', '/about', '/contact'] as const;
type Route = (typeof ROUTES)[number];
```

- **Тип из возвращаемого значения функции** — `ReturnType<typeof fn>`.
- **Тип из параметров функции** — `Parameters<typeof fn>`.

Явно аннотировать типы только когда вывод невозможен или ухудшает читаемость.

### Именование файлов

- Файлы TypeScript именовать в **PascalCase**, кроме двух исключений: `main.ts` и `index.ts`.
- Примеры: `UserService.ts`, `ApiClient.ts`, `FormatDate.ts`, `ValidationRules.ts`, `main.ts`, `index.ts`.

### undefined вместо null

- Не использовать `null`; предпочитать **`undefined`** для «отсутствующего» значения.
- Типы вида `T | null` заменять на `T | undefined` (или просто не указывать, если это опциональное поле).

```ts
let id: ReturnType<typeof setInterval> | undefined = undefined;

const stop = () => {
  if (id !== undefined) {
    clearInterval(id);
    id = undefined;
  }
};
```

### Строгое сравнение

- Всегда использовать **`===`** и **`!==`**, не `==` / `!=`.

```ts
if (status === 'done') {
  proceed();
}
if (value !== undefined) {
  use(value);
}
```

### Условия со скобками

- В конструкциях **`if`** (и при необходимости в `else`, `else if`) всегда использовать фигурные скобки, даже для одного оператора.

```ts
if (ok) {
  doSomething();
}

if (x > 0) {
  return x;
} else {
  return 0;
}
```

## Стиль кода

### Функциональный стиль

- Основная рабочая единица — **функция**.
- Предпочитать **чистые функции**: выносить в отдельные файлы и покрывать тестами.
- Везде использовать **arrow-функции**, не обычные `function`.

```ts
const add = (a: number, b: number) => a + b;
const greet = (name: string) => `Hello, ${name}`;
```

### Типы

- Использовать только **`type`**, не `interface`.
- **Не указывать явно типы** там, где компилятор выводит их сам.

```ts
type User = { id: string; name: string };

const getUser = (id: string) => users.find(u => u.id === id);
// возвращаемый тип выводится автоматически
```

### Комментарии

- Не комментировать очевидное.
- Комментировать только неочевидные моменты.
- Язык комментариев — **английский**.

```ts
// Correct: non-obvious workaround for SDK quirk
const normalized = raw === -0 ? 0 : raw;
```

## Правила экспорта модулей

### Без переменных в модуле

- Не использовать `let` внутри модуля (только `const` или функции).

### Модуль из чистых функций

Экспортировать как объект с функциями: `export const <ModuleName> = { fn1, fn2, ... }`. Функции объявлены в том же
файле.

```ts
const add = (a: number, b: number) => a + b;
const subtract = (a: number, b: number) => a - b;

export const Math = { add, subtract };
```

### Модуль с побочными эффектами

Экспортировать как замыкание (фабрику), возвращающую API:
`export const <ModuleName> = (deps?) => ({ method1, method2 })`.

```ts
export const Timer = (delay: number) => {
  let id: ReturnType<typeof setInterval> | undefined = undefined;
  const start = () => {
    id = setInterval(() => {}, delay);
  };
  const stop = () => {
    if (id !== undefined) {
      clearInterval(id);
      id = undefined;
    }
  };

  return { start, stop };
};
```

## Краткий чеклист

- [ ] Нет дублирования кода
- [ ] Типы выводятся из значений там, где возможно
- [ ] Файлы в PascalCase (кроме main.ts, index.ts)
- [ ] Используется undefined, не null
- [ ] Сравнения только === / !==
- [ ] У всех if есть фигурные скобки
- [ ] Нет лишнего кода «на будущее»
- [ ] Код простой и короткий
- [ ] Нет классов и ООП
- [ ] Везде arrow-функции
- [ ] Только `type`, без `interface`
- [ ] Типы не указаны там, где выводятся
- [ ] Комментарии только для неочевидного, на английском
- [ ] Чистые функции вынесены и под тестами
- [ ] В модуле нет `let`
- [ ] Чистый модуль → `export const X = { fn1, fn2 }`
- [ ] Модуль с сайд-эффектами → `export const X = (deps) => ({ ... })`
