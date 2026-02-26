# Deploy

## Environment variables (.env)

| Variable              | Required | Description                                                     |
| --------------------- | -------- | --------------------------------------------------------------- |
| `DB_HOST`             | yes      | PostgreSQL host                                                 |
| `DB_PORT`             | yes      | PostgreSQL port (e.g. 5432)                                     |
| `DB_USER`             | yes      | PostgreSQL user                                                 |
| `DB_PASSWORD`         | yes      | PostgreSQL password                                             |
| `DB_NAME`             | yes      | Database name                                                   |
| `BOT_TOKEN`           | yes      | Telegram Bot API token (from @BotFather)                        |
| `GIGACHAT_AUTH_KEY`   | yes      | GigaChat API authorization key                                  |
| `BOT_API_KEY`         | yes      | Secret key for bot–cabinet API auth; generate a random string   |
| `JWT_SECRET`          | yes      | Secret for signing JWT (min 32 chars); generate a random string |
| `YOOKASSA_SECRET_KEY` | no       | YooKassa secret key (payments)                                  |
| `YOOKASSA_SHOP_ID`    | no       | YooKassa shop ID (payments)                                     |

### Generating JWT_SECRET and BOT_API_KEY

**JWT_SECRET** — use a cryptographically random string (≥32 chars):

```bash
openssl rand -base64 32
```

**BOT_API_KEY** — same approach; any random secret shared between bot and cabinet:

```bash
openssl rand -base64 32
```

Keep both values secret and use different values per environment.

## Prerequisites

- A VPS with SSH access (port 22)
- GitHub repository with the `production` environment and required secrets

## GitHub Environment and secrets

1. Create an environment: **Settings** → **Environments** → **New environment** → name it `production`.

2. In the `production` environment, add **Environment secrets**:

| Secret                | Description             | Example                              |
| --------------------- | ----------------------- | ------------------------------------ |
| `SSH_HOST`            | Server hostname or IP   | `192.168.1.100` or `bot.example.com` |
| `SSH_USER`            | SSH username            | `deploy` or `ubuntu`                 |
| `SSH_PRIVATE_KEY`     | Private SSH key content | Full key with BEGIN/END              |
| `DB_HOST`             | PostgreSQL host         | `localhost` or DB server host        |
| `DB_PORT`             | PostgreSQL port         | `5432`                               |
| `DB_USER`             | PostgreSQL user         |                                      |
| `DB_PASSWORD`         | PostgreSQL password     |                                      |
| `DB_NAME`             | PostgreSQL database     |                                      |
| `BOT_TOKEN`           | Telegram bot token      |                                      |
| `BOT_API_KEY`         | Bot–cabinet API secret  | Generate: `openssl rand -base64 32`  |
| `JWT_SECRET`          | JWT signing secret      | Generate: `openssl rand -base64 32`  |
| `GIGACHAT_AUTH_KEY`   | GigaChat API key        |                                      |
| `YOOKASSA_SECRET_KEY` | YooKassa secret key     |                                      |
| `YOOKASSA_SHOP_ID`    | YooKassa shop ID        |                                      |
| `SSL_CERT_PEM`        | (optional) TLS cert     | PEM content for site HTTPS           |
| `SSL_KEY_PEM`         | (optional) TLS key      | PEM content for site HTTPS           |

If both `SSL_CERT_PEM` and `SSL_KEY_PEM` are set, the site runs on port 443 (HTTPS). Otherwise it runs on port 80
(HTTP).

## Monitoring and logs

```bash
pm2 logs snappy-bot
pm2 monit
pm2 status
```
