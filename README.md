# Snappy

## 📋 Prerequisites

- ⌨️ [Cursor](https://cursor.com/)
  - 🔌 Install recommended workspace `VSCode` extensions.
- 📥 [Node.js 24](https://nodejs.org/en/download).
- 📥 [Bun](https://bun.com/)
- 📝 Fonts:
  - [Google Sans Code](https://fonts.google.com/specimen/Google+Sans+Code)
  - [Cascadia Code](https://fonts.google.com/specimen/Cascadia+Code)
- 🐳 [Docker](https://www.docker.com/products/docker-desktop/)
- 🐘 [pgAdmin](https://www.pgadmin.org/download/)
- 📱 [Android SDK](https://developer.android.com/tools/releases/platform-tools)

## 📱 Android Debug

The Android Debug build loads `https://home.local/app`. The dev machine must be named **home** (computer/hostname) so it
is reachable at **home.local**.

## 🔄 Workflow

- 📦 `!install.bat`: Install global tools.
- ⚙️ `!setup.bat`: Set up project dependencies.
- ✅ `!check.bat`: Run all CI checks.
- 🧹 `!cleanup.bat`: Clean up repository.
- 📦 `!upgrade.bat`: Upgrade dependencies interactively.
- 🔄 `!upgrade_actions.bat`: Upgrade GitHub Actions.

## 🤖 Model providers

- [AITunnel](https://aitunnel.ru/)
- [ProxyAPI](https://proxyapi.ru/)
- [RouterAI](https://routerai.ru/)

## 🦙 Ollama

**`ollama pull <tag>`** — download a model from the registry; substitute **`<tag>`** with a value from the tables (see
[ollama.com/library](https://ollama.com/library) for all names).

### 💬 Text

| Tag               | Note                                                                    |
| ----------------- | ----------------------------------------------------------------------- |
| **`qwen3:8b`**    | Qwen3 dense 8B; strong multilingual default for chat and tools.         |
| **`llama3.1:8b`** | Llama 3.1 instruct 8B; Meta baseline for English-heavy workflows.       |
| **`gemma3:12b`**  | Gemma 3 12B; Google’s current small-GPU tier, multimodal-capable build. |

### 🖼️ Image

| Tag                       | Note                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| **`x/flux2-klein:4b`**    | FLUX.2 Klein 4B; lighter Flux path on 12 GB.                                                |
| **`x/z-image-turbo:fp8`** | Z-Image Turbo (fp8); second official image stack (disk ~13 GB; can be tight on 12 GB VRAM). |
| **`x/flux2-klein:9b`**    | FLUX.2 Klein 9B; ~12 GB tier—matches a full 12 GB GPU for max Flux quality.                 |
