# Deploy

## Environment variables (application)

Use these names in `.env` locally and for the server process in production (PM2, systemd, or secrets with the same
keys).

| Variable              | Description                                                           |
| --------------------- | --------------------------------------------------------------------- |
| `DB_HOST`             | PostgreSQL host                                                       |
| `DB_PORT`             | PostgreSQL port (e.g. 5432)                                           |
| `DB_USER`             | PostgreSQL user                                                       |
| `DB_PASSWORD`         | PostgreSQL password                                                   |
| `DB_NAME`             | Database name                                                         |
| `JWT_SECRET`          | Secret for signing JWT (min 32 chars); generate a random string       |
| `AI_TUNNEL_API_KEY`   | AI Tunnel API key for LLM routes                                      |
| `YOOKASSA_SECRET_KEY` | YooKassa secret key (payments)                                        |
| `YOOKASSA_SHOP_ID`    | YooKassa shop ID (payments)                                           |
| `SSL_CERT_PEM`        | TLS certificate (PEM). With `SSL_KEY_PEM`, HTTPS on 443 in production |
| `SSL_KEY_PEM`         | TLS private key (PEM)                                                 |

### Generating JWT_SECRET

**JWT_SECRET** — use a cryptographically random string (≥32 chars):

```bash
openssl rand -base64 32
```

Keep the value secret and use different values per environment.

## Production: GitHub Actions

### Prerequisites

- A VPS with SSH access (port 22)
- GitHub repository with the `production` environment and secrets

### GitHub secrets (deploy infrastructure only)

Create an environment: **Settings** → **Environments** → **New environment** → name it `production`, then add:

| Secret            | Description             | Example                              |
| ----------------- | ----------------------- | ------------------------------------ |
| `SSH_HOST`        | Server hostname or IP   | `192.168.1.100` or `app.example.com` |
| `SSH_USER`        | SSH username            | `deploy` or `ubuntu`                 |
| `SSH_PRIVATE_KEY` | Private SSH key content | Full key with BEGIN/END              |

### Application configuration in production

Add **environment secrets** on the same `production` environment using the **same names** as in
[Environment variables (application)](#environment-variables-application) (`DB_HOST`, `JWT_SECRET`, `AI_TUNNEL_API_KEY`,
…). The deploy workflow forwards the subset it knows about to the remote shell; for any variable not included in the
workflow, set it in a server-side `.env` or PM2 ecosystem file, or extend the pipeline.

If both `SSL_CERT_PEM` and `SSL_KEY_PEM` are set, the site listens on port 443 (HTTPS). Otherwise it listens on port 80
(HTTP).

## Monitoring and logs

```bash
pm2 logs snappy
pm2 monit
pm2 status
```
