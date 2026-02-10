# Deploy

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
