# Streaming sample

## Overview

This sample checks table, nested lists, and a code fence in one stream. Keep sentences short so chunk boundaries hit
markup often.

It mixes **bold**, _italic_, and `code` early so Remend stays busy.

## Comparison

The table below compares four approaches. Values stay short to stress cell streaming.

| Approach       | Latency | Cost    | Fit     |
| -------------- | ------- | ------- | ------- |
| Burst tokens   | **low** | high    | demos   |
| Trickle tokens | medium  | _low_   | chat    |
| Hang mid-fence | high    | medium  | repair  |
| Cut markers    | flicker | `n/a`   | flicker |
| Pipe edge      | mixed   | ~~n/a~~ | a \| b  |

## Bridge

Lists reuse the same themes as the table. Nested levels alternate markers on purpose.

## Checklist tree

- Plan the stream pacing
  - Pick chunk size
    - char mode
    - word mode
  - Pick hang points
    - mid table
    - mid fence
- Watch TypeWriter modes
  - stream
  - fast
    - medium
    - slow
- Mix list kinds
  1. Ordered under unordered
  2. Second ordered child
     - Back to bullets
- [ ] Confirm final text
- [ ] Confirm no raw markers
- [x] Seed fixtures

## Toward code

After lists, a TypeScript sample exercises fence repair while the fence is still open. The body spans several lines on
purpose.

## Example

```ts
type Point = {
  x: number;
  y: number;
};

const sum = (items: number[]) => items.reduce((total, item) => total + item, 0);

export const average = (items: number[]) => {
  if (items.length === 0) {
    return 0;
  }

  return sum(items) / items.length;
};

export const midpoint = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});
```

## Wrap-up

The document ends after code so the lab can assert full text equality. Final line keeps **bold** and _italic_ together.
