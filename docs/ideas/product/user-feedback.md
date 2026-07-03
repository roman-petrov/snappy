<!-- cspell:word petrov Upvotes upvotes FeedLog feedlog dedup Fider pgvector hosters helpdesk Helpdesk Zammad -->

# 💬 User feedback collection

## 💡 Concept

**Platform feature.** A channel for signed-in users to send support and product feedback: request type, subject, body,
operator notification to `roman.petrov@snappy-ai.ru`, and a **public** list with statuses (open roadmap). No
implementation path chosen yet — three viable approaches below.

### Product decisions

- Submission **for signed-in users only** (email from the account; less spam).
- Requests are **public by default** — users see the list and statuses.
- Operator email on every new request; **Reply-To** the user’s email is desirable.

### Shared requirements (all options)

- Request type select: at minimum feature, bug, support; optionally “other”.
- Fields: subject + body.
- Public list with filters by type and status.
- Notification to `roman.petrov@snappy-ai.ru` on every new request.
- Data on infrastructure in Russia (Reg.ru VPS), no foreign SaaS dependency.
- Snappy auth — no second account for feedback.

### Option 1: Built into Snappy

Feedback is part of the product: in-app form, own database, public page, status management in admin. Single UX and
login; full control over types, statuses, and RU/EN; email via existing SMTP; no second service on the VPS. Upvotes,
comments, roadmap — custom work later. Rough effort ~2–3 days. Choose when MVP matters more than voting and one Docker
service is unwanted.

### Option 2: FeedLog (self-hosted OSS)

Snappy is a thin layer (form + auth + email); board, voting, roadmap, and changelog live in FeedLog on a subdomain or
embed. Stack fit: PostgreSQL, Better Auth, React SDK, MIT. Less Snappy code (~1 day). Cons: +1 service, no RU UI out of
the box, younger project. Choose when voting and full product loop are needed now.

### Option 3: Fider (self-hosted OSS)

Same thin Snappy + OSS pattern; mature Go + PostgreSQL board (~4k stars), REST API, webhooks, custom OAuth2 possible.
Cons: AGPL, no roadmap/changelog out of the box, iframe/link embed. Choose when proven voting board and minimal deploy
matter most.

### Comparing options

**Native** — no second VPS service; list + statuses enough; unified UI without iframe.

**FeedLog** — upvotes, roadmap, changelog in MVP; PostgreSQL + Better Auth + React alignment.

**Fider** — mature community; board + votes + comments; iframe/subdomain acceptable.

No OSS option gives single Snappy login, operator email, and kind select without integration (API proxy, SSO, or tag
mapping).

### Out of scope for now

- Foreign SaaS (Canny, ProductBoard, Intercom).
- Helpdesk-only tools (FreeScout, Zammad) — private tickets, not public roadmap.
- GitHub Issues — poor fit for B2C.
- Anonymous landing forms — auth-only model chosen.

### Phase 2 (any option)

- Upvotes (native build; already in FeedLog/Fider).
- SSO: Better Auth as OAuth provider for OSS board.
- Telegram notifications for new requests.
- Site changelog when status is “done”.
- Moderation if public visibility gets noisy.

### Recommendation

Three viable paths; no final choice: **Native** (least infra), **FeedLog** (stack + product loop), **Fider** (mature
OSS). Decision deferred until upvotes/community or support volume justify it.

## 👤 How the user experiences it

1. The user opens feedback from Settings (or a link from the site footer).
2. They pick a type (feature, bug, support), enter subject and body — email is taken from the account, not typed again.
3. After submit, the request appears on the public board with status “new”; the operator receives email with Reply-To set
   to the user.
4. Anyone can browse the public list, filter by type or status, and see progress as the operator updates status (e.g.
   planned, in progress, done).
5. To submit, the user must be signed in; viewing the board does not require login.
