<!-- cspell:word neuro aiesa lmsys certutil addstore dmarc -->

# Snappy

## 📋 Prerequisites

- ⌨️ [Cursor](https://cursor.com/)
  - 🔌 Install recommended workspace `VSCode` extensions.
- 📥 [Node.js](https://nodejs.org/) — version from [`.node-version`](.node-version).
- 📥 [Bun](https://bun.com/).
- 📝 Fonts:
  - [Google Sans Code](https://fonts.google.com/specimen/Google+Sans+Code)
  - [Cascadia Code](https://fonts.microsoft.com/specimen/Cascadia+Code)
- 🐳 [Docker](https://www.docker.com/products/docker-desktop/)
- 🐘 [pgAdmin](https://www.pgadmin.org/download/)
- 📱 [Android SDK](https://developer.android.com/tools/releases/platform-tools)

## 🔄 Workflow

- ⚙️ `!setup.bat`: Configure git and install project dependencies.
- ✅ `!check.bat`: Run all CI checks.
- 🧹 `!cleanup.bat`: Clean up repository.
- 📦 `!upgrade.bat`: Upgrade dependencies interactively.
- 🔄 `!upgrade_actions.bat`: Upgrade GitHub Actions.

### 🧬 Prisma workflow

Schema source of truth: `packages/db-core/prisma/schema.prisma`.

#### 🌿 Feature branch

1. Run `bun do dev`.
2. Modify `schema.prisma` and restart dev server during development.

#### ✅ Before merge

1. Rebase on `main`.
2. Run `bun do finish-feature`.
3. Review changes.
4. Commit if ok.

⚠️ Note: after `bun do finish-feature`, do not modify `schema.prisma`. If schema changed, run `bun do finish-feature`
again.

## 🚀 Deploy

### 🔐 Secrets

- 📤 Decrypt: `bun do decrypt` → `secrets.prod.yaml`
- 🔒 Encrypt: `bun do encrypt` → writes `secrets.prod.enc.yaml` (securely save printed key as `SECRETS_KEY`)

`secrets.prod.yaml` is temporary; delete it after encrypting.

### 🐙 GitHub Environment `production`

| Secret            | Description                 |
| ----------------- | --------------------------- |
| `SSH_HOST`        | Server hostname or IP       |
| `SSH_USER`        | SSH username                |
| `SSH_PRIVATE_KEY` | Private SSH key (full PEM)  |
| `SECRETS_KEY`     | Prod secrets encryption key |

## 📦 S3 (Reg.ru)

- Create a **dev** and **prod** buckets, access keys and set up access rights.
- Add secrets: `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`.

## 🌐 Local development

Dev server (`bun do dev`) is always at **<https://home.local>** (site) and **<https://home.local/app>** (app). The
machine hostname should be **home** so phones and other devices on the LAN can resolve **home.local**. Android debug APK
uses the same URL.

### 🤖 Android signing

- Dev: `bun do android-keys-dev`
- Prod: `bun do decrypt` → `bun do android-keys-prod` → `bun do encrypt`

### 🔐 Dev HTTPS

1. `bun do cert`
   - creates `$env:USERPROFILE\.snappy\cert\` folder.
2. `certutil -addstore -user Root "$env:USERPROFILE\.snappy\cert\ca.pem"`
3. `bun do dev`

On a phone: copy `ca.pem` to the device and install it as a CA certificate (Settings → Security).

### 🚇 Robokassa (shop technical settings)

- Hash: `MD5`
- ResultURL: `POST` `https://snappy-ai.ru/api/webhooks/robokassa`
- SuccessURL: `GET` `https://snappy-ai.ru/app/billing/robokassa/success`
- FailURL: `GET` `https://snappy-ai.ru/app/billing/robokassa/fail`

### 📜 Logs

Server logs go to **`.logs/`** in the repo root (created automatically; gitignored):

- `http` — Fastify request/access logs (`HttpLog`)
- `payment` — top-up, settle, credit, Robokassa webhook / tunnel (`Log.payment`)
- `auth` — signup reject / bonus, email send failures (`Log.auth`)
- `ai` — LLM proxy gate / debit (`Log.ai`)

Rotation: daily and at ~20 MB, keep 14 files. For top-up / tunnel issues inspect `.logs/payment*.log` on the server and
locally.

## 🛠️ Technologies

- 🟦 [TypeScript](https://www.typescriptlang.org/)
- ⚡ [Vite](https://vite.dev/)
- 📦 [tsdown](https://tsdown.dev/)
- ⚛️ [React](https://react.dev/)
- 🔐 [Better Auth](https://www.better-auth.com/)
- 🧬 [Prisma](https://www.prisma.io/)
- 🧪 [Vitest](https://vitest.dev/)
- ✨ [ESLint](https://eslint.org/)
- 🎨 [Prettier](https://prettier.io/)
- 🖌️ [Stylelint](https://stylelint.io/)
- 🎯 [Lucide](https://lucide.dev/)
- 📦 [Zod](https://zod.dev/)
- ✉️ [Nodemailer](https://nodemailer.com/)
- 📧 [React Email](https://react.email/)

## 📎 Service links

### 📊 Repository & monitoring

- [GitHub](https://github.com/roman-petrov/snappy/)
- [Product Radar](https://productradar.ru/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html)
- [Yandex Webmaster](https://webmaster.yandex.ru/)
- [Yandex Metrica](https://metrika.yandex.ru/)

### 🎛️ AI consoles

- [AITunnel panel](https://aitunnel.ru/panel/)
- [ProxyAPI console](https://console.proxyapi.ru/)

### 🌐 Hosting & DNS

- [Reg.ru account](https://www.reg.ru/user/account/)
- [Reg.ru cloud](https://cloud.reg.ru/panel/)
- [ISPmanager](https://dnsadmin.hosting.reg.ru/manager/ispmgr)

### Mail

- [VK WorkSpace admin](https://app.workspace.vk.ru/admin)
- [VK WorkSpace mail](https://app.workspace.vk.ru/mail)
- [Setup guide](https://workspace.vk.ru/docs/saas/user-guides/mail/clients/)
- [Post master](https://postmaster.mail.ru/)
- [Domain security (SPF/DKIM/DMARC)](https://postmaster.mail.ru/security/snappy-ai.ru)

### 💳 Payments

- [Robokassa](https://robokassa.com/)

## 🤖 AI (recommended)

- 🎮 [MSI Afterburner](https://www.msi.com/Landing/afterburner)
- 🦙 [Ollama](https://ollama.com/)

## 🤖 Agents

- 🧠 [Hermes Agent](https://hermes-agent.nousresearch.com/) — Autonomous agent with memory
  ([GitHub](https://github.com/NousResearch/Hermes-Agent)).
- 💻 [OpenCode](https://opencode.ai/) — Open-source coding agent ([GitHub](https://github.com/sst/opencode)).
- 🧪 [n0x](https://n0xth.vercel.app/) — The full AI stack in one browser tab ([GitHub](https://github.com/ixchio/n0x)).
- 🧩 **Claude Code** — Community research mirror ([GitHub](https://github.com/yasasbanukaofficial/claude-code)).

## 🇷🇺 Russian model providers

- [AITunnel](https://aitunnel.ru/)
- [ProxyAPI](https://proxyapi.ru/)
- [RouterAI](https://routerai.ru/)
- [RockAPI](https://www.rockapi.ru/)
- [GenAPI](https://gen-api.ru/)
- [VseLLM](https://vsellm.ru/)
- [NeuroAPI](https://neuroapi.host/)
- [Aiesa](https://aiesa.ru/)
- [Cloud.ru Evolution Foundation Models](https://cloud.ru/products/evolution-foundation-models)
- [Yandex Cloud Foundation Models](https://yandex.cloud/ru/docs/foundation-models/)
- [GigaChat API](https://developers.sber.ru/portal/products/gigachat-api)

## 🏆 LLM rankings

- [LMSYS Chatbot Arena](https://lmarena.ai/) — blind pairwise comparisons and user-voted Elo ratings.
- [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) —
  open-weight models on standard benchmarks.
- [Artificial Analysis](https://artificialanalysis.ai/) — quality, throughput, and price in one place.
- [SWE-bench](https://www.swebench.com/) — real-world GitHub-style coding and patching (software engineering).
- [LiveBench](https://livebench.ai/) — frequently updated benchmarks focused on contamination resistance.

## 🔗 Technologies to study

- [assistant-ui](https://www.assistant-ui.com/)
- [agent-browser](https://agent-browser.dev/)
