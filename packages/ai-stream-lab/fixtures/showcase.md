# Markdown showcase

## Text and emphasis

Plain paragraph with **bold**, _italic_, ~~strike~~, and `inline code` in one sentence.

Nested markers: **bold with _italic inside_ still bold**, then ~~strike with `code` inside~~, then plain.

Unfinished-looking edges stay readable when closed: prefix **suffix** and also _tail_ wrap.

Line break after this sentence. Soft break continues on the next line in the same paragraph when the parser allows it.

## Headings depth

### Level three heading

A short note under `h3` so heading styles below `h2` get coverage.

#### Level four heading

Deeper heading for theme fallback styles.

## Quotes

> Outer quote with a short note and **bold** inside.
>
> Second outer paragraph in the same quote.
>
> > Nested quote for stream repair checks.
> >
> > Nested line with `code` and _italic_.

A short bridge paragraph separates quote clusters.

> Quote with an embedded list:
>
> - Quoted bullet one
> - Quoted bullet two with `code`

## Lists

- Alpha item with **bold**
- Beta item with _italic_
  - Nested one with `code`
  - Nested two with ~~strike~~
    - Deep nested unordered
- Gamma item after nesting

1. First numbered with **bold**
2. Second numbered with _italic_
   1. Nested numbered alpha
   2. Nested numbered beta
      1. Deep nested ordered
3. Back to top level

Mixed parent style:

- Unordered parent
  1. Ordered child
  2. Second ordered child
     - Unordered grandchild

- [ ] Open task with `todo`
- [x] Done task with **done**
- [ ] Open task with _note_

Loose list item with a nested paragraph:

- First tight item
- Loose item lead-in.

  Continuation paragraph inside the same item, still with **bold**.

- Trailing tight item

## Table

| Name    |   Kind   | Size | Note                                  |
| :------ | :------: | ---: | ------------------------------------- |
| Alpha   | **fast** |   12 | `ok`                                  |
| Beta    |  _slow_  |   34 | plain                                 |
| Gamma   |  mixed   |   56 | **bold** cell                         |
| Delta   |   edge   |   78 | pipe \| check                         |
| Epsilon | ~~old~~  |   90 | link cell [docs](https://example.com) |

## Links and auto-links

See [example](https://example.com) and a titled link [repo](https://example.com "Example title").

Autolink form: <https://example.com/path?q=1>.

Reference link to the [same site][example-ref] after the label is defined.

[example-ref]: https://example.com/ref "Reference title"

## Horizontal rule

Content above the rule.

---

Content below the rule.

## Code

Multiline TypeScript with blank lines and nested blocks:

```ts
type User = {
  id: string;
  name: string;
};

export const greet = (user: User) => {
  const label = user.name.trim() || "friend";

  return `Hello, ${label} (${user.id})`;
};

export const ids = (users: readonly User[]) => users.map(user => user.id);
```

JSON sample with nested objects and arrays:

```json
{
  "ok": true,
  "items": [
    { "id": 1, "label": "alpha" },
    { "id": 2, "label": "beta" }
  ]
}
```

Plain fenced block tagged as `text`:

```text
plain fence
  indented line
trailing line
```

## HTML and escapes

<div>Inline HTML block for the parser.</div>

Escape check: \*not bold\*, \_not italic\_, \`not code\`, and a literal pipe \| outside tables.
