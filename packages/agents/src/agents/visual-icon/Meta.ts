// cspell:disable
/* jscpd:ignore-start */
import { StaticAgentMeta } from "../../common/static-agent";

export const Data = StaticAgentMeta(
  () =>
    ({
      "meta.description": [
        ``,
        `One icon — metaphor, style, palette, 2D/3D`,
        `Одна иконка — метафора, стиль, палитра, 2D/3D`,
      ],
      "meta.title": [``, `Icon`, `Иконка`],
      "ui.field.concept.label": [`💡`, `Metaphor & description`, `Метафора и описание`],
      "ui.field.concept.placeholder": [
        ``,
        `Metaphor (e.g. “calm focus”) + what to draw (e.g. “a lighthouse beam”) + mood…`,
        `Метафора (например «спокойный фокус») + что нарисовать + настроение…`,
      ],
      "ui.field.corners.label": [`📐`, `Corners`, `Углы`],
      "ui.field.corners.option.circle.label": [`⭕`, `Circle`, `Круг`],
      "ui.field.corners.option.rounded.label": [`⬜`, `Rounded`, `Скруглённые`],
      "ui.field.corners.option.sharp.label": [`◻️`, `Sharp`, `Острые`],
      "ui.field.detail.label": [`🔍`, `Detail`, `Детализация`],
      "ui.field.detail.option.minimal.label": [`◽`, `Minimal`, `Минимум`],
      "ui.field.detail.option.rich.label": [`▪️`, `Rich`, `Богаче`],
      "ui.field.detail.option.standard.label": [`◻️`, `Standard`, `Обычно`],
      "ui.field.dimension.label": [`📐`, `Dimension`, `Измерение`],
      "ui.field.dimension.option.flat_2d.label": [`⬜`, `Flat 2D`, `Плоский 2D`],
      "ui.field.dimension.option.glossy_3d.label": [`✨`, `Glossy 3D`, `Глянцевый 3D`],
      "ui.field.dimension.option.iso_3d.label": [`📦`, `Isometric`, `Изометрия`],
      "ui.field.dimension.option.layered_2d.label": [`📚`, `Layered 2D`, `Слои 2D`],
      "ui.field.dimension.option.soft_3d.label": [`🧊`, `Soft 3D`, `Мягкий 3D`],
      "ui.field.edge.label": [`🔷`, `Edge intent`, `Края`],
      "ui.field.edge.option.balanced.label": [`⚖️`, `Balanced`, `Баланс`],
      "ui.field.edge.option.crisp_vector.label": [`📐`, `Vector-ready`, `Под вектор`],
      "ui.field.edge.option.soft_raster.label": [`🖌️`, `Soft raster`, `Мягкий растр`],
      "ui.field.padding.label": [`↔️`, `Padding`, `Поля`],
      "ui.field.padding.option.airy.label": [`🌬️`, `Airy`, `Воздух`],
      "ui.field.padding.option.normal.label": [`↔️`, `Normal`, `Обычно`],
      "ui.field.padding.option.tight.label": [`🎯`, `Tight`, `Плотно`],
      "ui.field.palette.label": [`🎨`, `Palette`, `Палитра`],
      "ui.field.palette.option.amber_gold.label": [`✨`, `Amber gold`, `Янтарь золото`],
      "ui.field.palette.option.black_solid.label": [`🖤`, `Black solid`, `Чёрный`],
      "ui.field.palette.option.blue_white.label": [`🔵`, `Blue on white`, `Синий на белом`],
      "ui.field.palette.option.duo_brand.label": [`🌈`, `Brand duo`, `Два бренд-цвета`],
      "ui.field.palette.option.gray_mono.label": [`⬛`, `Gray mono`, `Серый моно`],
      "ui.field.palette.option.green_eco.label": [`🍏`, `Green eco`, `Зелёный эко`],
      "ui.field.palette.option.orange_warm.label": [`🌅`, `Orange warm`, `Тёплый оранж`],
      "ui.field.palette.option.purple_ui.label": [`💜`, `Purple UI`, `Фиолет UI`],
      "ui.field.palette.option.rose_pink.label": [`🌸`, `Rose pink`, `Розовый`],
      "ui.field.palette.option.slate_muted.label": [`🌫️`, `Slate muted`, `Приглушённый сланец`],
      "ui.field.palette.option.teal_cyan.label": [`🩵`, `Teal cyan`, `Бирюза циан`],
      "ui.field.palette.option.white_dark.label": [`⬜`, `White on dark`, `Белый на тёмном`],
      "ui.field.style.label": [`🖌️`, `Style`, `Стиль`],
      "ui.field.style.option.duotone.label": [`🎭`, `Duotone`, `Дуотон`],
      "ui.field.style.option.glass.label": [`🪟`, `Glass`, `Стекло`],
      "ui.field.style.option.gradient_soft.label": [`🌅`, `Gradient`, `Градиент`],
      "ui.field.style.option.ink_sketch.label": [`✒️`, `Ink sketch`, `Тушь`],
      "ui.field.style.option.minimal_flat.label": [`◻️`, `Minimal flat`, `Минимализм`],
      "ui.field.style.option.neumorph.label": [`🌫️`, `Neumorphic`, `Неоморфизм`],
      "ui.field.style.option.outline_stroke.label": [`➿`, `Outline`, `Контур`],
      "ui.field.style.option.pixel.label": [`👾`, `Pixel`, `Пиксель-арт`],
      "ui.field.style.option.silhouette_fill.label": [`⬛`, `Silhouette`, `Силуэт`],
      "ui.field.tile.label": [`🖼️`, `Tile`, `Плитка`],
      "ui.field.tile.option.gradient_bg.label": [`🌅`, `Soft gradient`, `Мягкий градиент`],
      "ui.field.tile.option.none.label": [`🫥`, `None`, `Без плитки`],
      "ui.field.tile.option.square_dark.label": [`⬛`, `Dark square`, `Тёмная`],
      "ui.field.tile.option.square_light.label": [`⬜`, `Light square`, `Светлая`],
    }) as const,
  ({ i18n, parameters }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `🎯`,
      group: `visual`,
      plan: {
        fields: [
          {
            id: `concept`,
            kind: `text`,
            label: i18n(`ui.field.concept.label`),
            placeholder: i18n(`ui.field.concept.placeholder`),
            prompt: `Metaphor and description for the icon (required): state what the icon stands for, what should appear on canvas, and any mood or context.`,
          },
          {
            default: `flat_2d`,
            id: `dimension`,
            kind: `tabs_single`,
            label: i18n(`ui.field.dimension.label`),
            options: [
              {
                label: i18n(`ui.field.dimension.option.flat_2d.label`),
                prompt: `Render as flat 2D graphic: shapes sit on one plane, even fills or strokes, minimal depth cues.`,
                value: `flat_2d`,
              },
              {
                label: i18n(`ui.field.dimension.option.layered_2d.label`),
                prompt: `Render as layered 2D: clear overlap, subtle drop shadows or separation between planes, still read as illustration not sculpture.`,
                value: `layered_2d`,
              },
              {
                label: i18n(`ui.field.dimension.option.soft_3d.label`),
                prompt: `Render as soft 3D: gentle bevels, rounded volumes, soft studio lighting, toy-like or app-icon chip depth.`,
                value: `soft_3d`,
              },
              {
                label: i18n(`ui.field.dimension.option.iso_3d.label`),
                prompt: `Render in isometric 3D: consistent 30°-style projection, readable geometry, crisp faces.`,
                value: `iso_3d`,
              },
              {
                label: i18n(`ui.field.dimension.option.glossy_3d.label`),
                prompt: `Render as glossy 3D: specular highlights, smooth plastic or glass-like material, controlled reflections.`,
                value: `glossy_3d`,
              },
            ],
          },
          {
            default: `minimal_flat`,
            id: `style`,
            kind: `tabs_single`,
            label: i18n(`ui.field.style.label`),
            options: [
              {
                label: i18n(`ui.field.style.option.minimal_flat.label`),
                prompt: `Minimal flat UI language: simple geometry, few elements, generous whitespace inside the glyph.`,
                value: `minimal_flat`,
              },
              {
                label: i18n(`ui.field.style.option.outline_stroke.label`),
                prompt: `Outline icon: uniform stroke weight, rounded or mitered joins as fits the corner setting; interior detail spare.`,
                value: `outline_stroke`,
              },
              {
                label: i18n(`ui.field.style.option.silhouette_fill.label`),
                prompt: `Solid silhouette: one dominant filled shape, high contrast, legible at 24px.`,
                value: `silhouette_fill`,
              },
              {
                label: i18n(`ui.field.style.option.duotone.label`),
                prompt: `Duotone treatment: exactly two flat fills working as primary and accent inside one glyph.`,
                value: `duotone`,
              },
              {
                label: i18n(`ui.field.style.option.glass.label`),
                prompt: `Glassmorphism: translucent panels, light refraction, soft blur behind glass layers.`,
                value: `glass`,
              },
              {
                label: i18n(`ui.field.style.option.neumorph.label`),
                prompt: `Soft neumorphic relief: subtle dual shadows, element appears extruded from same-tone surface.`,
                value: `neumorph`,
              },
              {
                label: i18n(`ui.field.style.option.gradient_soft.label`),
                prompt: `Smooth gradients within shapes: modern app-icon polish, controlled color stops.`,
                value: `gradient_soft`,
              },
              {
                label: i18n(`ui.field.style.option.pixel.label`),
                prompt: `Pixel-art aesthetic: visible pixel grid, limited palette inside the style, crisp block forms.`,
                value: `pixel`,
              },
              {
                label: i18n(`ui.field.style.option.ink_sketch.label`),
                prompt: `Hand-inked sketch look: confident linework, optional light wash, still reads as one icon.`,
                value: `ink_sketch`,
              },
            ],
          },
          {
            default: `blue_white`,
            id: `palette`,
            kind: `tabs_single`,
            label: i18n(`ui.field.palette.label`),
            options: [
              {
                label: i18n(`ui.field.palette.option.blue_white.label`),
                prompt: `Primary blue icon (around #2563eb family) on white or near-white field.`,
                value: `blue_white`,
              },
              {
                label: i18n(`ui.field.palette.option.gray_mono.label`),
                prompt: `Monochrome slate: charcoal or dark gray glyph on light gray tile (#f3f4f6-class).`,
                value: `gray_mono`,
              },
              {
                label: i18n(`ui.field.palette.option.white_dark.label`),
                prompt: `White or light glyph on dark ground (#111827–#1f2937-class), strong contrast.`,
                value: `white_dark`,
              },
              {
                label: i18n(`ui.field.palette.option.duo_brand.label`),
                prompt: `Two harmonious hues: name primary and accent roles in the prompt (main shape vs detail).`,
                value: `duo_brand`,
              },
              {
                label: i18n(`ui.field.palette.option.green_eco.label`),
                prompt: `Fresh green (#16a34a-class) with off-white; natural, calm energy.`,
                value: `green_eco`,
              },
              {
                label: i18n(`ui.field.palette.option.orange_warm.label`),
                prompt: `Warm orange or amber accent on neutral light ground.`,
                value: `orange_warm`,
              },
              {
                label: i18n(`ui.field.palette.option.purple_ui.label`),
                prompt: `Violet or purple on white; contemporary product UI feel.`,
                value: `purple_ui`,
              },
              {
                label: i18n(`ui.field.palette.option.teal_cyan.label`),
                prompt: `Teal or cyan-forward palette with white or pale gray.`,
                value: `teal_cyan`,
              },
              {
                label: i18n(`ui.field.palette.option.rose_pink.label`),
                prompt: `Rose or soft pink accent with neutral balance; gentle modern.`,
                value: `rose_pink`,
              },
              {
                label: i18n(`ui.field.palette.option.amber_gold.label`),
                prompt: `Amber or gold highlights on deep or warm neutral base.`,
                value: `amber_gold`,
              },
              {
                label: i18n(`ui.field.palette.option.black_solid.label`),
                prompt: `Near-black silhouette on white or transparent-look field; maximum graphic punch.`,
                value: `black_solid`,
              },
              {
                label: i18n(`ui.field.palette.option.slate_muted.label`),
                prompt: `Muted slate and blue-gray tones; understated professional.`,
                value: `slate_muted`,
              },
            ],
          },
          {
            default: `balanced`,
            id: `edge`,
            kind: `tabs_single`,
            label: i18n(`ui.field.edge.label`),
            options: [
              {
                label: i18n(`ui.field.edge.option.crisp_vector.label`),
                prompt: `Crisp closed shapes and clean edges: high-contrast boundaries suitable for later vector tracing; flat color regions, avoid noisy texture at edges.`,
                value: `crisp_vector`,
              },
              {
                label: i18n(`ui.field.edge.option.soft_raster.label`),
                prompt: `Soft painted or airbrushed edges: subtle gradients and texture welcome; painterly finish.`,
                value: `soft_raster`,
              },
              {
                label: i18n(`ui.field.edge.option.balanced.label`),
                prompt: `Balanced edge treatment: clean readable silhouette with light anti-aliased softness.`,
                value: `balanced`,
              },
            ],
          },
          {
            default: `rounded`,
            id: `corners`,
            kind: `tabs_single`,
            label: i18n(`ui.field.corners.label`),
            options: [
              {
                label: i18n(`ui.field.corners.option.rounded.label`),
                prompt: `Round corners on outer tile and on internal shapes where applicable; friendly UI feel.`,
                value: `rounded`,
              },
              {
                label: i18n(`ui.field.corners.option.sharp.label`),
                prompt: `Sharp corners and precise geometry; technical or editorial tone.`,
                value: `sharp`,
              },
              {
                label: i18n(`ui.field.corners.option.circle.label`),
                prompt: `Compose inside a circular mask; content centered and balanced for round app icon.`,
                value: `circle`,
              },
            ],
          },
          {
            default: `normal`,
            id: `padding`,
            kind: `tabs_single`,
            label: i18n(`ui.field.padding.label`),
            options: [
              {
                label: i18n(`ui.field.padding.option.tight.label`),
                prompt: `Tight margins: glyph occupies most of the square, small outer breathing room.`,
                value: `tight`,
              },
              {
                label: i18n(`ui.field.padding.option.normal.label`),
                prompt: `Standard icon padding: roughly 20–25% margin around the glyph.`,
                value: `normal`,
              },
              {
                label: i18n(`ui.field.padding.option.airy.label`),
                prompt: `Airy layout: smaller glyph with generous margin; calm negative space.`,
                value: `airy`,
              },
            ],
          },
          {
            default: `square_light`,
            id: `tile`,
            kind: `tabs_single`,
            label: i18n(`ui.field.tile.label`),
            options: [
              {
                label: i18n(`ui.field.tile.option.square_light.label`),
                prompt: `Light rounded-square tile behind the icon; soft elevation optional.`,
                value: `square_light`,
              },
              {
                label: i18n(`ui.field.tile.option.square_dark.label`),
                prompt: `Dark rounded-square tile; icon reads as light-on-dark.`,
                value: `square_dark`,
              },
              {
                label: i18n(`ui.field.tile.option.none.label`),
                prompt: `No separate tile: icon sits on a flat field or clean gradient only.`,
                value: `none`,
              },
              {
                label: i18n(`ui.field.tile.option.gradient_bg.label`),
                prompt: `Soft gradient field behind the icon; keep gradient subtle so the glyph stays dominant.`,
                value: `gradient_bg`,
              },
            ],
          },
          {
            default: `standard`,
            id: `detail`,
            kind: `tabs_single`,
            label: i18n(`ui.field.detail.label`),
            options: [
              {
                label: i18n(`ui.field.detail.option.minimal.label`),
                prompt: `Minimal detail: one or two visual ideas, maximum clarity at 24–32px.`,
                value: `minimal`,
              },
              {
                label: i18n(`ui.field.detail.option.standard.label`),
                prompt: `Standard detail level: readable embellishment, balanced for app icon use.`,
                value: `standard`,
              },
              {
                label: i18n(`ui.field.detail.option.rich.label`),
                prompt: `Richer detail: secondary elements allowed if they stay inside the safe margin and read at medium sizes.`,
                value: `rich`,
              },
            ],
          },
        ],
      },
      prompt: `You are an art-director for a single app icon asset. Read the **Metaphor & description** line as the creative brief. **Before** you compose the final output, analyze the metaphor in depth (keep this reasoning internal—do not output it): identify the abstract idea and what it must communicate; list concrete subject(s), props, and symbols; enumerate metaphor **attributes** and **properties** (e.g. stability vs motion, openness vs enclosure, warmth vs cold, precision vs softness, direction, scale, balance) and note how each should read **visually**; resolve ambiguities by choosing one coherent reading. Map every important attribute to drawable decisions: silhouette logic, focal hierarchy, secondary shapes, implied motion or gaze, use of negative space, and what reads at a glance. Merge that resolved brief with every bullet below (dimension, style, palette, edge intent, corners, padding, tile, detail). Then write **one** exceptionally detailed prompt **for image generation** (it will be sent to the image model). That prompt must **thoroughly describe the metaphor for the image model**: translate the abstract idea into explicit pictorial instructions—what appears, how elements relate, what each part signifies—so a text-to-image model can render the idea without guessing; do not rely on a bare label alone. Also spell out silhouette or stroke logic, color roles and approximate hues, lighting and shadows for the chosen dimension, material feel (matte, glass, plastic, paper), composition (exactly **one** icon centered in the square frame, generous safe margin, readable at small sizes), background treatment, and edge character (razor-clean for vector workflows versus soft painted pixels). Describe the shot as **one** finished square icon filling the frame—hero asset only. That prompt **must explicitly instruct** the image model: **no** text, letters, numbers, captions, watermarks, logos-as-type, or any typography in the image—**pictorial icon artwork only**. It **must also explicitly instruct** scaling the subject to **use as much of the available square area as the chosen padding and composition allow**, **without stretching**: maximize footprint while **preserving the subject’s aspect ratio**. **Hard limit: the final string must be at most ${parameters.maxImagePromptLength} characters (counting spaces); compress wording and drop optional flourishes if needed to stay within this cap.** Reply with that full string only—no other text.`,
      title: i18n(`meta.title`),
    }) as const,
);
/* jscpd:ignore-end */
