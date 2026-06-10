<!-- cspell:word neuro aiesa lmsys certutil addstore -->

# Snappy

## 📋 Prerequisites

- ⌨️ [Cursor](https://cursor.com/)
  - 🔌 Install recommended workspace `VSCode` extensions.
- 📥 [Node.js](https://nodejs.org/) — version from [`.node-version`](.node-version).
- 📥 [Bun](https://bun.com/).
- 🔐 [SOPS](https://getsops.io/) - Download from GitHub releases and copy `sops.exe` into `C:\\Windows/system32`
  directory.
- 🔑 [age](https://github.com/FiloSottile/age) - Download from GitHub releases and copy binaries into
  `C:\\Windows/system32` directory..
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

### 🔐 Secrets (SOPS)

#### 🔑 Age key (once)

1. `age-keygen -o age-key.txt`.
2. Copy public key (`age1...`) into [`.sops.yaml`](.sops.yaml).
3. Save private key line (`AGE-SECRET-KEY-...`) in your secure storage and in GitHub secret `SOPS_AGE_KEY`, then delete
   `age-key.txt`.

#### 📄 Secrets file

> Set `$env:SOPS_AGE_KEY = "AGE-SECRET-KEY-..."` to decrypt.

- 📤 Decrypt: `sops -d secrets.enc.yaml > secrets.yaml`
- 🔒 Encrypt: `sops -e secrets.yaml > secrets.enc.yaml`

### 🐙 GitHub Environment `production`

| Secret            | Description                |
| ----------------- | -------------------------- |
| `SSH_HOST`        | Server hostname or IP      |
| `SSH_USER`        | SSH username               |
| `SSH_PRIVATE_KEY` | Private SSH key (full PEM) |
| `SOPS_AGE_KEY`    | age private key            |

## 🌐 Local development

Dev server (`bun do dev`) is always at **<https://home.local>** (site) and **<https://home.local/app>** (app). The
machine hostname should be **home** so phones and other devices on the LAN can resolve **home.local**. Android debug APK
uses the same URL.

### 🔐 Dev HTTPS

1. `bun do cert`
   - creates `$env:USERPROFILE\.snappy\cert\` folder.
2. `certutil -addstore -user Root "$env:USERPROFILE\.snappy\cert\ca.pem"`
3. `bun do dev`

On a phone: copy `ca.pem` to the device and install it as a CA certificate (Settings → Security).

## 🛠️ Technologies

- 🟦 [TypeScript](https://www.typescriptlang.org/)
- ⚡ [Vite](https://vite.dev/)
- 📦 [tsdown](https://tsdown.dev/)
- ⚛️ [React](https://react.dev/)
- 🔐 [Better Auth](https://www.better-auth.com/)
- 🔗 [tRPC](https://trpc.io/)
- 🧬 [Prisma](https://www.prisma.io/)
- 🧪 [Vitest](https://vitest.dev/)
- ✨ [ESLint](https://eslint.org/)
- 🎨 [Prettier](https://prettier.io/)
- 🖌️ [Stylelint](https://stylelint.io/)
- 🎯 [Lucide](https://lucide.dev/)
- 📦 [Zod](https://zod.dev/)
- ✉️ [Nodemailer](https://nodemailer.com/)
- 📧 [React Email](https://react.email/)
- 🌐 [agent-browser](https://agent-browser.dev/)

## 📎 Service links

### 📊 Repository & monitoring

- [GitHub](https://github.com/roman-petrov/snappy/)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [SSL Labs](https://www.ssllabs.com/ssltest/analyze.html)

### 🎛️ AI consoles

- [AITunnel panel](https://aitunnel.ru/panel/)
- [ProxyAPI console](https://console.proxyapi.ru/)

### 🌐 Hosting & DNS

- [Reg.ru account](https://www.reg.ru/user/account/)
- [Reg.ru cloud](https://cloud.reg.ru/panel/)
- [ISPmanager](https://dnsadmin.hosting.reg.ru/manager/ispmgr)

### Mail

- [Setup guide](https://workspace.vk.ru/docs/saas/user-guides/mail/clients/)
- [Post master](https://postmaster.mail.ru/)
- [VK WorkSpace admin](https://app.workspace.vk.ru/admin)
- [VK WorkSpace mail](https://app.workspace.vk.ru/mail)

### 💳 Payments

- [YooKassa](https://yookassa.ru/)

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

## 🔗 Links

- [assistant-ui](https://www.assistant-ui.com/) — open-source React toolkit for production AI chat experiences.
