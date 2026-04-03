# Workflow

Schema source of truth: `packages/db/prisma/schema.prisma`.

## Feature branch

1. Run `bun do dev`.
2. Change only `schema.prisma`.
3. Restart `bun do dev` after schema changes.
4. Do not create migration files during daily development.

## Before merge

1. Rebase on `main`.
2. Create one migration: `bun prisma migrate dev --create-only`.
3. Generate client: `bun prisma generate`.
4. Review SQL in `packages/db/prisma/migrations/`.
5. Commit schema + generated client + migration.
