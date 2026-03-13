# 📋 Workflow

## 🗄️ Database migrations in feature branches

Single clean migration at merge. Schema: `packages/db/prisma/schema.prisma`.

### 🔄 During development

1. Run `bun do dev` — DB + server (schema sync at startup, no migration files)
2. Edit schema → restart `bun do dev` to apply
3. Repeat

### ✅ Before merge

1. Rebase on `main`
2. Run `bun do db:migrate:create` — creates migration from diff (Prisma prompts for name)
3. Run `bun do db:generate` — ensure schema and client are in sync
4. Review SQL in `packages/db/prisma/migrations/`
5. Run `bun do db:migrate:dev` to apply (or `bun do db:migrate:reset` if DB is messy)
6. Commit migration, merge
