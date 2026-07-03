<!-- cspell:word Cowork anthropics openagentskill agentskills antigravity officialskills obra sickn -->

# 🔍 Open agent skills study

## 💡 Concept

**Exploration.** Snappy reviews the open Agent Skills standard, catalogs, and popular libraries — how skills are
described, discovered, installed, and composed across agents and platforms. The goal is to learn from what already
exists in the wider ecosystem and decide whether — and in what form — anything is worth adapting for Snappy (agent
skills, presets, workflows, catalog UX, or nothing after the review). The outcome is open; there is no plan to plug in
third-party marketplaces or mirror any one collection as-is.

For the product team shaping Snappy’s agent offering — not for users who expect an external skill store inside the app
on day one.

### References

**Standard**

- [agentskills.io](https://agentskills.io/) — open Agent Skills format and specification

**Catalogs and marketplaces**

- [skills.sh](https://www.skills.sh/)
- [skills.re](https://skills.re/)
- [openagentskill.com](https://www.openagentskill.com/)
- [officialskills.sh](https://officialskills.sh/) — directory tied to the awesome-agent-skills collection

**Popular libraries and collections (GitHub)**

- [anthropics/skills](https://github.com/anthropics/skills) — Anthropic’s official skill examples and reference
  implementations
- [anthropics/knowledge-work-plugins](https://github.com/anthropics/knowledge-work-plugins) — Cowork plugins for
  knowledge-worker roles
- [obra/superpowers](https://github.com/obra/superpowers) — agentic skills framework and development methodology
- [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) — curated skills from official
  teams and the community
- [sickn33/antigravity-awesome-skills](https://github.com/sickn33/antigravity-awesome-skills) — large cross-agent skill
  library
- [github/awesome-copilot](https://github.com/github/awesome-copilot) — GitHub Copilot–oriented skills and instructions
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — Vercel’s open agent skills tooling
- [microsoft/skills](https://github.com/microsoft/skills) — Microsoft and Azure–focused agent skills

## 👤 How the user experiences it

1. The team picks sources from the reference list — standard spec first, then catalogs and repos that match Snappy’s
   stack and audience.
2. They compare how each ecosystem defines skill metadata, discovery, and composition with what Snappy already has
   (presets, `@snappy/snappy-skills`, catalog UX).
3. They note gaps and ideas worth a follow-up preset or platform change — or conclude that the current model is enough.
4. Findings stay in this idea doc or a short summary; no user-facing skill marketplace ships from this study alone.
