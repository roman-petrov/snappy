// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = ({ maxImagePromptLength }) =>
  ({
    en: {
      emoji: `🎯`,
      labels: { description: `One icon — metaphor, style, palette, 2D/3D`, title: `Icon` },
      prompt: `You are an art-director for a single app icon asset. Read the **Metaphor & description** line as the creative brief. **Before** you compose the final output, analyze the metaphor in depth (keep this reasoning internal—do not output it): identify the abstract idea and what it must communicate; list concrete subject(s), props, and symbols; enumerate metaphor **attributes** and **properties** (e.g. stability vs motion, openness vs enclosure, warmth vs cold, precision vs softness, direction, scale, balance) and note how each should read **visually**; resolve ambiguities by choosing one coherent reading. Map every important attribute to drawable decisions: silhouette logic, focal hierarchy, secondary shapes, implied motion or gaze, use of negative space, and what reads at a glance. Merge that resolved brief with every bullet below (dimension, style, palette, edge intent, corners, padding, tile, detail). Then write **one** exceptionally detailed prompt **for image generation** (it will be sent to the image model). That prompt must **thoroughly describe the metaphor for the image model**: translate the abstract idea into explicit pictorial instructions—what appears, how elements relate, what each part signifies—so a text-to-image model can render the idea without guessing; do not rely on a bare label alone. Also spell out silhouette or stroke logic, color roles and approximate hues, lighting and shadows for the chosen dimension, material feel (matte, glass, plastic, paper), composition (exactly **one** icon centered in the square frame, generous safe margin, readable at small sizes), background treatment, and edge character (razor-clean for vector workflows versus soft painted pixels). Describe the shot as **one** finished square icon filling the frame—hero asset only. That prompt **must explicitly instruct** the image model: **no** text, letters, numbers, captions, watermarks, logos-as-type, or any typography in the image—**pictorial icon artwork only**. It **must also explicitly instruct** scaling the subject to **use as much of the available square area as the chosen padding and composition allow**, **without stretching**: maximize footprint while **preserving the subject’s aspect ratio**. **Hard limit: the final string must be at most ${maxImagePromptLength} characters (counting spaces); compress wording and drop optional flourishes if needed to stay within this cap.** Reply with that full string only—no other text.`,
      uiPlan: {
        fields: [
          {
            id: `concept`,
            kind: `text`,
            label: `💡 Metaphor & description`,
            placeholder: `Metaphor (e.g. “calm focus”) + what to draw (e.g. “a lighthouse beam”) + mood…`,
            prompt: `Metaphor and description for the icon (required): state what the icon stands for, what should appear on canvas, and any mood or context.`,
          },
          {
            default: `flat_2d`,
            id: `dimension`,
            kind: `tabs_single`,
            label: `📐 Dimension`,
            options: [
              {
                label: `⬜ Flat 2D`,
                prompt: `Render as flat 2D graphic: shapes sit on one plane, even fills or strokes, minimal depth cues.`,
                value: `flat_2d`,
              },
              {
                label: `📚 Layered 2D`,
                prompt: `Render as layered 2D: clear overlap, subtle drop shadows or separation between planes, still read as illustration not sculpture.`,
                value: `layered_2d`,
              },
              {
                label: `🧊 Soft 3D`,
                prompt: `Render as soft 3D: gentle bevels, rounded volumes, soft studio lighting, toy-like or app-icon chip depth.`,
                value: `soft_3d`,
              },
              {
                label: `📦 Isometric`,
                prompt: `Render in isometric 3D: consistent 30°-style projection, readable geometry, crisp faces.`,
                value: `iso_3d`,
              },
              {
                label: `✨ Glossy 3D`,
                prompt: `Render as glossy 3D: specular highlights, smooth plastic or glass-like material, controlled reflections.`,
                value: `glossy_3d`,
              },
            ],
          },
          {
            default: `minimal_flat`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Style`,
            options: [
              {
                label: `◻️ Minimal flat`,
                prompt: `Minimal flat UI language: simple geometry, few elements, generous whitespace inside the glyph.`,
                value: `minimal_flat`,
              },
              {
                label: `➿ Outline`,
                prompt: `Outline icon: uniform stroke weight, rounded or mitered joins as fits the corner setting; interior detail spare.`,
                value: `outline_stroke`,
              },
              {
                label: `⬛ Silhouette`,
                prompt: `Solid silhouette: one dominant filled shape, high contrast, legible at 24px.`,
                value: `silhouette_fill`,
              },
              {
                label: `🎭 Duotone`,
                prompt: `Duotone treatment: exactly two flat fills working as primary and accent inside one glyph.`,
                value: `duotone`,
              },
              {
                label: `🪟 Glass`,
                prompt: `Glassmorphism: translucent panels, light refraction, soft blur behind glass layers.`,
                value: `glass`,
              },
              {
                label: `🌫️ Neumorphic`,
                prompt: `Soft neumorphic relief: subtle dual shadows, element appears extruded from same-tone surface.`,
                value: `neumorph`,
              },
              {
                label: `🌅 Gradient`,
                prompt: `Smooth gradients within shapes: modern app-icon polish, controlled color stops.`,
                value: `gradient_soft`,
              },
              {
                label: `👾 Pixel`,
                prompt: `Pixel-art aesthetic: visible pixel grid, limited palette inside the style, crisp block forms.`,
                value: `pixel`,
              },
              {
                label: `✒️ Ink sketch`,
                prompt: `Hand-inked sketch look: confident linework, optional light wash, still reads as one icon.`,
                value: `ink_sketch`,
              },
            ],
          },
          {
            default: `blue_white`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Palette`,
            options: [
              {
                label: `🔵 Blue on white`,
                prompt: `Primary blue icon (around #2563eb family) on white or near-white field.`,
                value: `blue_white`,
              },
              {
                label: `⬛ Gray mono`,
                prompt: `Monochrome slate: charcoal or dark gray glyph on light gray tile (#f3f4f6-class).`,
                value: `gray_mono`,
              },
              {
                label: `⬜ White on dark`,
                prompt: `White or light glyph on dark ground (#111827–#1f2937-class), strong contrast.`,
                value: `white_dark`,
              },
              {
                label: `🌈 Brand duo`,
                prompt: `Two harmonious hues: name primary and accent roles in the prompt (main shape vs detail).`,
                value: `duo_brand`,
              },
              {
                label: `🍏 Green eco`,
                prompt: `Fresh green (#16a34a-class) with off-white; natural, calm energy.`,
                value: `green_eco`,
              },
              {
                label: `🌅 Orange warm`,
                prompt: `Warm orange or amber accent on neutral light ground.`,
                value: `orange_warm`,
              },
              {
                label: `💜 Purple UI`,
                prompt: `Violet or purple on white; contemporary product UI feel.`,
                value: `purple_ui`,
              },
              {
                label: `🩵 Teal cyan`,
                prompt: `Teal or cyan-forward palette with white or pale gray.`,
                value: `teal_cyan`,
              },
              {
                label: `🌸 Rose pink`,
                prompt: `Rose or soft pink accent with neutral balance; gentle modern.`,
                value: `rose_pink`,
              },
              {
                label: `✨ Amber gold`,
                prompt: `Amber or gold highlights on deep or warm neutral base.`,
                value: `amber_gold`,
              },
              {
                label: `🖤 Black solid`,
                prompt: `Near-black silhouette on white or transparent-look field; maximum graphic punch.`,
                value: `black_solid`,
              },
              {
                label: `🌫️ Slate muted`,
                prompt: `Muted slate and blue-gray tones; understated professional.`,
                value: `slate_muted`,
              },
            ],
          },
          {
            default: `balanced`,
            id: `edge`,
            kind: `tabs_single`,
            label: `🔷 Edge intent`,
            options: [
              {
                label: `📐 Vector-ready`,
                prompt: `Crisp closed shapes and clean edges: high-contrast boundaries suitable for later vector tracing; flat color regions, avoid noisy texture at edges.`,
                value: `crisp_vector`,
              },
              {
                label: `🖌️ Soft raster`,
                prompt: `Soft painted or airbrushed edges: subtle gradients and texture welcome; painterly finish.`,
                value: `soft_raster`,
              },
              {
                label: `⚖️ Balanced`,
                prompt: `Balanced edge treatment: clean readable silhouette with light anti-aliased softness.`,
                value: `balanced`,
              },
            ],
          },
          {
            default: `rounded`,
            id: `corners`,
            kind: `tabs_single`,
            label: `📐 Corners`,
            options: [
              {
                label: `⬜ Rounded`,
                prompt: `Round corners on outer tile and on internal shapes where applicable; friendly UI feel.`,
                value: `rounded`,
              },
              {
                label: `◻️ Sharp`,
                prompt: `Sharp corners and precise geometry; technical or editorial tone.`,
                value: `sharp`,
              },
              {
                label: `⭕ Circle`,
                prompt: `Compose inside a circular mask; content centered and balanced for round app icon.`,
                value: `circle`,
              },
            ],
          },
          {
            default: `normal`,
            id: `padding`,
            kind: `tabs_single`,
            label: `↔️ Padding`,
            options: [
              {
                label: `🎯 Tight`,
                prompt: `Tight margins: glyph occupies most of the square, small outer breathing room.`,
                value: `tight`,
              },
              {
                label: `↔️ Normal`,
                prompt: `Standard icon padding: roughly 20–25% margin around the glyph.`,
                value: `normal`,
              },
              {
                label: `🌬️ Airy`,
                prompt: `Airy layout: smaller glyph with generous margin; calm negative space.`,
                value: `airy`,
              },
            ],
          },
          {
            default: `square_light`,
            id: `tile`,
            kind: `tabs_single`,
            label: `🖼️ Tile`,
            options: [
              {
                label: `⬜ Light square`,
                prompt: `Light rounded-square tile behind the icon; soft elevation optional.`,
                value: `square_light`,
              },
              {
                label: `⬛ Dark square`,
                prompt: `Dark rounded-square tile; icon reads as light-on-dark.`,
                value: `square_dark`,
              },
              {
                label: `🫥 None`,
                prompt: `No separate tile: icon sits on a flat field or clean gradient only.`,
                value: `none`,
              },
              {
                label: `🌅 Soft gradient`,
                prompt: `Soft gradient field behind the icon; keep gradient subtle so the glyph stays dominant.`,
                value: `gradient_bg`,
              },
            ],
          },
          {
            default: `standard`,
            id: `detail`,
            kind: `tabs_single`,
            label: `🔍 Detail`,
            options: [
              {
                label: `◽ Minimal`,
                prompt: `Minimal detail: one or two visual ideas, maximum clarity at 24–32px.`,
                value: `minimal`,
              },
              {
                label: `◻️ Standard`,
                prompt: `Standard detail level: readable embellishment, balanced for app icon use.`,
                value: `standard`,
              },
              {
                label: `▪️ Rich`,
                prompt: `Richer detail: secondary elements allowed if they stay inside the safe margin and read at medium sizes.`,
                value: `rich`,
              },
            ],
          },
        ],
        title: `🎯 Icon`,
      },
    },
    group: `visual`,
    ru: {
      emoji: `🔷`,
      labels: { description: `Одна иконка — метафора, стиль, палитра, 2D/3D`, title: `Иконка` },
      prompt: `Ты арт-директор по одному ассету иконки приложения. Прочитай строку **«Метафора и описание»** как бриф. **Перед** финальным текстом глубоко разбери метафору (рассуждай внутри себя — в ответ не выводи): абстрактная идея и что она должна передать; конкретные предметы, реквизит и символы; **атрибуты и свойства** метафоры (например устойчивость и движение, открытость и замкнутость, тепло и холод, точность и мягкость, направление, масштаб, баланс) и как каждое свойство должно **выглядеть** на картинке; при неоднозначности выбери одну согласованную трактовку. Сопоставь важные свойства с решениями по рисунку: логика силуэта, фокус внимания, второстепенные формы, подразумеваемое движение или направление взгляда, негативное пространство, что читается с первого взгляда. Соедини это с каждым пунктом ниже (измерение, стиль, палитра, края, углы, поля, плитка, детализация). Затем составь **один** исключительно подробный промпт **для генерации изображения** (его получит модель картинки). В этом промпте **тщательно опиши метафору для модели изображения**: переведи абстрактную идею в явные зрительные инструкции — что именно изображено, как элементы связаны, что означает каждая часть — чтобы модели по тексту не приходилось угадывать; не ограничивайся одним ярлыком. Дополнительно распиши логику силуэта или штриха, роли цветов и оттенков, свет и тени под выбранную размерность, материал (матовое, стекло, пластик, бумага), композицию (ровно **одна** иконка по центру квадратного кадра, поля безопасности, читаемость в малом размере), фон и характер краёв (идеально чистые для векторного контура или мягкая растровая живопись). Опиши кадр как **одну** готовую квадратную иконку на весь кадр — финальный герой-ассет. В этот промпт **обязательно включи явные инструкции для модели изображения**: **не** добавлять в картинку текст, буквы, цифры, подписи, водяные знаки, «логотипы» из типографики — **только графическое изображение иконки**. **Также явно предпиши**: масштабировать субъект так, чтобы он занимал **максимум доступной площади** в квадрате в рамках выбранных полей и композиции, **без растягивания** — **сохранять пропорции** субъекта. **Жёсткое ограничение: итоговая строка — не более ${maxImagePromptLength} символов, пробелы считаются; сожми формулировки и убери второстепенное, чтобы уложиться в лимит.** Верни только эту полную строку — без другого текста.`,
      uiPlan: {
        fields: [
          {
            id: `concept`,
            kind: `text`,
            label: `💡 Метафора и описание`,
            placeholder: `Метафора (например «спокойный фокус») + что нарисовать + настроение…`,
            prompt: `Метафора и описание иконки (обязательно): что символизирует знак, что должно оказаться на изображении, настроение и контекст.`,
          },
          {
            default: `flat_2d`,
            id: `dimension`,
            kind: `tabs_single`,
            label: `📐 Измерение`,
            options: [
              {
                label: `⬜ Плоский 2D`,
                prompt: `Передай как плоский 2D: формы на одной плоскости, ровные заливки или контур, почти без объёма.`,
                value: `flat_2d`,
              },
              {
                label: `📚 Слои 2D`,
                prompt: `Передай как многослойный 2D: наслоение, лёгкие тени между слоями, всё ещё иллюстрация, не скульптура.`,
                value: `layered_2d`,
              },
              {
                label: `🧊 Мягкий 3D`,
                prompt: `Передай как мягкий 3D: скруглённые объёмы, мягкий свет, глубина как у иконки-приложения.`,
                value: `soft_3d`,
              },
              {
                label: `📦 Изометрия`,
                prompt: `Передай в изометрии: ровная проекция, читаемая геометрия граней.`,
                value: `iso_3d`,
              },
              {
                label: `✨ Глянцевый 3D`,
                prompt: `Передай как глянцевый 3D: блики, гладкий пластик или стекло, аккуратные отражения.`,
                value: `glossy_3d`,
              },
            ],
          },
          {
            default: `minimal_flat`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Стиль`,
            options: [
              {
                label: `◻️ Минимализм`,
                prompt: `Минималистичный плоский UI: простая геометрия, мало элементов, воздух внутри знака.`,
                value: `minimal_flat`,
              },
              {
                label: `➿ Контур`,
                prompt: `Контурная иконка: ровная толщина штриха, стыки по настройке углов; деталей внутри мало.`,
                value: `outline_stroke`,
              },
              {
                label: `⬛ Силуэт`,
                prompt: `Сплошной силуэт: одна доминирующая заливка, высокий контраст, читаемость на 24px.`,
                value: `silhouette_fill`,
              },
              {
                label: `🎭 Дуотон`,
                prompt: `Дуотон: ровно две плоские заливки как основной цвет и акцент в одном знаке.`,
                value: `duotone`,
              },
              {
                label: `🪟 Стекло`,
                prompt: `Глянец и стекло: полупрозрачные панели, лёгкое преломление, мягкий фон за стеклом.`,
                value: `glass`,
              },
              {
                label: `🌫️ Неоморфизм`,
                prompt: `Мягкий неоморфный рельеф: двойная тень, объём на том же тоне поверхности.`,
                value: `neumorph`,
              },
              {
                label: `🌅 Градиент`,
                prompt: `Плавные градиенты внутри форм: современная полировка иконки, ровные переходы цвета.`,
                value: `gradient_soft`,
              },
              {
                label: `👾 Пиксель-арт`,
                prompt: `Пиксель-арт: видимая сетка, ограниченная палитра, блочные формы.`,
                value: `pixel`,
              },
              {
                label: `✒️ Тушь`,
                prompt: `Рисунок тушью: уверенный контур, лёгкий лессировочный слой по желанию; всё ещё одна иконка.`,
                value: `ink_sketch`,
              },
            ],
          },
          {
            default: `blue_white`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Палитра`,
            options: [
              {
                label: `🔵 Синий на белом`,
                prompt: `Синий знак (семейство около #2563eb) на белом или почти белом поле.`,
                value: `blue_white`,
              },
              {
                label: `⬛ Серый моно`,
                prompt: `Монохромный сланец: тёмно-серый знак на светло-серой плитке (#f3f4f6-класс).`,
                value: `gray_mono`,
              },
              {
                label: `⬜ Белый на тёмном`,
                prompt: `Светлый знак на тёмном фоне (#111827–#1f2937-класс), сильный контраст.`,
                value: `white_dark`,
              },
              {
                label: `🌈 Два бренд-цвета`,
                prompt: `Два согласованных оттенка: в промпте назови роли основного и акцента.`,
                value: `duo_brand`,
              },
              {
                label: `🍏 Зелёный эко`,
                prompt: `Свежий зелёный (#16a34a-класс) на офф-вайте; спокойная природная энергия.`,
                value: `green_eco`,
              },
              {
                label: `🌅 Тёплый оранж`,
                prompt: `Тёплый оранж или янтарь на нейтральном светлом фоне.`,
                value: `orange_warm`,
              },
              {
                label: `💜 Фиолет UI`,
                prompt: `Фиолет или пурпур на белом; современный продуктовый UI.`,
                value: `purple_ui`,
              },
              { label: `🩵 Бирюза циан`, prompt: `Бирюза или циан с белым или бледно-серым.`, value: `teal_cyan` },
              {
                label: `🌸 Розовый`,
                prompt: `Розовый или мягкий пинк с нейтральным балансом; нежный современный тон.`,
                value: `rose_pink`,
              },
              {
                label: `✨ Янтарь золото`,
                prompt: `Янтарь или золотистый акцент на тёплом или глубоком нейтральном основании.`,
                value: `amber_gold`,
              },
              {
                label: `🖤 Чёрный`,
                prompt: `Почти чёрный силуэт на белом или «прозрачном» поле; максимальная графика.`,
                value: `black_solid`,
              },
              {
                label: `🌫️ Приглушённый сланец`,
                prompt: `Приглушённые сланцево-синие тона; сдержанный профессиональный вид.`,
                value: `slate_muted`,
              },
            ],
          },
          {
            default: `balanced`,
            id: `edge`,
            kind: `tabs_single`,
            label: `🔷 Края`,
            options: [
              {
                label: `📐 Под вектор`,
                prompt: `Чёткие замкнутые контуры и ровные края: контрастные границы, удобные для последующей векторизации; ровные области заливки, текстура не шумит на контуре.`,
                value: `crisp_vector`,
              },
              {
                label: `🖌️ Мягкий растр`,
                prompt: `Мягкие края как в растровой живописи: лёгкие градиенты и текстура уместны; живописная поверхность.`,
                value: `soft_raster`,
              },
              {
                label: `⚖️ Баланс`,
                prompt: `Сбалансированные края: читаемый силуэт с лёгким сглаживанием.`,
                value: `balanced`,
              },
            ],
          },
          {
            default: `rounded`,
            id: `corners`,
            kind: `tabs_single`,
            label: `📐 Углы`,
            options: [
              {
                label: `⬜ Скруглённые`,
                prompt: `Скруглить внешнюю плитку и внутренние формы где уместно; дружелюбный UI.`,
                value: `rounded`,
              },
              {
                label: `◻️ Острые`,
                prompt: `Острые углы и точная геометрия; технический или редакционный тон.`,
                value: `sharp`,
              },
              {
                label: `⭕ Круг`,
                prompt: `Вписать композицию в круглую маску; центрировать под круглую иконку приложения.`,
                value: `circle`,
              },
            ],
          },
          {
            default: `normal`,
            id: `padding`,
            kind: `tabs_single`,
            label: `↔️ Поля`,
            options: [
              {
                label: `🎯 Плотно`,
                prompt: `Плотные поля: знак занимает большую часть квадрата, небольшой внешний зазор.`,
                value: `tight`,
              },
              { label: `↔️ Обычно`, prompt: `Обычные поля иконки: около 20–25% поля вокруг знака.`, value: `normal` },
              {
                label: `🌬️ Воздух`,
                prompt: `Воздушная вёрстка: меньший знак, щедрое свободное поле; спокойный негатив.`,
                value: `airy`,
              },
            ],
          },
          {
            default: `square_light`,
            id: `tile`,
            kind: `tabs_single`,
            label: `🖼️ Плитка`,
            options: [
              {
                label: `⬜ Светлая`,
                prompt: `Светлая скруглённая плитка под иконкой; лёгкое «парение» по желанию.`,
                value: `square_light`,
              },
              {
                label: `⬛ Тёмная`,
                prompt: `Тёмная скруглённая плитка; знак светлый на тёмном.`,
                value: `square_dark`,
              },
              {
                label: `🫥 Без плитки`,
                prompt: `Без отдельной плитки: знак на ровном поле или чистом градиенте.`,
                value: `none`,
              },
              {
                label: `🌅 Мягкий градиент`,
                prompt: `Мягкий градиент фона за иконкой; градиент спокойный, знак остаётся главным.`,
                value: `gradient_bg`,
              },
            ],
          },
          {
            default: `standard`,
            id: `detail`,
            kind: `tabs_single`,
            label: `🔍 Детализация`,
            options: [
              {
                label: `◽ Минимум`,
                prompt: `Минимум деталей: одна–две визуальные идеи, максимум ясности на 24–32px.`,
                value: `minimal`,
              },
              {
                label: `◻️ Обычно`,
                prompt: `Обычный уровень детализации: уместные уточнения, баланс для иконки приложения.`,
                value: `standard`,
              },
              {
                label: `▪️ Богаче`,
                prompt: `Богаче деталей: вторичные элементы допустимы, если остаются в поле безопасности и читаются в среднем размере.`,
                value: `rich`,
              },
            ],
          },
        ],
        title: `🔷 Иконка`,
      },
    },
  }) as const;
/* jscpd:ignore-end */
