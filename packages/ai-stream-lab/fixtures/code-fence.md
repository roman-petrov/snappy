<!-- markdownlint-disable MD040 -->

# Code fence coverage

## Intro

This fixture focuses on fenced code shapes: languages, blank lines, indentation, and text between fences. Inline
`markers` stay light so the stream stress sits on `pre` blocks.

## TypeScript multiline

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

## Between fences

A short paragraph separates fences so the parser closes one block before the next opens. Keep **bold** here only as a
bridge.

## Bash multiline

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

## JSON nested

```json
{
  "name": "stream-lab",
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

## Python with blanks

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

## Plain fence

```text
tagged as text
  indented body
blank line follows

last line
```

## Untagged fence

```
no language tag
  indented body
blank line follows

last line
```

## One-liner contrast

```js
const answer = 42;
```

## Closing

Ends with prose after the last fence so trailing text after code stays covered: **done** with _emphasis_.
