# Deploy Snappy Bot

Deployment is done via GitHub Actions: one manual workflow run syncs the repo to the VPS with rsync and runs the deploy script on the server. The script installs Node.js, Bun, and PM2 if missing, then installs dependencies and restarts the bot under PM2.

## Prerequisites

- A VPS with SSH access (port 22)
- GitHub repository with the `production` environment and required secrets

## Step 1: SSH key

1. Generate an SSH key (if you don't have one):

   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy"
   ```

2. Add the public key to the server:

   ```bash
   ssh-copy-id -p 22 user@your-server.com
   ```

3. Copy the full private key (including `-----BEGIN` and `-----END` lines) for use as a GitHub secret.

## Step 2: GitHub Environment and secrets

1. Create an environment: **Settings** → **Environments** → **New environment** → name it `production`.

2. In the `production` environment, add **Environment secrets**:

| Secret            | Description              | Example                                    |
| ----------------- | ------------------------ | ------------------------------------------ |
| `SSH_HOST`        | Server hostname or IP    | `192.168.1.100` or `bot.example.com`       |
| `SSH_USER`        | SSH username             | `deploy` or `ubuntu`                        |
| `SSH_PRIVATE_KEY` | Private SSH key content  | Full key with BEGIN/END                    |
| `SNAPPY_CONFIG`   | Bot config JSON          | Raw JSON (e.g. contents of config.json)    |

Fixed values (not secrets): SSH port `22`, deploy path on server `/home/deploy/snappy`. The deploy script uses PM2 to run the bot.

> Secrets in the `production` environment can be protected (e.g. require approval before deploy).

## Step 3: Run deploy

1. Open the **Actions** tab in GitHub.
2. Select the **Deploy** workflow.
3. Click **Run workflow**, choose the branch (usually `main`), then **Run workflow**.

Deploy is manual only. On the first run, the script installs Node.js, Bun, and PM2 on the server if they are missing; no separate server setup is required.

## Monitoring and logs

```bash
pm2 logs snappy-bot
pm2 monit
pm2 status
```

## Rollback

Code is deployed via rsync (no git on the server). To roll back: re-run the **Deploy** workflow from a previous commit in GitHub, or restore the app directory from backup and on the server run:

```bash
cd /home/deploy/snappy
bun install --production
pm2 restart snappy-bot
```

## Security

- Never commit secrets to Git.
- Use GitHub Secrets for credentials.
- Restrict SSH user permissions.
- Prefer SSH keys over passwords.
- Keep dependencies updated.
