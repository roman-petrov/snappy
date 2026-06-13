---
id: help
name:
  en: "❓ Help & capabilities"
  ru: "❓ Справка и возможности"
description: "Explaining what the assistant can do and how the user can accomplish their goals."
---

# Skill: Help & Capabilities

## Goal

Interactive tour of what is possible here. Derive everything from the **live** skills catalog and tool definitions —
this file does not list product features.

1. **Overview** — compact map of user goals (no quoted examples).
2. **Pick** — user chooses a topic via structured form.
3. **Deep dive** — practical explanation and usage scenarios for that topic.
4. **Repeat** — another topic until the user starts a real task or has enough context.

Stay in this skill across turns until the user leaves help or begins execution.

## User Input Protocol

**CRITICAL:** Any decision, selection, or confirmation from the user → **tool invocation** with a structured form plan
in the **same turn**. Never ask via chat prose alone — no dangling “which one?”, no option lists only in the message.

Explain in chat; collect choices through the tool. Open-ended invites to describe a new goal are fine when you offer no
fixed options.

## Use When

- User asks what you can do, how you work, or what is available.
- User wants an overview or tour before starting a task.
- User asks how to accomplish something at a high level.

## Do Not Use When

- User gave a concrete task to execute — load the matching domain skill and proceed.
- User needs a one-line factual answer with no tour.

## Modes

**Overview** — broad help request; user has not yet chosen a topic.

**Deep dive** — user picked a topic, answered your form, or asked a focused “how does … work” question. If the first
message is already focused (e.g. only photo editing), skip Overview.

## Discovery

**Overview turn** — catalog `list`; scan every tool (when / input / output). Do **not** load full skill bodies.

**Deep dive turn** — map topic → catalog entries; `load` each related skill; re-check tools for this topic. Do not load
unrelated skills. If several entries match, load all of them.

## Overview

Brief, scannable, grouped by user goals (text, images, audio, …). One short line per catalog entry using its localized
title. Describe _what kinds of things_ are possible — no sample phrases, no skill bodies.

End the turn with a tool form: single choice of area to explore + `Other`. Do not deep-dive in the same turn.

## Deep Dive

One topic per turn. User-level language; no raw schemas.

**Required sections:**

1. **Headline** — restate their choice.
2. **Capabilities** — what it is for, what they provide, what they get, honest limits.
3. **How it works** — numbered steps at user level (clarify → work → result).
4. **Usage scenarios** — **2–4 mini-scenarios** for this topic only. Each: goal → example request phrasing → typical
   inputs (text, files, form choices) → outcome. Quote natural phrases here; this is where examples belong.
5. **Next** — tool form to explore another area (prefer options they have not opened yet) or a brief invite to start
   that kind of task.

If the topic spans several catalog workflows, give each its own scenario block rather than one vague paragraph. If too
much for one message, submit a sub-topic choice form first, then deep-dive the selection.

Do not execute unless the user explicitly asks to start in the same message.

## Checks

**Overview:** catalog listed, tools scanned, no full loads, no quoted examples, turn ends with tool form.

**Deep dive:** related skills loaded, 2–4 scenarios with example phrasing, on-topic only, interactive next step.

**Avoid:** loading all skills on overview; examples in overview; chat-only questions; deep dive without load; unrelated
skill loads; ignoring the user’s pick; execution during help without explicit request; generic AI capabilities not found
in discovery.
