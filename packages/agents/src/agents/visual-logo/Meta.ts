// cspell:disable
/* jscpd:ignore-start */
import { StaticAgentMeta } from "../../common/static-agent";

export const Data = StaticAgentMeta(
  () =>
    ({
      "meta.description": [``, `Logo mark — structured options, then generate`, `Логотип — структурированные опции`],
      "meta.title": [``, `Logo`, `Логотип`],
      "ui.field.background.label": [`🖼️`, `Preview bg`, `Фон превью`],
      "ui.field.background.option.dark.label": [`⬛`, `Dark`, `Тёмный`],
      "ui.field.background.option.gray.label": [`🌫️`, `Light gray`, `Светло-серый`],
      "ui.field.background.option.white.label": [`⬜`, `White`, `Белый`],
      "ui.field.brand.label": [`✨`, `Brand / letters`, `Бренд / буквы`],
      "ui.field.brand.placeholder": [``, `Name or letters to show…`, `Название или буквы…`],
      "ui.field.industry.label": [`🏢`, `Industry`, `Сфера`],
      "ui.field.industry.option.creative.label": [`🎨`, `Creative`, `Креатив`],
      "ui.field.industry.option.eco.label": [`🌿`, `Eco`, `Эко`],
      "ui.field.industry.option.education.label": [`🎓`, `Education`, `Образование`],
      "ui.field.industry.option.finance.label": [`💰`, `Finance`, `Финансы`],
      "ui.field.industry.option.food.label": [`☕`, `Food & drink`, `Еда`],
      "ui.field.industry.option.health.label": [`🏥`, `Health`, `Здоровье`],
      "ui.field.industry.option.retail.label": [`🛒`, `Retail`, `Ритейл`],
      "ui.field.industry.option.sport.label": [`💪`, `Sport`, `Спорт`],
      "ui.field.industry.option.tech.label": [`💻`, `Tech`, `IT`],
      "ui.field.layout.label": [`📐`, `Lockup`, `Связка`],
      "ui.field.layout.option.compact.label": [`⬜`, `Centered compact`, `Компакт`],
      "ui.field.layout.option.horizontal.label": [`↔️`, `Horizontal`, `Горизонтально`],
      "ui.field.layout.option.stacked.label": [`↕️`, `Stacked`, `Столбиком`],
      "ui.field.layout.option.wide.label": [`➡️`, `Word only wide`, `Широкий текст`],
      "ui.field.mark_type.label": [`🔰`, `Mark type`, `Тип знака`],
      "ui.field.mark_type.option.abstract.label": [`⬡`, `Abstract`, `Абстракция`],
      "ui.field.mark_type.option.badge.label": [`◯`, `Badge`, `Шильд`],
      "ui.field.mark_type.option.combo.label": [`🎯`, `Symbol + text`, `Знак + текст`],
      "ui.field.mark_type.option.mascot.label": [`🐾`, `Mascot`, `Маскот`],
      "ui.field.mark_type.option.wordmark.label": [`🔤`, `Wordmark`, `Вордмарк`],
      "ui.field.palette.label": [`🎨`, `Palette`, `Палитра`],
      "ui.field.palette.option.bw.label": [`⬛`, `Black & white`, `Ч/Б`],
      "ui.field.palette.option.cool_duo.label": [`🌊`, `Cool duo`, `Холодная пара`],
      "ui.field.palette.option.gold_foil.label": [`✨`, `Gold foil`, `Золото`],
      "ui.field.palette.option.green.label": [`🌿`, `Green nature`, `Зелёная`],
      "ui.field.palette.option.mono_blue.label": [`🔵`, `Blue mono`, `Синяя`],
      "ui.field.palette.option.multi.label": [`🌈`, `Multi (3–4)`, `3–4 цвета`],
      "ui.field.palette.option.purple.label": [`💜`, `Purple tech`, `Фиолет tech`],
      "ui.field.palette.option.warm_duo.label": [`🌅`, `Warm duo`, `Тёплая пара`],
      "ui.field.style.label": [`🖌️`, `Style`, `Стиль`],
      "ui.field.style.option.bold.label": [`💪`, `Bold`, `Жирный`],
      "ui.field.style.option.geometric.label": [`◻️`, `Geometric`, `Геометрия`],
      "ui.field.style.option.minimal.label": [`◻️`, `Minimal`, `Минимализм`],
      "ui.field.style.option.neon.label": [`⚡`, `Tech neon`, `Tech`],
      "ui.field.style.option.organic.label": [`〰️`, `Organic`, `Органика`],
      "ui.field.style.option.vintage.label": [`📜`, `Vintage`, `Винтаж`],
      "ui.field.tagline.label": [`📝`, `Optional tagline`, `Слоган`],
      "ui.field.tagline.placeholder": [
        ``,
        `Short subtitle under logo — or leave empty`,
        `Короткая строка под логотипом — или пусто`,
      ],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `🏷️`,
      group: `visual`,
      plan: {
        fields: [
          {
            id: `brand`,
            kind: `text`,
            label: i18n(`ui.field.brand.label`),
            placeholder: i18n(`ui.field.brand.placeholder`),
            prompt: `Brand name or letters in the logo (required):`,
          },
          {
            default: `tech`,
            id: `industry`,
            kind: `tabs_single`,
            label: i18n(`ui.field.industry.label`),
            options: [
              {
                label: i18n(`ui.field.industry.option.tech.label`),
                prompt: `Tech / SaaS: precise geometry, future-friendly.`,
                value: `tech`,
              },
              {
                label: i18n(`ui.field.industry.option.food.label`),
                prompt: `Cafe, restaurant, or food brand: appetizing, organic shapes.`,
                value: `food`,
              },
              {
                label: i18n(`ui.field.industry.option.sport.label`),
                prompt: `Sports or fitness: dynamic angles, energy.`,
                value: `sport`,
              },
              {
                label: i18n(`ui.field.industry.option.finance.label`),
                prompt: `Finance or legal: trust, stability, conservative flair.`,
                value: `finance`,
              },
              {
                label: i18n(`ui.field.industry.option.health.label`),
                prompt: `Health or wellness: clean, caring, professional.`,
                value: `health`,
              },
              {
                label: i18n(`ui.field.industry.option.creative.label`),
                prompt: `Creative studio or design: expressive but professional.`,
                value: `creative`,
              },
              {
                label: i18n(`ui.field.industry.option.eco.label`),
                prompt: `Eco or sustainability: natural forms, leaves, circles.`,
                value: `eco`,
              },
              {
                label: i18n(`ui.field.industry.option.education.label`),
                prompt: `Education or kids: friendly, clear, approachable.`,
                value: `education`,
              },
              {
                label: i18n(`ui.field.industry.option.retail.label`),
                prompt: `Retail or e-commerce: memorable mark, shopping clarity.`,
                value: `retail`,
              },
            ],
          },
          {
            default: `wordmark`,
            id: `mark_type`,
            kind: `tabs_single`,
            label: i18n(`ui.field.mark_type.label`),
            options: [
              {
                label: i18n(`ui.field.mark_type.option.wordmark.label`),
                prompt: `Typography-led logo; custom letter shapes allowed.`,
                value: `wordmark`,
              },
              {
                label: i18n(`ui.field.mark_type.option.combo.label`),
                prompt: `Icon beside or above the brand name; balanced lockup.`,
                value: `combo`,
              },
              {
                label: i18n(`ui.field.mark_type.option.badge.label`),
                prompt: `Circular or shield badge enclosing symbol and/or text.`,
                value: `badge`,
              },
              {
                label: i18n(`ui.field.mark_type.option.mascot.label`),
                prompt: `Simple mascot or character mark with optional name.`,
                value: `mascot`,
              },
              {
                label: i18n(`ui.field.mark_type.option.abstract.label`),
                prompt: `Abstract geometric mark; may include initials only.`,
                value: `abstract`,
              },
            ],
          },
          {
            default: `mono_blue`,
            id: `palette`,
            kind: `tabs_single`,
            label: i18n(`ui.field.palette.label`),
            options: [
              {
                label: i18n(`ui.field.palette.option.mono_blue.label`),
                prompt: `Blue single-hue family with white/light gray.`,
                value: `mono_blue`,
              },
              {
                label: i18n(`ui.field.palette.option.bw.label`),
                prompt: `Strict black on white or inverse; no extra hues.`,
                value: `bw`,
              },
              {
                label: i18n(`ui.field.palette.option.warm_duo.label`),
                prompt: `Two-color warm pair: e.g. deep orange + cream, or burgundy + gold.`,
                value: `warm_duo`,
              },
              {
                label: i18n(`ui.field.palette.option.cool_duo.label`),
                prompt: `Two-color cool pair: teal + navy, or blue + mint.`,
                value: `cool_duo`,
              },
              {
                label: i18n(`ui.field.palette.option.multi.label`),
                prompt: `Three to four harmonious brand colors; specify hierarchy (primary vs accent).`,
                value: `multi`,
              },
              {
                label: i18n(`ui.field.palette.option.gold_foil.label`),
                prompt: `Dark base with metallic gold or champagne accent.`,
                value: `gold_foil`,
              },
              {
                label: i18n(`ui.field.palette.option.purple.label`),
                prompt: `Purple and violet gradients with white—tech startup vibe.`,
                value: `purple`,
              },
              {
                label: i18n(`ui.field.palette.option.green.label`),
                prompt: `Forest, sage, and cream—natural brand.`,
                value: `green`,
              },
            ],
          },
          {
            default: `minimal`,
            id: `style`,
            kind: `tabs_single`,
            label: i18n(`ui.field.style.label`),
            options: [
              {
                label: i18n(`ui.field.style.option.minimal.label`),
                prompt: `Minimal geometry; generous whitespace.`,
                value: `minimal`,
              },
              {
                label: i18n(`ui.field.style.option.bold.label`),
                prompt: `Bold weight; high contrast shapes.`,
                value: `bold`,
              },
              {
                label: i18n(`ui.field.style.option.vintage.label`),
                prompt: `Vintage badge, serif touches, subtle texture.`,
                value: `vintage`,
              },
              {
                label: i18n(`ui.field.style.option.geometric.label`),
                prompt: `Strict geometric construction; grid-based.`,
                value: `geometric`,
              },
              {
                label: i18n(`ui.field.style.option.organic.label`),
                prompt: `Soft curves and natural flow; hand-refined feel.`,
                value: `organic`,
              },
              {
                label: i18n(`ui.field.style.option.neon.label`),
                prompt: `Sleek tech: thin lines, subtle glow on dark (if palette allows).`,
                value: `neon`,
              },
            ],
          },
          {
            default: `horizontal`,
            id: `layout`,
            kind: `tabs_single`,
            label: i18n(`ui.field.layout.label`),
            options: [
              {
                label: i18n(`ui.field.layout.option.horizontal.label`),
                prompt: `Horizontal lockup: icon left, text right (or reverse).`,
                value: `horizontal`,
              },
              {
                label: i18n(`ui.field.layout.option.stacked.label`),
                prompt: `Stacked: icon above text, centered.`,
                value: `stacked`,
              },
              {
                label: i18n(`ui.field.layout.option.compact.label`),
                prompt: `Compact square-friendly mark for app icon use.`,
                value: `compact`,
              },
              {
                label: i18n(`ui.field.layout.option.wide.label`),
                prompt: `Wide horizontal wordmark banner.`,
                value: `wide`,
              },
            ],
          },
          {
            default: `white`,
            id: `background`,
            kind: `tabs_single`,
            label: i18n(`ui.field.background.label`),
            options: [
              {
                label: i18n(`ui.field.background.option.white.label`),
                prompt: `Show logo on pure white background.`,
                value: `white`,
              },
              {
                label: i18n(`ui.field.background.option.dark.label`),
                prompt: `Show logo on dark (#111–#222) to prove contrast.`,
                value: `dark`,
              },
              {
                label: i18n(`ui.field.background.option.gray.label`),
                prompt: `Show on light gray to test edge clarity.`,
                value: `gray`,
              },
            ],
          },
          {
            id: `tagline`,
            kind: `text`,
            label: i18n(`ui.field.tagline.label`),
            placeholder: i18n(`ui.field.tagline.placeholder`),
            prompt: `Optional tagline text under the logo (one short line, or empty):`,
          },
        ],
      },
      prompt: `You build image-generation prompts. From the **brand** line (required text), every tab below, and optional tagline line, write **one** detailed prompt **for image generation**: a **single logo artwork** on a simple background (it will be sent to the image model). Reflect industry, mark type, complexity, **palette by tab name**, style, and layout. Demand legibility at small sizes. End: no watermark; no laptop/phone mockups—logo only. Reply with that string only—no other text.`,
      title: i18n(`meta.title`),
    }) as const,
);
/* jscpd:ignore-end */
