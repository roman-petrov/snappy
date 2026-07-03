<!-- cspell:word webfactory SemVer AiTunnel idempotency BotFather sendMessage -->

# 🚀 Automated release: SemVer, AI changelog, Telegram

## 💡 Concept

**Operations automation, agent-driven.** After production deploy, a release step chooses the next **SemVer**, announces
the release in **Russian** on Telegram, tags the deployed commit, and syncs the version on the server — web Settings and
Android WebView show the same number.

Built on Snappy’s **agent run mechanics** (same model as **coder-cli**): `Agent` + **tools**, multiple rounds,
structured finish via **`submit`**. Plain code handles Telegram HTML, git tag, and server manifest. Entry point:
**`release:publish`** (local and CI).

### Release analysis

The agent’s job is a **release-to-release review**, not a walk over individual commits.

- **Scope** — the full diff between the previous `v*` tag and the deployed commit: every changed file, every hunk.
  Commit messages and commit boundaries are metadata only; the source of truth is the **aggregate diff** for this
  release window.
- **Depth** — the agent uses tools to go beyond the diff text: open changed files, read related modules, grep for
  symbols and routes, skim locales and preset names — whatever is needed to see how edits fit the **project as a whole**
  and what actually reached users.
- **Synthesis** — map technical changes to product impact: new presets, UI flows, billing, fixes users would notice,
  internal-only refactors. From that picture, choose SemVer bump and 3–5 factual highlight bullets in Russian.
- **Finish** — call **`submit`** only after this pass is done; several tool rounds are expected, like a thorough
  coder-cli session focused on one question: “what shipped since the last release?”

### Agent with tools

- **Prompt** — product-manager role; drive the release analysis above.
- **Tools** — git diff and changed-files for the tag range; read / grep / glob from `@snappy/coder-store`;
  release-specific git helpers as needed.
- **`submit`** — returns `{ bump, highlights }`: patch, minor, or major; highlights grounded in the diff and files read.
- **After `submit`** — format post from a fixed template (HTML, escaped, length-capped) → Telegram → tag `vX.Y.Z` →
  runtime version manifest on the server.

### Pipeline

1. Clone repo, fetch tags, checkout the deployed commit; resolve previous `v*` tag.
2. Run the agent on the **full inter-release diff** until `submit` completes.
3. Telegram post → SemVer tag → server manifest, in that order.
4. Tag points at the commit already running in prod.

CI: extra GitHub Actions job after deploy (skippable via workflow input). **`--dry-run`** / **`--verbose`** preview
version and post text locally without Telegram, tag, or SSH.

### SemVer

- **patch** — fixes, tweaks, internal refactors
- **minor** — new features, noticeable UX improvements
- **major** — breaking changes (rare)

Source of truth: git tags `vX.Y.Z`; baseline `0.0.0` when no tags exist.

### Version in the app

**`GET /api/version`** → `{ version?, commit }`. Manifest stored outside the deploy directory; server uses stored
version when its commit matches the running deploy.

## 👤 How the user experiences it

### Operator

1. Triggers **Deploy** in GitHub Actions — build, ship, health check.
2. The **release** job runs `release:publish --commit <sha>` — the agent analyzes the full diff since the last tag, then
   Telegram, tag, and manifest follow.
3. Locally, runs `release:publish --dry-run --verbose` to preview version and post before a real release.
4. If deploy succeeded but release failed, prod stays live; re-run the release job. An already-tagged commit finishes
   without a second Telegram post.
5. If manifest sync fails after a successful tag, fixes the manifest or re-runs sync for that commit.

### Telegram channel

Subscribers read a short Russian post: version, highlights drawn from what the agent found in the release diff, link to
the app.

### App users

Settings shows `vX.Y.Z` after manifest sync; until then, a short commit id. Same for Android WebView over the SPA.
