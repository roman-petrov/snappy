<!-- cspell:word scorm -->

# 🎓 Interactive learning course

## 💡 Concept

**Agent skill with tools.** The agent turns a topic, audience level, and learning goals into a **short animated web
course**: structured modules with explanations, examples, visuals, and light interactions—not a slide deck to present,
not a chat-only lesson, not a standalone quiz. While the course is being built, the user sees a **live preview** and can
walk through modules as they appear. When ready, Snappy publishes a **shareable link**; the learner opens it in a
browser, progresses step by step, and at the end completes a **knowledge check** derived from what the course actually
taught.

Combines and goes beyond three existing ideas:

- **Micro-course** — outline, modules, timing, recap; here the lesson is delivered as an interactive page, not only text
  in chat or a PDF.
- **Interactive presentation page** — web page, styles, transitions, live preview, publish link; here the flow is
  pedagogical (learn → practice → verify), not a linear pitch or report.
- **Quiz generator** — question types and scoring; here the assessment is tied to the course content, appears after
  learning, and can link weak answers back to the relevant module.

For onboarding, product explainers, team training, workshops, and self-study when the author wants one beautiful link
and proof that the viewer understood the material.

### What the agent uses

- **Skill workflow** — interview, outline approval, module-by-module generation, assessment design, publish.
- **Live preview** — phone- or desktop-sized view that updates as modules and animations are added; the user flips
  through finished sections and requests tweaks before publish.
- **Course page builder** — HTML/CSS (and light JS) for layout, typography, motion, progress, and optional embedded
  charts or diagrams from Snappy’s visual tools when the topic needs them.
- **Assessment builder** — generates questions from the course the agent just wrote; supports multiple choice,
  true/false, and short answer with automatic or rubric-based scoring where feasible.

The agent uses only facts and materials the user provided—no invented figures, policies, or citations.

### Success criteria (product)

- Author can go from brief to published link in one skill flow, with preview and iteration in Snappy.
- Learner completes the course and assessment in the browser without installing an app.
- Assessment questions are clearly grounded in the generated course content.
- Visual quality and motion feel intentional (closer to **greeting page** / **presentation page** polish than a plain
  document with a quiz pasted at the end).

### Out of scope for v1

- Full LMS: enrollments, deadlines, proctoring, SCORM export.
- Long multi-hour curricula; target is a **micro-course** length (roughly 5–20 minutes).
- Author dashboard with aggregate analytics across many learners — worth a follow-up idea if sharing links at scale
  matters.

## 👤 How the user experiences it

### Author (creates the course)

1. The user starts the skill or asks for an interactive learning course as a web page.
2. The agent asks step by step: topic, who it is for, how long it should take, what the learner must be able to do
   afterward, tone, colors, animation level (subtle vs playful), and whether modules should include quick inline checks
   before the final assessment.
3. The user pastes source material, uploads docs or slides, or names a subject without attachments. The agent proposes a
   **module outline** with rough timing and a short plan for the **final knowledge check**; the user confirms or edits.
4. During generation, the chat runs alongside a **live preview**. The user can open finished modules, check readability
   on a small screen, and ask for changes (“simpler module 2”, “add a diagram”, “less motion”, “harder final quiz”).
5. The agent adds a **closing assessment**: question count, types, pass threshold (e.g. 70%), and whether wrong answers
   show hints pointing to the relevant module.
6. When satisfied, the user **publishes** and receives a **shareable link**. Optionally they download a **PDF recap** or
   a **question sheet** for offline use—the primary experience remains the interactive course.

### Learner (takes the course)

1. The learner opens the link on phone, tablet, or desktop: clear navigation, readable text, smooth section transitions,
   optional progress indicator.
2. They move through modules in order (or jump via a table of contents if the author enabled it), reading explanations,
   watching lightweight animations, and optionally answering **inline checks** that give immediate feedback without
   grading the whole course yet.
3. After the last module, the learner starts the **knowledge check**. Questions cover key points from the course—not
   unrelated trivia.
4. On submit, they see **score**, **pass or fail** against the author’s threshold, and per-question feedback. Failed
   items can offer **retry** or **review module N** links when the author enabled them.
5. Optional: a short **completion message** or certificate-style summary screen when the learner passes—wording and
   branding come from what the user asked for, not generic stock copy.
