// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = () =>
  ({
    en: {
      description: `Logo mark — structured options, then generate`,
      emoji: `🏷️`,
      prompt: `You build image-generation prompts. From the **brand** line (required text), every tab below, and optional tagline line, write **one** detailed prompt **for image generation**: a **single logo artwork** on a simple background (it will be sent to the image model). Reflect industry, mark type, complexity, **palette by tab name**, style, and layout. Demand legibility at small sizes. End: no watermark; no laptop/phone mockups—logo only. Reply with that string only—no other text.`,
      title: `Logo`,
      uiPlan: {
        fields: [
          {
            id: `brand`,
            kind: `text`,
            label: `✨ Brand / letters`,
            placeholder: `Name or letters to show…`,
            prompt: `Brand name or letters in the logo (required):`,
          },
          {
            default: `tech`,
            id: `industry`,
            kind: `tabs_single`,
            label: `🏢 Industry`,
            options: [
              { label: `💻 Tech`, prompt: `Tech / SaaS: precise geometry, future-friendly.`, value: `tech` },
              {
                label: `☕ Food & drink`,
                prompt: `Cafe, restaurant, or food brand: appetizing, organic shapes.`,
                value: `food`,
              },
              { label: `💪 Sport`, prompt: `Sports or fitness: dynamic angles, energy.`, value: `sport` },
              {
                label: `💰 Finance`,
                prompt: `Finance or legal: trust, stability, conservative flair.`,
                value: `finance`,
              },
              { label: `🏥 Health`, prompt: `Health or wellness: clean, caring, professional.`, value: `health` },
              {
                label: `🎨 Creative`,
                prompt: `Creative studio or design: expressive but professional.`,
                value: `creative`,
              },
              { label: `🌿 Eco`, prompt: `Eco or sustainability: natural forms, leaves, circles.`, value: `eco` },
              {
                label: `🎓 Education`,
                prompt: `Education or kids: friendly, clear, approachable.`,
                value: `education`,
              },
              {
                label: `🛒 Retail`,
                prompt: `Retail or e-commerce: memorable mark, shopping clarity.`,
                value: `retail`,
              },
            ],
          },
          {
            default: `wordmark`,
            id: `mark_type`,
            kind: `tabs_single`,
            label: `🔰 Mark type`,
            options: [
              { label: `🔤 Wordmark`, prompt: `Typography-led logo; custom letter shapes allowed.`, value: `wordmark` },
              {
                label: `🎯 Symbol + text`,
                prompt: `Icon beside or above the brand name; balanced lockup.`,
                value: `combo`,
              },
              { label: `◯ Badge`, prompt: `Circular or shield badge enclosing symbol and/or text.`, value: `badge` },
              { label: `🐾 Mascot`, prompt: `Simple mascot or character mark with optional name.`, value: `mascot` },
              { label: `⬡ Abstract`, prompt: `Abstract geometric mark; may include initials only.`, value: `abstract` },
            ],
          },
          {
            default: `mono_blue`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Palette`,
            options: [
              { label: `🔵 Blue mono`, prompt: `Blue single-hue family with white/light gray.`, value: `mono_blue` },
              { label: `⬛ Black & white`, prompt: `Strict black on white or inverse; no extra hues.`, value: `bw` },
              {
                label: `🌅 Warm duo`,
                prompt: `Two-color warm pair: e.g. deep orange + cream, or burgundy + gold.`,
                value: `warm_duo`,
              },
              { label: `🌊 Cool duo`, prompt: `Two-color cool pair: teal + navy, or blue + mint.`, value: `cool_duo` },
              {
                label: `🌈 Multi (3–4)`,
                prompt: `Three to four harmonious brand colors; specify hierarchy (primary vs accent).`,
                value: `multi`,
              },
              {
                label: `✨ Gold foil`,
                prompt: `Dark base with metallic gold or champagne accent.`,
                value: `gold_foil`,
              },
              {
                label: `💜 Purple tech`,
                prompt: `Purple and violet gradients with white—tech startup vibe.`,
                value: `purple`,
              },
              { label: `🌿 Green nature`, prompt: `Forest, sage, and cream—natural brand.`, value: `green` },
            ],
          },
          {
            default: `minimal`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Style`,
            options: [
              { label: `◻️ Minimal`, prompt: `Minimal geometry; generous whitespace.`, value: `minimal` },
              { label: `💪 Bold`, prompt: `Bold weight; high contrast shapes.`, value: `bold` },
              { label: `📜 Vintage`, prompt: `Vintage badge, serif touches, subtle texture.`, value: `vintage` },
              { label: `◻️ Geometric`, prompt: `Strict geometric construction; grid-based.`, value: `geometric` },
              { label: `〰️ Organic`, prompt: `Soft curves and natural flow; hand-refined feel.`, value: `organic` },
              {
                label: `⚡ Tech neon`,
                prompt: `Sleek tech: thin lines, subtle glow on dark (if palette allows).`,
                value: `neon`,
              },
            ],
          },
          {
            default: `horizontal`,
            id: `layout`,
            kind: `tabs_single`,
            label: `📐 Lockup`,
            options: [
              {
                label: `↔️ Horizontal`,
                prompt: `Horizontal lockup: icon left, text right (or reverse).`,
                value: `horizontal`,
              },
              { label: `↕️ Stacked`, prompt: `Stacked: icon above text, centered.`, value: `stacked` },
              {
                label: `⬜ Centered compact`,
                prompt: `Compact square-friendly mark for app icon use.`,
                value: `compact`,
              },
              { label: `➡️ Word only wide`, prompt: `Wide horizontal wordmark banner.`, value: `wide` },
            ],
          },
          {
            default: `white`,
            id: `background`,
            kind: `tabs_single`,
            label: `🖼️ Preview bg`,
            options: [
              { label: `⬜ White`, prompt: `Show logo on pure white background.`, value: `white` },
              { label: `⬛ Dark`, prompt: `Show logo on dark (#111–#222) to prove contrast.`, value: `dark` },
              { label: `🌫️ Light gray`, prompt: `Show on light gray to test edge clarity.`, value: `gray` },
            ],
          },
          {
            id: `tagline`,
            kind: `text`,
            label: `📝 Optional tagline`,
            placeholder: `Short subtitle under logo — or leave empty`,
            prompt: `Optional tagline text under the logo (one short line, or empty):`,
          },
        ],
      },
    },
    group: `visual`,
    ru: {
      description: `Логотип — структурированные опции`,
      emoji: `🎨`,
      prompt: `Собери **один** подробный промпт **для генерации изображения**: один **логотип** на простом фоне (промпт получит модель картинки). Возьми **название** (обязательное поле), тип знака, отрасль, **палитру из вкладок**, стиль, макет, фон превью. Опциональный слоган — вписать в композицию если есть. Читаемость в мелком размере. Без водяных знаков; без мокапов. Верни только эту строку — без другого текста.`,
      title: `Логотип`,
      uiPlan: {
        fields: [
          {
            id: `brand`,
            kind: `text`,
            label: `✨ Бренд / буквы`,
            placeholder: `Название или буквы…`,
            prompt: `Название или буквы в логотипе (обязательно):`,
          },
          {
            default: `tech`,
            id: `industry`,
            kind: `tabs_single`,
            label: `🏢 Сфера`,
            options: [
              { label: `💻 IT`, prompt: `IT / SaaS: геометрия, точность.`, value: `tech` },
              { label: `☕ Еда`, prompt: `Кафе, еда: аппетитные формы.`, value: `food` },
              { label: `💪 Спорт`, prompt: `Спорт: динамика, энергия.`, value: `sport` },
              { label: `💰 Финансы`, prompt: `Финансы или юристы: надёжность.`, value: `finance` },
              { label: `🏥 Здоровье`, prompt: `Медицина / wellness: чистота и забота.`, value: `health` },
              { label: `🎨 Креатив`, prompt: `Студия, креатив: выразительно, но профессионально.`, value: `creative` },
              { label: `🌿 Эко`, prompt: `Эко: природа, круги, листья.`, value: `eco` },
              { label: `🎓 Образование`, prompt: `Образование: дружелюбно и ясно.`, value: `education` },
              { label: `🛒 Ритейл`, prompt: `Ритейл: запоминающийся знак.`, value: `retail` },
            ],
          },
          {
            default: `wordmark`,
            id: `mark_type`,
            kind: `tabs_single`,
            label: `🔰 Тип знака`,
            options: [
              { label: `🔤 Вордмарк`, prompt: `Типографика в центре; кастомные буквы.`, value: `wordmark` },
              { label: `🎯 Знак + текст`, prompt: `Иконка и название в связке.`, value: `combo` },
              { label: `◯ Шильд`, prompt: `Круглый или щитовой бейдж.`, value: `badge` },
              { label: `🐾 Маскот`, prompt: `Персонаж-маскот с опциональным именем.`, value: `mascot` },
              { label: `⬡ Абстракция`, prompt: `Абстрактная геометрия; возможны инициалы.`, value: `abstract` },
            ],
          },
          {
            default: `mono_blue`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Палитра`,
            options: [
              { label: `🔵 Синяя`, prompt: `Синие оттенки + белый/светло-серый.`, value: `mono_blue` },
              { label: `⬛ Ч/Б`, prompt: `Строго чёрный на белом или инверсия.`, value: `bw` },
              { label: `🌅 Тёплая пара`, prompt: `Два тёплых цвета: бордо+золото и т.п.`, value: `warm_duo` },
              { label: `🌊 Холодная пара`, prompt: `Два холодных: бирюза+синий и т.п.`, value: `cool_duo` },
              {
                label: `🌈 3–4 цвета`,
                prompt: `Три–четыре согласованных цвета; указать главный и акцент.`,
                value: `multi`,
              },
              { label: `✨ Золото`, prompt: `Тёмный фон + металлическое золото.`, value: `gold_foil` },
              { label: `💜 Фиолет tech`, prompt: `Фиолетовые градиенты, стартап.`, value: `purple` },
              { label: `🌿 Зелёная`, prompt: `Лесной, шалфей, крем — эко.`, value: `green` },
            ],
          },
          {
            default: `minimal`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Стиль`,
            options: [
              { label: `◻️ Минимализм`, prompt: `Минимализм и воздух.`, value: `minimal` },
              { label: `💪 Жирный`, prompt: `Жирные формы, контраст.`, value: `bold` },
              { label: `📜 Винтаж`, prompt: `Винтаж, шериф, лёгкая фактура.`, value: `vintage` },
              { label: `◻️ Геометрия`, prompt: `Строгая сетка и геометрия.`, value: `geometric` },
              { label: `〰️ Органика`, prompt: `Мягкие линии, «живой» контур.`, value: `organic` },
              { label: `⚡ Tech`, prompt: `Тонкие линии, лёгкое свечение на тёмном при необходимости.`, value: `neon` },
            ],
          },
          {
            default: `horizontal`,
            id: `layout`,
            kind: `tabs_single`,
            label: `📐 Связка`,
            options: [
              { label: `↔️ Горизонтально`, prompt: `Иконка слева или справа от текста.`, value: `horizontal` },
              { label: `↕️ Столбиком`, prompt: `Иконка над текстом по центру.`, value: `stacked` },
              { label: `⬜ Компакт`, prompt: `Компактно для иконки приложения.`, value: `compact` },
              { label: `➡️ Широкий текст`, prompt: `Горизонтальный широкий вордмарк.`, value: `wide` },
            ],
          },
          {
            default: `white`,
            id: `background`,
            kind: `tabs_single`,
            label: `🖼️ Фон превью`,
            options: [
              { label: `⬜ Белый`, prompt: `Показать на белом.`, value: `white` },
              { label: `⬛ Тёмный`, prompt: `Показать на тёмном для проверки контраста.`, value: `dark` },
              { label: `🌫️ Светло-серый`, prompt: `Показать на светло-сером.`, value: `gray` },
            ],
          },
          {
            id: `tagline`,
            kind: `text`,
            label: `📝 Слоган`,
            placeholder: `Короткая строка под логотипом — или пусто`,
            prompt: `Опциональный слоган под знаком (одна короткая строка или пусто):`,
          },
        ],
      },
    },
  }) as const;
/* jscpd:ignore-end */
