<!-- markdownlint-disable MD040 -->

# 🧰 Local tooling snippets

## 👋 Intro

A small kit of copy-paste blocks for day-to-day work. Bridge text may use **bold** or _italic_ between fences. Inline
`paths` stay light so the stress sits on the code blocks.

## 🟦 TypeScript multiline

```ts
export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

export const mapOk = <T, U>(result: Result<T>, map: (value: T) => U): Result<U> => {
  if (!result.ok) {
    return result;
  }

  return { ok: true, value: map(result.value) };
};

export const sample = mapOk({ ok: true, value: 21 }, value => value * 2);
```

## 🌉 Between fences

Close one fence before the next opens. Keep **one** clear bridge sentence so the reader knows the topic shifted.

## 🐚 Bash multiline

```bash
set -eu

ROOT="$(pwd)"
OUT="$ROOT/dist"

mkdir -p "$OUT"
printf 'build ok\n' > "$OUT/status.txt"

if [[ -f "$OUT/status.txt" ]]; then
  cat "$OUT/status.txt"
fi
```

## 📦 JSON nested

```json
{
  "name": "local-kit",
  "matrix": [
    ["alpha", 1],
    ["beta", 2]
  ],
  "flags": {
    "strict": true,
    "retry": false
  }
}
```

## 🐍 Python with blanks

```python
def sliding_window(values: list[int], size: int) -> list[list[int]]:
    if size <= 0:
        return []

    windows: list[list[int]] = []

    for index in range(0, len(values) - size + 1):
        windows.append(values[index : index + size])

    return windows


print(sliding_window([1, 2, 3, 4], 2))
```

## 📄 Plain fence

```text
tagged as text
  indented body
blank line follows

last line
```

## 🏷️ Untagged fence

```
no language tag
  indented body
blank line follows

last line
```

## ⚡ One-liner contrast

```js
const answer = 42;
```

## ✅ Closing

After the last fence, leave a short close so trailing prose stays covered: **ready** with _room_ to extend.
