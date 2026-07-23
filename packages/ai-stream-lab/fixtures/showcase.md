# 📚 Personal knowledge base in a week

## 💡 Why bother

A small knowledge base beats a pile of bookmarks when you need **answers**, not tabs. Keep notes _short_, link them, and
prefer `plain markdown` you can grep later. Drop ~~infinite wiki templates~~ until the habit sticks.

Nested markers help scanning: **keep the claim _and_ the caveat** in one line, then ~~retire `stale` tags~~ when a note
is replaced.

Unfinished thoughts still read cleanly when closed: start **bold claims** and leave _room_ to revise.

Line break after this sentence. Soft break continues in the same paragraph when the parser allows it.

## 🧭 Headings depth

### ✏️ Capture rules

Write one claim under each capture: what changed, why it matters, and where to look next.

#### Review cadence

Review weekly for decisions, monthly for archives, and whenever a note blocks new work.

## 💬 Quotes worth keeping

> Capture the question before the answer. **Context** ages slower than facts.
>
> Revisit notes when a decision changes, not on a fixed calendar.
>
> > Nested reminder: prefer links over copies.
> >
> > Nested line with `path/to/note.md` and _why it matters_.

A short bridge paragraph separates quote clusters.

> Quote with an embedded list:
>
> - Capture the source
> - Capture the `decision` in one line

## 📋 Working lists

- Inbox item with **priority**
- Clarify item with _owner_
  - Nested detail with `due`
  - Nested detail with ~~blocked~~
    - Deep nested unordered
- Archive item after nesting

1. Weekly review with a **fixed slot**
2. Monthly prune with _mercy_
   1. Nested numbered alpha
   2. Nested numbered beta
      1. Deep nested ordered
3. Back to top level

Mixed parent style:

- Unordered parent
  1. Ordered child
  2. Second ordered child
     - Unordered grandchild

- [ ] Triage inbox with `today`
- [x] File one evergreen note with **links**
- [ ] Prune a stale note with _care_

Loose list item with a nested paragraph:

- First tight item
- Loose item lead-in.

  Continuation paragraph inside the same item, still with **bold**.

- Trailing tight item

## 📊 Tool comparison

| Tool    |   Pace   | Cost | Note                                  |
| :------ | :------: | ---: | ------------------------------------- |
| Paper   | **fast** |    0 | `offline`                             |
| App     |  _slow_  |   12 | sync tax                              |
| Repo    |  mixed   |    0 | **git-friendly** notes                |
| Hybrid  |   edge   |    4 | pipe \| check                         |
| Archive | ~~old~~  |    0 | link cell [docs](https://example.com) |

## 🔗 Links and auto-links

See [example](https://example.com) and a titled link [repo](https://example.com "Example title").

Autolink form: <https://example.com/path?q=1>.

Reference link to the [same site][example-ref] after the label is defined.

[example-ref]: https://example.com/ref "Reference title"

## ➖ Horizontal rule

Content above the rule.

---

Content below the rule.

## 💻 Code

Multiline TypeScript with blank lines and nested blocks:

```ts
type Note = {
  id: string;
  title: string;
};

export const slug = (note: Note) => {
  const label = note.title.trim() || "untitled";

  return `${label.toLowerCase().replaceAll(/\s+/g, "-")}-${note.id}`;
};

export const ids = (notes: readonly Note[]) => notes.map(note => note.id);
```

JSON sample with nested objects and arrays:

```json
{
  "ok": true,
  "items": [
    { "id": 1, "label": "inbox" },
    { "id": 2, "label": "evergreen" }
  ]
}
```

Plain fenced block tagged as `text`:

```text
plain fence
  indented line
trailing line
```

## 🧩 HTML and escapes

<div>Inline HTML block for the parser.</div>

Escape check: \*not bold\*, \_not italic\_, \`not code\`, and a literal pipe \| outside tables.
