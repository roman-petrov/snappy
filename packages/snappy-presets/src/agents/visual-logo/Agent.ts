// cspell:disable
/* jscpd:ignore-start */
import { StaticVisualAgent } from "@snappy/snappy-sdk";

import { Prompts } from "../../Prompts";

export const Agent = StaticVisualAgent(
  () =>
    ({
      "meta.description": [`Logo mark — structured options, then generate`, `Логотип — структурированные опции`],
      "meta.prompt": Prompts.visual.joinMeta([
        `You build image-generation prompts. From the **brand** line (required text), every tab below, and optional tagline line, write **one** detailed prompt **for image generation**: a **single logo artwork** on a simple background (it will be sent to the image model). Reflect industry, mark type, complexity, **palette by tab name**, style, and layout. Demand legibility at small sizes. No laptop/phone mockups—logo only.`,
        `Собери **один** промпт для генерации **одного** логотипа на простом фоне по строке **бренд** (обязательно), всем вкладкам и необязательному слогану. Учти сферу, тип знака, сложность, **палитру по названию вкладок**, стиль и связку. Читаемость в мелком масштабе. Без мокапов ноутбуков/телефонов — только знак.`,
      ]),
      "meta.title": [`Logo`, `Логотип`],
      "ui.field.background.label": [`Preview bg`, `Фон превью`],
      "ui.field.background.option.dark.label": [`Dark`, `Тёмный`],
      "ui.field.background.option.dark.prompt": [
        `Show logo on dark (#111–#222) to prove contrast.`,
        `Логотип на тёмном (#111–#222) для проверки контраста.`,
      ],
      "ui.field.background.option.gray.label": [`Light gray`, `Светло-серый`],
      "ui.field.background.option.gray.prompt": [
        `Show on light gray to test edge clarity.`,
        `На светло-сером для проверки краёв.`,
      ],
      "ui.field.background.option.white.label": [`White`, `Белый`],
      "ui.field.background.option.white.prompt": [
        `Show logo on pure white background.`,
        `Логотип на чисто белом фоне.`,
      ],
      "ui.field.brand.label": [`Brand / letters`, `Бренд / буквы`],
      "ui.field.brand.placeholder": [`Name or letters to show…`, `Название или буквы…`],
      "ui.field.brand.prompt": [
        `Brand name or letters in the logo (required):`,
        `Название или буквы в логотипе (обязательно):`,
      ],
      "ui.field.industry.label": [`Industry`, `Сфера`],
      "ui.field.industry.option.creative.label": [`Creative`, `Креатив`],
      "ui.field.industry.option.creative.prompt": [
        `Creative studio or design: expressive but professional.`,
        `Креатив или дизайн: выразительно, но профессионально.`,
      ],
      "ui.field.industry.option.eco.label": [`Eco`, `Эко`],
      "ui.field.industry.option.eco.prompt": [
        `Eco or sustainability: natural forms, leaves, circles.`,
        `Эко: природные формы, листья, круги.`,
      ],
      "ui.field.industry.option.education.label": [`Education`, `Образование`],
      "ui.field.industry.option.education.prompt": [
        `Education or kids: friendly, clear, approachable.`,
        `Образование или дети: дружелюбно, ясно, доступно.`,
      ],
      "ui.field.industry.option.finance.label": [`Finance`, `Финансы`],
      "ui.field.industry.option.finance.prompt": [
        `Finance or legal: trust, stability, conservative flair.`,
        `Финансы или юриспруденция: доверие, стабильность, сдержанный шик.`,
      ],
      "ui.field.industry.option.food.label": [`Food & drink`, `Еда`],
      "ui.field.industry.option.food.prompt": [
        `Cafe, restaurant, or food brand: appetizing, organic shapes.`,
        `Кафе, ресторан, еда: аппетитно, органические формы.`,
      ],
      "ui.field.industry.option.health.label": [`Health`, `Здоровье`],
      "ui.field.industry.option.health.prompt": [
        `Health or wellness: clean, caring, professional.`,
        `Здоровье: чисто, заботливо, профессионально.`,
      ],
      "ui.field.industry.option.retail.label": [`Retail`, `Ритейл`],
      "ui.field.industry.option.retail.prompt": [
        `Retail or e-commerce: memorable mark, shopping clarity.`,
        `Ритейл или e-commerce: запоминающийся знак, ясность покупки.`,
      ],
      "ui.field.industry.option.sport.label": [`Sport`, `Спорт`],
      "ui.field.industry.option.sport.prompt": [
        `Sports or fitness: dynamic angles, energy.`,
        `Спорт: динамика, энергия.`,
      ],
      "ui.field.industry.option.tech.label": [`Tech`, `IT`],
      "ui.field.industry.option.tech.prompt": [
        `Tech / SaaS: precise geometry, future-friendly.`,
        `IT / SaaS: точная геометрия, «футуристично» в меру.`,
      ],
      "ui.field.layout.label": [`Lockup`, `Связка`],
      "ui.field.layout.option.compact.label": [`Centered compact`, `Компакт`],
      "ui.field.layout.option.compact.prompt": [
        `Compact square-friendly mark for app icon use.`,
        `Компактный квадратный знак под иконку приложения.`,
      ],
      "ui.field.layout.option.horizontal.label": [`Horizontal`, `Горизонтально`],
      "ui.field.layout.option.horizontal.prompt": [
        `Horizontal lockup: icon left, text right (or reverse).`,
        `Горизонтальная связка: иконка слева, текст справа (или наоборот).`,
      ],
      "ui.field.layout.option.stacked.label": [`Stacked`, `Столбиком`],
      "ui.field.layout.option.stacked.prompt": [
        `Stacked: icon above text, centered.`,
        `Столбиком: иконка над текстом, по центру.`,
      ],
      "ui.field.layout.option.wide.label": [`Word only wide`, `Широкий текст`],
      "ui.field.layout.option.wide.prompt": [`Wide horizontal wordmark banner.`, `Широкий горизонтальный вордмарк.`],
      "ui.field.mark_type.label": [`Mark type`, `Тип знака`],
      "ui.field.mark_type.option.abstract.label": [`Abstract`, `Абстракция`],
      "ui.field.mark_type.option.abstract.prompt": [
        `Abstract geometric mark; may include initials only.`,
        `Абстрактный геометрический знак; можно только инициалы.`,
      ],
      "ui.field.mark_type.option.badge.label": [`Badge`, `Шильд`],
      "ui.field.mark_type.option.badge.prompt": [
        `Circular or shield badge enclosing symbol and/or text.`,
        `Круглый или щитовой шильд с символом и/или текстом.`,
      ],
      "ui.field.mark_type.option.combo.label": [`Symbol + text`, `Знак + текст`],
      "ui.field.mark_type.option.combo.prompt": [
        `Icon beside or above the brand name; balanced lockup.`,
        `Иконка рядом или над названием; сбалансированная связка.`,
      ],
      "ui.field.mark_type.option.mascot.label": [`Mascot`, `Маскот`],
      "ui.field.mark_type.option.mascot.prompt": [
        `Simple mascot or character mark with optional name.`,
        `Простой маскот или персонаж, при необходимости с именем.`,
      ],
      "ui.field.mark_type.option.wordmark.label": [`Wordmark`, `Вордмарк`],
      "ui.field.mark_type.option.wordmark.prompt": [
        `Typography-led logo; custom letter shapes allowed.`,
        `Типографический логотип; допустимы кастомные буквы.`,
      ],
      "ui.field.palette.label": [`Palette`, `Палитра`],
      "ui.field.palette.option.bw.label": [`Black & white`, `Ч/Б`],
      "ui.field.palette.option.bw.prompt": [
        `Strict black on white or inverse; no extra hues.`,
        `Строго ч/б или инверсия; без лишних оттенков.`,
      ],
      "ui.field.palette.option.cool_duo.label": [`Cool duo`, `Холодная пара`],
      "ui.field.palette.option.cool_duo.prompt": [
        `Two-color cool pair: teal + navy, or blue + mint.`,
        `Холодная пара: бирюза + тёмно-синий или синий + мята.`,
      ],
      "ui.field.palette.option.gold_foil.label": [`Gold foil`, `Золото`],
      "ui.field.palette.option.gold_foil.prompt": [
        `Dark base with metallic gold or champagne accent.`,
        `Тёмная база с золотой или шампанской металликой.`,
      ],
      "ui.field.palette.option.green.label": [`Green nature`, `Зелёная`],
      "ui.field.palette.option.green.prompt": [
        `Forest, sage, and cream—natural brand.`,
        `Лес, шалфей, крем — натуральный бренд.`,
      ],
      "ui.field.palette.option.mono_blue.label": [`Blue mono`, `Синяя`],
      "ui.field.palette.option.mono_blue.prompt": [
        `Blue single-hue family with white/light gray.`,
        `Синяя монохромная гамма с белым/светло-серым.`,
      ],
      "ui.field.palette.option.multi.label": [`Multi (3–4)`, `3–4 цвета`],
      "ui.field.palette.option.multi.prompt": [
        `Three to four harmonious brand colors; specify hierarchy (primary vs accent).`,
        `Три–четыре согласованных цвета бренда; иерархия основной и акцент.`,
      ],
      "ui.field.palette.option.purple.label": [`Purple tech`, `Фиолет tech`],
      "ui.field.palette.option.purple.prompt": [
        `Purple and violet gradients with white—tech startup vibe.`,
        `Фиолетовые градиенты с белым — стартап-tech.`,
      ],
      "ui.field.palette.option.warm_duo.label": [`Warm duo`, `Тёплая пара`],
      "ui.field.palette.option.warm_duo.prompt": [
        `Two-color warm pair: e.g. deep orange + cream, or burgundy + gold.`,
        `Тёплая пара: глубокий оранж + крем или бордо + золото.`,
      ],
      "ui.field.style.label": [`Style`, `Стиль`],
      "ui.field.style.option.bold.label": [`Bold`, `Жирный`],
      "ui.field.style.option.bold.prompt": [
        `Bold weight; high contrast shapes.`,
        `Жирный вес; высококонтрастные формы.`,
      ],
      "ui.field.style.option.geometric.label": [`Geometric`, `Геометрия`],
      "ui.field.style.option.geometric.prompt": [
        `Strict geometric construction; grid-based.`,
        `Строгая геометрия на сетке.`,
      ],
      "ui.field.style.option.minimal.label": [`Minimal`, `Минимализм`],
      "ui.field.style.option.minimal.prompt": [
        `Minimal geometry; generous whitespace.`,
        `Минимальная геометрия; много воздуха.`,
      ],
      "ui.field.style.option.neon.label": [`Tech neon`, `Tech`],
      "ui.field.style.option.neon.prompt": [
        `Sleek tech: thin lines, subtle glow on dark (if palette allows).`,
        `Тонкие линии tech, лёгкое свечение на тёмном (если палитра позволяет).`,
      ],
      "ui.field.style.option.organic.label": [`Organic`, `Органика`],
      "ui.field.style.option.organic.prompt": [
        `Soft curves and natural flow; hand-refined feel.`,
        `Мягкие кривые и естественный ритм; «отшлифовано вручную».`,
      ],
      "ui.field.style.option.vintage.label": [`Vintage`, `Винтаж`],
      "ui.field.style.option.vintage.prompt": [
        `Vintage badge, serif touches, subtle texture.`,
        `Винтажный шильд, штрихи антиквы, лёгкая фактура.`,
      ],
      "ui.field.tagline.label": [`Optional tagline`, `Слоган`],
      "ui.field.tagline.placeholder": [
        `Short subtitle under logo — or leave empty`,
        `Короткая строка под логотипом — или пусто`,
      ],
      "ui.field.tagline.prompt": [
        `Optional tagline text under the logo (one short line, or empty):`,
        `Необязательный слоган под знаком (одна короткая строка или пусто):`,
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
            kind: `text_input`,
            label: { emoji: `✨`, text: i18n(`ui.field.brand.label`) },
            placeholder: i18n(`ui.field.brand.placeholder`),
            prompt: i18n(`ui.field.brand.prompt`),
          },
          {
            default: `tech`,
            id: `industry`,
            kind: `single_choice`,
            label: { emoji: `🏢`, text: i18n(`ui.field.industry.label`) },
            options: [
              {
                label: { emoji: `💻`, text: i18n(`ui.field.industry.option.tech.label`) },
                prompt: i18n(`ui.field.industry.option.tech.prompt`),
                value: `tech`,
              },
              {
                label: { emoji: `☕`, text: i18n(`ui.field.industry.option.food.label`) },
                prompt: i18n(`ui.field.industry.option.food.prompt`),
                value: `food`,
              },
              {
                label: { emoji: `💪`, text: i18n(`ui.field.industry.option.sport.label`) },
                prompt: i18n(`ui.field.industry.option.sport.prompt`),
                value: `sport`,
              },
              {
                label: { emoji: `💰`, text: i18n(`ui.field.industry.option.finance.label`) },
                prompt: i18n(`ui.field.industry.option.finance.prompt`),
                value: `finance`,
              },
              {
                label: { emoji: `🏥`, text: i18n(`ui.field.industry.option.health.label`) },
                prompt: i18n(`ui.field.industry.option.health.prompt`),
                value: `health`,
              },
              {
                label: { emoji: `🎨`, text: i18n(`ui.field.industry.option.creative.label`) },
                prompt: i18n(`ui.field.industry.option.creative.prompt`),
                value: `creative`,
              },
              {
                label: { emoji: `🌿`, text: i18n(`ui.field.industry.option.eco.label`) },
                prompt: i18n(`ui.field.industry.option.eco.prompt`),
                value: `eco`,
              },
              {
                label: { emoji: `🎓`, text: i18n(`ui.field.industry.option.education.label`) },
                prompt: i18n(`ui.field.industry.option.education.prompt`),
                value: `education`,
              },
              {
                label: { emoji: `🛒`, text: i18n(`ui.field.industry.option.retail.label`) },
                prompt: i18n(`ui.field.industry.option.retail.prompt`),
                value: `retail`,
              },
            ],
          },
          {
            default: `wordmark`,
            id: `mark_type`,
            kind: `single_choice`,
            label: { emoji: `🔰`, text: i18n(`ui.field.mark_type.label`) },
            options: [
              {
                label: { emoji: `🔤`, text: i18n(`ui.field.mark_type.option.wordmark.label`) },
                prompt: i18n(`ui.field.mark_type.option.wordmark.prompt`),
                value: `wordmark`,
              },
              {
                label: { emoji: `🎯`, text: i18n(`ui.field.mark_type.option.combo.label`) },
                prompt: i18n(`ui.field.mark_type.option.combo.prompt`),
                value: `combo`,
              },
              {
                label: { emoji: `◯`, text: i18n(`ui.field.mark_type.option.badge.label`) },
                prompt: i18n(`ui.field.mark_type.option.badge.prompt`),
                value: `badge`,
              },
              {
                label: { emoji: `🐾`, text: i18n(`ui.field.mark_type.option.mascot.label`) },
                prompt: i18n(`ui.field.mark_type.option.mascot.prompt`),
                value: `mascot`,
              },
              {
                label: { emoji: `⬡`, text: i18n(`ui.field.mark_type.option.abstract.label`) },
                prompt: i18n(`ui.field.mark_type.option.abstract.prompt`),
                value: `abstract`,
              },
            ],
          },
          {
            default: `mono_blue`,
            id: `palette`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.palette.label`) },
            options: [
              {
                label: { emoji: `🔵`, text: i18n(`ui.field.palette.option.mono_blue.label`) },
                prompt: i18n(`ui.field.palette.option.mono_blue.prompt`),
                value: `mono_blue`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.palette.option.bw.label`) },
                prompt: i18n(`ui.field.palette.option.bw.prompt`),
                value: `bw`,
              },
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.palette.option.warm_duo.label`) },
                prompt: i18n(`ui.field.palette.option.warm_duo.prompt`),
                value: `warm_duo`,
              },
              {
                label: { emoji: `🌊`, text: i18n(`ui.field.palette.option.cool_duo.label`) },
                prompt: i18n(`ui.field.palette.option.cool_duo.prompt`),
                value: `cool_duo`,
              },
              {
                label: { emoji: `🌈`, text: i18n(`ui.field.palette.option.multi.label`) },
                prompt: i18n(`ui.field.palette.option.multi.prompt`),
                value: `multi`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.palette.option.gold_foil.label`) },
                prompt: i18n(`ui.field.palette.option.gold_foil.prompt`),
                value: `gold_foil`,
              },
              {
                label: { emoji: `💜`, text: i18n(`ui.field.palette.option.purple.label`) },
                prompt: i18n(`ui.field.palette.option.purple.prompt`),
                value: `purple`,
              },
              {
                label: { emoji: `🌿`, text: i18n(`ui.field.palette.option.green.label`) },
                prompt: i18n(`ui.field.palette.option.green.prompt`),
                value: `green`,
              },
            ],
          },
          {
            default: `minimal`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🖌️`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.style.option.minimal.label`) },
                prompt: i18n(`ui.field.style.option.minimal.prompt`),
                value: `minimal`,
              },
              {
                label: { emoji: `💪`, text: i18n(`ui.field.style.option.bold.label`) },
                prompt: i18n(`ui.field.style.option.bold.prompt`),
                value: `bold`,
              },
              {
                label: { emoji: `📜`, text: i18n(`ui.field.style.option.vintage.label`) },
                prompt: i18n(`ui.field.style.option.vintage.prompt`),
                value: `vintage`,
              },
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.style.option.geometric.label`) },
                prompt: i18n(`ui.field.style.option.geometric.prompt`),
                value: `geometric`,
              },
              {
                label: { emoji: `〰️`, text: i18n(`ui.field.style.option.organic.label`) },
                prompt: i18n(`ui.field.style.option.organic.prompt`),
                value: `organic`,
              },
              {
                label: { emoji: `⚡`, text: i18n(`ui.field.style.option.neon.label`) },
                prompt: i18n(`ui.field.style.option.neon.prompt`),
                value: `neon`,
              },
            ],
          },
          {
            default: `horizontal`,
            id: `layout`,
            kind: `single_choice`,
            label: { emoji: `📐`, text: i18n(`ui.field.layout.label`) },
            options: [
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.layout.option.horizontal.label`) },
                prompt: i18n(`ui.field.layout.option.horizontal.prompt`),
                value: `horizontal`,
              },
              {
                label: { emoji: `↕️`, text: i18n(`ui.field.layout.option.stacked.label`) },
                prompt: i18n(`ui.field.layout.option.stacked.prompt`),
                value: `stacked`,
              },
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.layout.option.compact.label`) },
                prompt: i18n(`ui.field.layout.option.compact.prompt`),
                value: `compact`,
              },
              {
                label: { emoji: `➡️`, text: i18n(`ui.field.layout.option.wide.label`) },
                prompt: i18n(`ui.field.layout.option.wide.prompt`),
                value: `wide`,
              },
            ],
          },
          {
            default: `white`,
            id: `background`,
            kind: `single_choice`,
            label: { emoji: `🖼️`, text: i18n(`ui.field.background.label`) },
            options: [
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.background.option.white.label`) },
                prompt: i18n(`ui.field.background.option.white.prompt`),
                value: `white`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.background.option.dark.label`) },
                prompt: i18n(`ui.field.background.option.dark.prompt`),
                value: `dark`,
              },
              {
                label: { emoji: `🌫️`, text: i18n(`ui.field.background.option.gray.label`) },
                prompt: i18n(`ui.field.background.option.gray.prompt`),
                value: `gray`,
              },
            ],
          },
          {
            id: `tagline`,
            kind: `text_input`,
            label: { emoji: `📝`, text: i18n(`ui.field.tagline.label`) },
            placeholder: i18n(`ui.field.tagline.placeholder`),
            prompt: i18n(`ui.field.tagline.prompt`),
          },
        ],
        title: i18n(`meta.title`),
      },
      prompt: i18n(`meta.prompt`),
    }) as const,
);
/* jscpd:ignore-end */
