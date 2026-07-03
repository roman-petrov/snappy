# User feedback

User feedback files live in [`entries/`](entries/) — one markdown file per email.

## File name

From the user email:

1. Lowercase.
2. Replace `@` with `_at_`.
3. Extension `.md`.

Example: `user.name@example.com` → `entries/user.name_at_example.com.md`

## File body

```markdown
# <user.name@example.com>

## 2026-07-15

Cohesive feedback text for that day or session.

## 2026-07-02

Older feedback text.
```

### Rules

- **Title** — `# <email>` in angle brackets (no bare URLs in markdown).
- **Entry** — `## YYYY-MM-DD` heading, then one paragraph of text.
- **Text** — merge related messages into a single paragraph per date.
- **Order** — newest date **on top**; prepend new entries below the title, above older ones.
- **Spacing** — blank line after each paragraph.
