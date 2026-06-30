import { Prompts } from "../../shared";
// cspell:disable
import { StaticVisualAgent } from "../../static-agent";

export const Agent = StaticVisualAgent(
  () =>
    ({
      "meta.description": [
        `One icon — metaphor, style, palette, 2D/3D`,
        `Одна иконка — метафора, стиль, палитра, 2D/3D`,
      ],
      "meta.prompt": Prompts.visual.joinMeta([
        `You are an art-director for a single app icon asset. Read the **Metaphor & description** line as the creative brief. **Before** you compose the final output, analyze the metaphor in depth (keep this reasoning internal—do not output it): identify the abstract idea and what it must communicate; list concrete subject(s), props, and symbols; enumerate metaphor **attributes** and **properties** (e.g. stability vs motion, openness vs enclosure, warmth vs cold, precision vs softness, direction, scale, balance) and note how each should read **visually**; resolve ambiguities by choosing one coherent reading. Map every important attribute to drawable decisions: silhouette logic, focal hierarchy, secondary shapes, implied motion or gaze, use of negative space, and what reads at a glance. Merge that resolved brief with every bullet below (dimension, style, palette, edge intent, corners, padding, tile, detail). Then write **one** exceptionally detailed prompt **for image generation** (it will be sent to the image model). That prompt must **thoroughly describe the metaphor for the image model**: translate the abstract idea into explicit pictorial instructions—what appears, how elements relate, what each part signifies—so a text-to-image model can render the idea without guessing; do not rely on a bare label alone. Also spell out silhouette or stroke logic, color roles and approximate hues, lighting and shadows for the chosen dimension, material feel (matte, glass, plastic, paper), composition (exactly **one** icon centered in the square frame, generous safe margin, readable at small sizes), background treatment, and edge character (razor-clean for vector workflows versus soft painted pixels). Describe the shot as **one** finished square icon filling the frame—hero asset only. That prompt **must explicitly instruct** the image model: **no** text, letters, numbers, captions, logos-as-type, or any typography in the image—**pictorial icon artwork only**. It **must also explicitly instruct** scaling the subject to **use as much of the available square area as the chosen padding and composition allow**, **without stretching**: maximize footprint while **preserving the subject’s aspect ratio**.`,
        `Ты арт-директор одной иконки приложения. Строка **Метафора и описание** — бриф. Перед ответом внутренне (не выводи) разбери метафору: абстрактная идея, предметы, символы, свойства (стабильность/движение, открытость/замкнутость, тепло/холод, точность/мягкость, направление, масштаб, баланс) и как это выглядит; сними двусмысленности одним целым прочтением. Сопоставь атрибуты с решениями: силуэт, фокус, вторичные формы, взгляд/движение, негативное пространство, что читается с первого взгляда. Объедини результат с каждым пунктом ниже (измерение, стиль, палитра, края, углы, поля, плитка, детализация). Затем напиши **один** максимально подробный промпт для генерации изображения: явно опиши метафору для модели — что на холсте, связи элементов, значение частей; не ограничивайся ярлыком. Пропиши контур/обводку, роли цветов и оттенки, свет и тени под выбранное измерение, материал (мат/стекло/пластик/бумага), композицию (**одна** иконка по центру квадрата, безопасные поля, читаемость в мелком масштабе), фон и характер краёв (острый под вектор vs мягкий растр). Кадр — **одна** готовая квадратная иконка. Явно запрети текст, буквы, цифры, подписи, шрифтовые логотипы — только пиктограмма. Явно потребуй занять **максимум площади квадрата** в рамках выбранных полей и композиции **без растяжения**, сохраняя **пропорции** субъекта.`,
      ]),
      "meta.title": [`Icon`, `Иконка`],
      "ui.field.concept.label": [`Metaphor & description`, `Метафора и описание`],
      "ui.field.concept.placeholder": [
        `Metaphor (e.g. “calm focus”) + what to draw (e.g. “a lighthouse beam”) + mood…`,
        `Метафора (например «спокойный фокус») + что нарисовать + настроение…`,
      ],
      "ui.field.concept.prompt": [
        `Metaphor and description for the icon (required): state what the icon stands for, what should appear on canvas, and any mood or context.`,
        `Метафора и описание иконки (обязательно): за что она, что на холсте, настроение и контекст.`,
      ],
      "ui.field.corners.label": [`Corners`, `Углы`],
      "ui.field.corners.option.circle.label": [`Circle`, `Круг`],
      "ui.field.corners.option.circle.prompt": [
        `Compose inside a circular mask; content centered and balanced for round app icon.`,
        `В круглой маске; центр и баланс под круглую иконку.`,
      ],
      "ui.field.corners.option.rounded.label": [`Rounded`, `Скруглённые`],
      "ui.field.corners.option.rounded.prompt": [
        `Round corners on outer tile and on internal shapes where applicable; friendly UI feel.`,
        `Скругления внешней плитки и внутренних форм где уместно; дружелюбный UI.`,
      ],
      "ui.field.corners.option.sharp.label": [`Sharp`, `Острые`],
      "ui.field.corners.option.sharp.prompt": [
        `Sharp corners and precise geometry; technical or editorial tone.`,
        `Острые углы и точная геометрия; техничный или редакционный тон.`,
      ],
      "ui.field.detail.label": [`Detail`, `Детализация`],
      "ui.field.detail.option.minimal.label": [`Minimal`, `Минимум`],
      "ui.field.detail.option.minimal.prompt": [
        `Minimal detail: one or two visual ideas, maximum clarity at 24–32px.`,
        `Минимум деталей: одна–две идеи, максимум ясности в 24–32px.`,
      ],
      "ui.field.detail.option.rich.label": [`Rich`, `Богаче`],
      "ui.field.detail.option.rich.prompt": [
        `Richer detail: secondary elements allowed if they stay inside the safe margin and read at medium sizes.`,
        `Богаче: вторичные элементы в safe margin, читаемы в среднем масштабе.`,
      ],
      "ui.field.detail.option.standard.label": [`Standard`, `Обычно`],
      "ui.field.detail.option.standard.prompt": [
        `Standard detail level: readable embellishment, balanced for app icon use.`,
        `Обычная детализация: украшения читаемы, баланс для иконки приложения.`,
      ],
      "ui.field.dimension.label": [`Dimension`, `Измерение`],
      "ui.field.dimension.option.flat_2d.label": [`Flat 2D`, `Плоский 2D`],
      "ui.field.dimension.option.flat_2d.prompt": [
        `Render as flat 2D graphic: shapes sit on one plane, even fills or strokes, minimal depth cues.`,
        `Плоский 2D: формы в одной плоскости, ровные заливки/обводка, минимум глубины.`,
      ],
      "ui.field.dimension.option.glossy_3d.label": [`Glossy 3D`, `Глянцевый 3D`],
      "ui.field.dimension.option.glossy_3d.prompt": [
        `Render as glossy 3D: specular highlights, smooth plastic or glass-like material, controlled reflections.`,
        `Глянцевый 3D: блики, пластик/стекло, контролируемые отражения.`,
      ],
      "ui.field.dimension.option.iso_3d.label": [`Isometric`, `Изометрия`],
      "ui.field.dimension.option.iso_3d.prompt": [
        `Render in isometric 3D: consistent 30°-style projection, readable geometry, crisp faces.`,
        `Изометрический 3D: ~30° проекция, читаемая геометрия, чёткие грани.`,
      ],
      "ui.field.dimension.option.layered_2d.label": [`Layered 2D`, `Слои 2D`],
      "ui.field.dimension.option.layered_2d.prompt": [
        `Render as layered 2D: clear overlap, subtle drop shadows or separation between planes, still read as illustration not sculpture.`,
        `Слоистый 2D: перекрытия, лёгкие тени между слоями; иллюстрация, не скульптура.`,
      ],
      "ui.field.dimension.option.soft_3d.label": [`Soft 3D`, `Мягкий 3D`],
      "ui.field.dimension.option.soft_3d.prompt": [
        `Render as soft 3D: gentle bevels, rounded volumes, soft studio lighting, toy-like or app-icon chip depth.`,
        `Мягкий 3D: скосы, округлые объёмы, студийный свет, глубина как у UI-чипа.`,
      ],
      "ui.field.edge.label": [`Edge intent`, `Края`],
      "ui.field.edge.option.balanced.label": [`Balanced`, `Баланс`],
      "ui.field.edge.option.balanced.prompt": [
        `Balanced edge treatment: clean readable silhouette with light anti-aliased softness.`,
        `Баланс краёв: чистый силуэт с лёгким сглаживанием.`,
      ],
      "ui.field.edge.option.crisp_vector.label": [`Vector-ready`, `Под вектор`],
      "ui.field.edge.option.crisp_vector.prompt": [
        `Crisp closed shapes and clean edges: high-contrast boundaries suitable for later vector tracing; flat color regions, avoid noisy texture at edges.`,
        `Острые замкнутые формы и края: высокий контраст под последующий вектор; плоские зоны, без шума на контуре.`,
      ],
      "ui.field.edge.option.soft_raster.label": [`Soft raster`, `Мягкий растр`],
      "ui.field.edge.option.soft_raster.prompt": [
        `Soft painted or airbrushed edges: subtle gradients and texture welcome; painterly finish.`,
        `Мягкие «кистевые» края; лёгкие градиенты и фактура.`,
      ],
      "ui.field.padding.label": [`Padding`, `Поля`],
      "ui.field.padding.option.airy.label": [`Airy`, `Воздух`],
      "ui.field.padding.option.airy.prompt": [
        `Airy layout: smaller glyph with generous margin; calm negative space.`,
        `Воздушно: знак меньше, поля шире; спокойный негатив.`,
      ],
      "ui.field.padding.option.normal.label": [`Normal`, `Обычно`],
      "ui.field.padding.option.normal.prompt": [
        `Standard icon padding: roughly 20–25% margin around the glyph.`,
        `Стандартные поля: около 20–25% вокруг глифа.`,
      ],
      "ui.field.padding.option.tight.label": [`Tight`, `Плотно`],
      "ui.field.padding.option.tight.prompt": [
        `Tight margins: glyph occupies most of the square, small outer breathing room.`,
        `Плотно: глиф занимает большую часть квадрата, мало внешнего поля.`,
      ],
      "ui.field.palette.label": [`Palette`, `Палитра`],
      "ui.field.palette.option.amber_gold.label": [`Amber gold`, `Янтарь золото`],
      "ui.field.palette.option.amber_gold.prompt": [
        `Amber or gold highlights on deep or warm neutral base.`,
        `Янтарь или золото на тёмной или тёплой нейтральной базе.`,
      ],
      "ui.field.palette.option.black_solid.label": [`Black solid`, `Чёрный`],
      "ui.field.palette.option.black_solid.prompt": [
        `Near-black silhouette on white or transparent-look field; maximum graphic punch.`,
        `Почти чёрный силуэт на белом или «прозрачном» поле; максимум графики.`,
      ],
      "ui.field.palette.option.blue_white.label": [`Blue on white`, `Синий на белом`],
      "ui.field.palette.option.blue_white.prompt": [
        `Primary blue icon (around #2563eb family) on white or near-white field.`,
        `Основной синий (~#2563eb) на белом или почти белом.`,
      ],
      "ui.field.palette.option.duo_brand.label": [`Brand duo`, `Два бренд-цвета`],
      "ui.field.palette.option.duo_brand.prompt": [
        `Two harmonious hues: name primary and accent roles in the prompt (main shape vs detail).`,
        `Два согласованных цвета: в промпте назови основной и акцент (форма vs деталь).`,
      ],
      "ui.field.palette.option.gray_mono.label": [`Gray mono`, `Серый моно`],
      "ui.field.palette.option.gray_mono.prompt": [
        `Monochrome slate: charcoal or dark gray glyph on light gray tile (#f3f4f6-class).`,
        `Моно-сланец: тёмно-серый глиф на светло-серой плитке (#f3f4f6).`,
      ],
      "ui.field.palette.option.green_eco.label": [`Green eco`, `Зелёный эко`],
      "ui.field.palette.option.green_eco.prompt": [
        `Fresh green (#16a34a-class) with off-white; natural, calm energy.`,
        `Свежий зелёный (#16a34a) с off-white; природно и спокойно.`,
      ],
      "ui.field.palette.option.orange_warm.label": [`Orange warm`, `Тёплый оранж`],
      "ui.field.palette.option.orange_warm.prompt": [
        `Warm orange or amber accent on neutral light ground.`,
        `Тёплый оранж или янтарь на светлом нейтрале.`,
      ],
      "ui.field.palette.option.purple_ui.label": [`Purple UI`, `Фиолет UI`],
      "ui.field.palette.option.purple_ui.prompt": [
        `Violet or purple on white; contemporary product UI feel.`,
        `Фиолет на белом; современный продуктовый UI.`,
      ],
      "ui.field.palette.option.rose_pink.label": [`Rose pink`, `Розовый`],
      "ui.field.palette.option.rose_pink.prompt": [
        `Rose or soft pink accent with neutral balance; gentle modern.`,
        `Розовый акцент на нейтральном балансе; мягкий модерн.`,
      ],
      "ui.field.palette.option.slate_muted.label": [`Slate muted`, `Приглушённый сланец`],
      "ui.field.palette.option.slate_muted.prompt": [
        `Muted slate and blue-gray tones; understated professional.`,
        `Приглушённый сланец и сине-серый; сдержанный профи.`,
      ],
      "ui.field.palette.option.teal_cyan.label": [`Teal cyan`, `Бирюза циан`],
      "ui.field.palette.option.teal_cyan.prompt": [
        `Teal or cyan-forward palette with white or pale gray.`,
        `Бирюза/циан впереди с белым или бледно-серым.`,
      ],
      "ui.field.palette.option.white_dark.label": [`White on dark`, `Белый на тёмном`],
      "ui.field.palette.option.white_dark.prompt": [
        `White or light glyph on dark ground (#111827–#1f2937-class), strong contrast.`,
        `Светлый глиф на тёмном (#111827–#1f2937); сильный контраст.`,
      ],
      "ui.field.style.label": [`Style`, `Стиль`],
      "ui.field.style.option.duotone.label": [`Duotone`, `Дуотон`],
      "ui.field.style.option.duotone.prompt": [
        `Duotone treatment: exactly two flat fills working as primary and accent inside one glyph.`,
        `Дуотон: ровно две плоские заливки как основной и акцент в одном глифе.`,
      ],
      "ui.field.style.option.glass.label": [`Glass`, `Стекло`],
      "ui.field.style.option.glass.prompt": [
        `Glassmorphism: translucent panels, light refraction, soft blur behind glass layers.`,
        `Глассморфизм: полупрозрачные панели, преломление, размытие за стеклом.`,
      ],
      "ui.field.style.option.gradient_soft.label": [`Gradient`, `Градиент`],
      "ui.field.style.option.gradient_soft.prompt": [
        `Smooth gradients within shapes: modern app-icon polish, controlled color stops.`,
        `Плавные градиенты в формах; полировка иконки приложения.`,
      ],
      "ui.field.style.option.ink_sketch.label": [`Ink sketch`, `Тушь`],
      "ui.field.style.option.ink_sketch.prompt": [
        `Hand-inked sketch look: confident linework, optional light wash, still reads as one icon.`,
        `Тушь/скетч: уверенный контур, лёгкая заливка, один цельный знак.`,
      ],
      "ui.field.style.option.minimal_flat.label": [`Minimal flat`, `Минимализм`],
      "ui.field.style.option.minimal_flat.prompt": [
        `Minimal flat UI language: simple geometry, few elements, generous whitespace inside the glyph.`,
        `Минимальный плоский UI: простая геометрия, мало элементов, воздух внутри.`,
      ],
      "ui.field.style.option.neumorph.label": [`Neumorphic`, `Неоморфизм`],
      "ui.field.style.option.neumorph.prompt": [
        `Soft neumorphic relief: subtle dual shadows, element appears extruded from same-tone surface.`,
        `Неоморфизм: двойные мягкие тени, элемент «выпукл» из тона поверхности.`,
      ],
      "ui.field.style.option.outline_stroke.label": [`Outline`, `Контур`],
      "ui.field.style.option.outline_stroke.prompt": [
        `Outline icon: uniform stroke weight, rounded or mitered joins as fits the corner setting; interior detail spare.`,
        `Контур: равномерная толщина, скругления/острые стыки по настройке углов; мало внутренней детали.`,
      ],
      "ui.field.style.option.pixel.label": [`Pixel`, `Пиксель-арт`],
      "ui.field.style.option.pixel.prompt": [
        `Pixel-art aesthetic: visible pixel grid, limited palette inside the style, crisp block forms.`,
        `Пиксель-арт: видимая сетка, ограниченная палитра, чёткие блоки.`,
      ],
      "ui.field.style.option.silhouette_fill.label": [`Silhouette`, `Силуэт`],
      "ui.field.style.option.silhouette_fill.prompt": [
        `Solid silhouette: one dominant filled shape, high contrast, legible at 24px.`,
        `Сплошной силуэт: одна доминирующая заливка, контраст, читаемость ~24px.`,
      ],
      "ui.field.tile.label": [`Tile`, `Плитка`],
      "ui.field.tile.option.gradient_bg.label": [`Soft gradient`, `Мягкий градиент`],
      "ui.field.tile.option.gradient_bg.prompt": [
        `Soft gradient field behind the icon; keep gradient subtle so the glyph stays dominant.`,
        `Мягкий градиент за иконкой; градиент не перетягивает глиф.`,
      ],
      "ui.field.tile.option.none.label": [`None`, `Без плитки`],
      "ui.field.tile.option.none.prompt": [
        `No separate tile: icon sits on a flat field or clean gradient only.`,
        `Без отдельной плитки: только поле или чистый градиент.`,
      ],
      "ui.field.tile.option.square_dark.label": [`Dark square`, `Тёмная`],
      "ui.field.tile.option.square_dark.prompt": [
        `Dark rounded-square tile; icon reads as light-on-dark.`,
        `Тёмная скруглённая плитка; знак светлый на тёмном.`,
      ],
      "ui.field.tile.option.square_light.label": [`Light square`, `Светлая`],
      "ui.field.tile.option.square_light.prompt": [
        `Light rounded-square tile behind the icon; soft elevation optional.`,
        `Светлая скруглённая плитка за иконкой; лёгкий объём по желанию.`,
      ],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `🎯`,
      group: `visual`,
      plan: {
        fields: [
          {
            id: `concept`,
            kind: `text_input`,
            label: { emoji: `💡`, text: i18n(`ui.field.concept.label`) },
            placeholder: i18n(`ui.field.concept.placeholder`),
            prompt: i18n(`ui.field.concept.prompt`),
          },
          {
            default: `flat_2d`,
            id: `dimension`,
            kind: `single_choice`,
            label: { emoji: `📐`, text: i18n(`ui.field.dimension.label`) },
            options: [
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.dimension.option.flat_2d.label`) },
                prompt: i18n(`ui.field.dimension.option.flat_2d.prompt`),
                value: `flat_2d`,
              },
              {
                label: { emoji: `📚`, text: i18n(`ui.field.dimension.option.layered_2d.label`) },
                prompt: i18n(`ui.field.dimension.option.layered_2d.prompt`),
                value: `layered_2d`,
              },
              {
                label: { emoji: `🧊`, text: i18n(`ui.field.dimension.option.soft_3d.label`) },
                prompt: i18n(`ui.field.dimension.option.soft_3d.prompt`),
                value: `soft_3d`,
              },
              {
                label: { emoji: `📦`, text: i18n(`ui.field.dimension.option.iso_3d.label`) },
                prompt: i18n(`ui.field.dimension.option.iso_3d.prompt`),
                value: `iso_3d`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.dimension.option.glossy_3d.label`) },
                prompt: i18n(`ui.field.dimension.option.glossy_3d.prompt`),
                value: `glossy_3d`,
              },
            ],
          },
          {
            default: `minimal_flat`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🖌️`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.style.option.minimal_flat.label`) },
                prompt: i18n(`ui.field.style.option.minimal_flat.prompt`),
                value: `minimal_flat`,
              },
              {
                label: { emoji: `➿`, text: i18n(`ui.field.style.option.outline_stroke.label`) },
                prompt: i18n(`ui.field.style.option.outline_stroke.prompt`),
                value: `outline_stroke`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.style.option.silhouette_fill.label`) },
                prompt: i18n(`ui.field.style.option.silhouette_fill.prompt`),
                value: `silhouette_fill`,
              },
              {
                label: { emoji: `🎭`, text: i18n(`ui.field.style.option.duotone.label`) },
                prompt: i18n(`ui.field.style.option.duotone.prompt`),
                value: `duotone`,
              },
              {
                label: { emoji: `🪟`, text: i18n(`ui.field.style.option.glass.label`) },
                prompt: i18n(`ui.field.style.option.glass.prompt`),
                value: `glass`,
              },
              {
                label: { emoji: `🌫️`, text: i18n(`ui.field.style.option.neumorph.label`) },
                prompt: i18n(`ui.field.style.option.neumorph.prompt`),
                value: `neumorph`,
              },
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.style.option.gradient_soft.label`) },
                prompt: i18n(`ui.field.style.option.gradient_soft.prompt`),
                value: `gradient_soft`,
              },
              {
                label: { emoji: `👾`, text: i18n(`ui.field.style.option.pixel.label`) },
                prompt: i18n(`ui.field.style.option.pixel.prompt`),
                value: `pixel`,
              },
              {
                label: { emoji: `✒️`, text: i18n(`ui.field.style.option.ink_sketch.label`) },
                prompt: i18n(`ui.field.style.option.ink_sketch.prompt`),
                value: `ink_sketch`,
              },
            ],
          },
          {
            default: `blue_white`,
            id: `palette`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.palette.label`) },
            options: [
              {
                label: { emoji: `🔵`, text: i18n(`ui.field.palette.option.blue_white.label`) },
                prompt: i18n(`ui.field.palette.option.blue_white.prompt`),
                value: `blue_white`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.palette.option.gray_mono.label`) },
                prompt: i18n(`ui.field.palette.option.gray_mono.prompt`),
                value: `gray_mono`,
              },
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.palette.option.white_dark.label`) },
                prompt: i18n(`ui.field.palette.option.white_dark.prompt`),
                value: `white_dark`,
              },
              {
                label: { emoji: `🌈`, text: i18n(`ui.field.palette.option.duo_brand.label`) },
                prompt: i18n(`ui.field.palette.option.duo_brand.prompt`),
                value: `duo_brand`,
              },
              {
                label: { emoji: `🍏`, text: i18n(`ui.field.palette.option.green_eco.label`) },
                prompt: i18n(`ui.field.palette.option.green_eco.prompt`),
                value: `green_eco`,
              },
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.palette.option.orange_warm.label`) },
                prompt: i18n(`ui.field.palette.option.orange_warm.prompt`),
                value: `orange_warm`,
              },
              {
                label: { emoji: `💜`, text: i18n(`ui.field.palette.option.purple_ui.label`) },
                prompt: i18n(`ui.field.palette.option.purple_ui.prompt`),
                value: `purple_ui`,
              },
              {
                label: { emoji: `🩵`, text: i18n(`ui.field.palette.option.teal_cyan.label`) },
                prompt: i18n(`ui.field.palette.option.teal_cyan.prompt`),
                value: `teal_cyan`,
              },
              {
                label: { emoji: `🌸`, text: i18n(`ui.field.palette.option.rose_pink.label`) },
                prompt: i18n(`ui.field.palette.option.rose_pink.prompt`),
                value: `rose_pink`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.palette.option.amber_gold.label`) },
                prompt: i18n(`ui.field.palette.option.amber_gold.prompt`),
                value: `amber_gold`,
              },
              {
                label: { emoji: `🖤`, text: i18n(`ui.field.palette.option.black_solid.label`) },
                prompt: i18n(`ui.field.palette.option.black_solid.prompt`),
                value: `black_solid`,
              },
              {
                label: { emoji: `🌫️`, text: i18n(`ui.field.palette.option.slate_muted.label`) },
                prompt: i18n(`ui.field.palette.option.slate_muted.prompt`),
                value: `slate_muted`,
              },
            ],
          },
          {
            default: `balanced`,
            id: `edge`,
            kind: `single_choice`,
            label: { emoji: `🔷`, text: i18n(`ui.field.edge.label`) },
            options: [
              {
                label: { emoji: `📐`, text: i18n(`ui.field.edge.option.crisp_vector.label`) },
                prompt: i18n(`ui.field.edge.option.crisp_vector.prompt`),
                value: `crisp_vector`,
              },
              {
                label: { emoji: `🖌️`, text: i18n(`ui.field.edge.option.soft_raster.label`) },
                prompt: i18n(`ui.field.edge.option.soft_raster.prompt`),
                value: `soft_raster`,
              },
              {
                label: { emoji: `⚖️`, text: i18n(`ui.field.edge.option.balanced.label`) },
                prompt: i18n(`ui.field.edge.option.balanced.prompt`),
                value: `balanced`,
              },
            ],
          },
          {
            default: `rounded`,
            id: `corners`,
            kind: `single_choice`,
            label: { emoji: `📐`, text: i18n(`ui.field.corners.label`) },
            options: [
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.corners.option.rounded.label`) },
                prompt: i18n(`ui.field.corners.option.rounded.prompt`),
                value: `rounded`,
              },
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.corners.option.sharp.label`) },
                prompt: i18n(`ui.field.corners.option.sharp.prompt`),
                value: `sharp`,
              },
              {
                label: { emoji: `⭕`, text: i18n(`ui.field.corners.option.circle.label`) },
                prompt: i18n(`ui.field.corners.option.circle.prompt`),
                value: `circle`,
              },
            ],
          },
          {
            default: `normal`,
            id: `padding`,
            kind: `single_choice`,
            label: { emoji: `↔️`, text: i18n(`ui.field.padding.label`) },
            options: [
              {
                label: { emoji: `🎯`, text: i18n(`ui.field.padding.option.tight.label`) },
                prompt: i18n(`ui.field.padding.option.tight.prompt`),
                value: `tight`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.padding.option.normal.label`) },
                prompt: i18n(`ui.field.padding.option.normal.prompt`),
                value: `normal`,
              },
              {
                label: { emoji: `🌬️`, text: i18n(`ui.field.padding.option.airy.label`) },
                prompt: i18n(`ui.field.padding.option.airy.prompt`),
                value: `airy`,
              },
            ],
          },
          {
            default: `square_light`,
            id: `tile`,
            kind: `single_choice`,
            label: { emoji: `🖼️`, text: i18n(`ui.field.tile.label`) },
            options: [
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.tile.option.square_light.label`) },
                prompt: i18n(`ui.field.tile.option.square_light.prompt`),
                value: `square_light`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.tile.option.square_dark.label`) },
                prompt: i18n(`ui.field.tile.option.square_dark.prompt`),
                value: `square_dark`,
              },
              {
                label: { emoji: `🫥`, text: i18n(`ui.field.tile.option.none.label`) },
                prompt: i18n(`ui.field.tile.option.none.prompt`),
                value: `none`,
              },
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.tile.option.gradient_bg.label`) },
                prompt: i18n(`ui.field.tile.option.gradient_bg.prompt`),
                value: `gradient_bg`,
              },
            ],
          },
          {
            default: `standard`,
            id: `detail`,
            kind: `single_choice`,
            label: { emoji: `🔍`, text: i18n(`ui.field.detail.label`) },
            options: [
              {
                label: { emoji: `◽`, text: i18n(`ui.field.detail.option.minimal.label`) },
                prompt: i18n(`ui.field.detail.option.minimal.prompt`),
                value: `minimal`,
              },
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.detail.option.standard.label`) },
                prompt: i18n(`ui.field.detail.option.standard.prompt`),
                value: `standard`,
              },
              {
                label: { emoji: `▪️`, text: i18n(`ui.field.detail.option.rich.label`) },
                prompt: i18n(`ui.field.detail.option.rich.prompt`),
                value: `rich`,
              },
            ],
          },
        ],
        title: i18n(`meta.title`),
      },
      prompt: i18n(`meta.prompt`),
    }) as const,
);
