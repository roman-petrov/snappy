<!-- cspell:word crossfade inpaint ultrawide wordmark -->

# 💡 Product ideas backlog

## 📚 Learning

### 📄 Micro-course generator

Turn a topic and audience level into a compact learning path: modules, key points, examples, and a short recap. Export
as a print-ready **PDF** or as an **interactive** lesson in the app (sections, progress, optional knowledge checks). The
user can refine scope and depth before generation.

### 🖥️ Presentation builder

Build a slide deck from a brief: the agent proposes an outline, then fills slides with titles, speaker notes, and visual
direction. Support exports to **PDF**, **PPTX**, or an in-app web player. Useful for pitches, lessons, and internal
updates without starting from a blank deck.

### ❓ Quiz generator

Create questions and answers from pasted source text or a stated topic. Output formats include a printable study sheet,
an interactive quiz with scoring, or embeddable HTML for sharing. Difficulty and question types (choice, short answer,
true/false) should be configurable.

## 🖼️ Visual

### ✏️ Prompt image editing

Upload an image and describe the change: inpaint a region, restyle the whole frame, remove objects, or replace elements.
The workflow keeps composition where possible instead of regenerating from scratch. Masking or region hints improve
precision for local edits.

### 🖼️ Wallpaper generator

Generate backgrounds tuned to device class (phone, tablet, desktop, **ultrawide**) with correct aspect ratio and
resolution. Control mood, palette, and complexity; reserve safe areas so system icons and widgets stay readable.
Optional variants (light/dark, cropped focus).

### 🪪 Business & promo cards

Produce visiting cards, flyers, and social promo tiles at **exact dimensions** with bleed and safe zones. Presets for
common print and platform sizes (mm and px). User supplies brand name, contacts, offer text, and visual style; output is
ready for print or upload.

### 🔲 Branded QR codes

Generate scannable QR codes with a **center icon**, brand colors, rounded modules, and a proper quiet zone. Export as
vector SVG or high-resolution PNG. Validate contrast and error correction so codes remain reliable on screen and in
print.

### 🔄 Visual redesign

Start from a reference image (screenshot, mockup, or photo) plus goals: modernize UI, change palette, simplify layout,
or shift style. Let the user lock elements that must stay (logo position, grid, key copy) while the model explores
alternatives.

## 📐 Vector

### ⬛ Monochrome SVG icon

A single-color icon as clean SVG paths: no embedded raster, minimal nodes, readable at 16px. Suited for toolbars,
favicons, and strict brand rules where only one ink color is allowed.

### 🎨 Color SVG icon

Flat or limited-palette vector icon with explicit fill and stroke roles. Output remains editable in design tools and
scales without blur. Optional alignment to a small token palette from the product theme.

### 📦 Raster icon set

From one approved concept, export a full **icon set**: PNG and/or WebP at standard sizes (16, 24, 32, 48, 64, 128, 256,
512). Consistent padding and optical centering across sizes; optional @2x/@3x naming for mobile targets.

### ✒️ Vector SVG logo

Logo as true vector SVG (paths and text outlined where needed), not a flattened image mockup. Supports mark-only,
wordmark, or combined lockups. Intended for sites, apps, and vendor handoff.

### 📊 Vector charts & diagrams

Charts built as **SVG** from user data (and optional PNG preview): axes, series, and legends are real markup, not a
screenshot from an image model. Types include bar, line, pie, and simple flow diagrams. Numbers must match input
exactly.

### 🔤 Chart typography

When generating vector charts, let the user pick **fonts** for titles, axis labels, and legends—from project defaults or
an uploaded file. Keep licensing and fallback stacks explicit in export metadata.

## 🎬 Media

### 🎞️ Client-side slideshow video

Assemble a video in the browser with **ffmpeg.wasm**: image sequence or folder, background music, duration per slide,
**crossfade**, and optional captions. Export MP4 or WebM without sending media to the server. Trim audio and normalize
loudness where feasible.

### 🧪 Pixel-shader micro-agent

A small agent that writes and iterates **GLSL** fragment shaders: ray-marched scenes, **SDF** typography, greeting
postcards, and data-driven charts fed by external JSON or CSV. Preview on canvas; record or transcode loops to video for
sharing. Good fit for a **Lab** group experiment.

## 💼 Business

### 💡 Business idea + market scan

Generate venture or product ideas from a niche or problem statement, then enrich with **web-grounded** research: likely
competitors, trends, risks, and a rough positioning line. Present as a short memo the user can refine—not financial
advice, but a structured starting point.

## 🎨 Design

### 🧩 Design-system component layouts

From a brief and token set (spacing, radius, type scale, colors), propose layouts for core UI pieces: buttons, inputs,
cards, modals, navigation. Output as annotated specs or visual mocks that align with the existing theme package rather
than one-off pixels.

### 🌐 Website design

Page or landing concepts from goals and audience: information architecture, section order, hero, and content blocks.
Deliver wireframe-level structure or a higher-fidelity direction the user can hand to implementation. Multiple variants
per run optional.
