// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [
    `Profile avatar or character portrait with rich styling`,
    `Аватар или портрет персонажа с гибкими настройками`,
  ],
  emoji: `🧑‍🎨`,
  group: `edit`,
  title: [`Avatar`, `Аватар`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I need a polished profile photo — I'll share the portrait.`,
        `Нужно аккуратное фото профиля — пришлю портрет.`,
      ],
      skill: `image-editing`,
      tools: [`ask`, `date-time`, `edit-image`, `look-image`, `publish-image`],
    }),
    Flow.staticVisual(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            default: `human_adult`,
            id: `subject`,
            kind: `single_choice`,
            label: { emoji: `🧬`, text: i18n(`ui.field.subject.label`) },
            options: [
              {
                label: { emoji: `👤`, text: i18n(`ui.field.subject.option.human_adult.label`) },
                prompt: i18n(`ui.field.subject.option.human_adult.prompt`),
                value: `human_adult`,
              },
              {
                label: { emoji: `🧒`, text: i18n(`ui.field.subject.option.human_youth.label`) },
                prompt: i18n(`ui.field.subject.option.human_youth.prompt`),
                value: `human_youth`,
              },
              {
                label: { emoji: `🤖`, text: i18n(`ui.field.subject.option.robot.label`) },
                prompt: i18n(`ui.field.subject.option.robot.prompt`),
                value: `robot`,
              },
              {
                label: { emoji: `🐾`, text: i18n(`ui.field.subject.option.animal.label`) },
                prompt: i18n(`ui.field.subject.option.animal.prompt`),
                value: `animal`,
              },
              {
                label: { emoji: `🧝`, text: i18n(`ui.field.subject.option.fantasy.label`) },
                prompt: i18n(`ui.field.subject.option.fantasy.prompt`),
                value: `fantasy`,
              },
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.subject.option.abstract.label`) },
                prompt: i18n(`ui.field.subject.option.abstract.prompt`),
                value: `abstract`,
              },
            ],
          },
          {
            default: `neutral`,
            id: `mood`,
            kind: `single_choice`,
            label: { emoji: `😶`, text: i18n(`ui.field.mood.label`) },
            options: [
              {
                label: { emoji: `😐`, text: i18n(`ui.field.mood.option.neutral.label`) },
                prompt: i18n(`ui.field.mood.option.neutral.prompt`),
                value: `neutral`,
              },
              {
                label: { emoji: `😊`, text: i18n(`ui.field.mood.option.friendly.label`) },
                prompt: i18n(`ui.field.mood.option.friendly.prompt`),
                value: `friendly`,
              },
              {
                label: { emoji: `😎`, text: i18n(`ui.field.mood.option.confident.label`) },
                prompt: i18n(`ui.field.mood.option.confident.prompt`),
                value: `confident`,
              },
              {
                label: { emoji: `🌙`, text: i18n(`ui.field.mood.option.mysterious.label`) },
                prompt: i18n(`ui.field.mood.option.mysterious.prompt`),
                value: `mysterious`,
              },
              {
                label: { emoji: `🎉`, text: i18n(`ui.field.mood.option.playful.label`) },
                prompt: i18n(`ui.field.mood.option.playful.prompt`),
                value: `playful`,
              },
              {
                label: { emoji: `😌`, text: i18n(`ui.field.mood.option.serene.label`) },
                prompt: i18n(`ui.field.mood.option.serene.prompt`),
                value: `serene`,
              },
            ],
          },
          {
            default: `headshot`,
            id: `framing`,
            kind: `single_choice`,
            label: { emoji: `📷`, text: i18n(`ui.field.framing.label`) },
            options: [
              {
                label: { emoji: `🎯`, text: i18n(`ui.field.framing.option.headshot.label`) },
                prompt: i18n(`ui.field.framing.option.headshot.prompt`),
                value: `headshot`,
              },
              {
                label: { emoji: `👔`, text: i18n(`ui.field.framing.option.bust.label`) },
                prompt: i18n(`ui.field.framing.option.bust.prompt`),
                value: `bust`,
              },
              {
                label: { emoji: `🧍`, text: i18n(`ui.field.framing.option.half.label`) },
                prompt: i18n(`ui.field.framing.option.half.prompt`),
                value: `half`,
              },
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.framing.option.circle.label`) },
                prompt: i18n(`ui.field.framing.option.circle.prompt`),
                value: `circle`,
              },
            ],
          },
          {
            default: `warm`,
            id: `palette`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.palette.label`) },
            options: [
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.palette.option.warm.label`) },
                prompt: i18n(`ui.field.palette.option.warm.prompt`),
                value: `warm`,
              },
              {
                label: { emoji: `🌊`, text: i18n(`ui.field.palette.option.cool.label`) },
                prompt: i18n(`ui.field.palette.option.cool.prompt`),
                value: `cool`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.palette.option.mono.label`) },
                prompt: i18n(`ui.field.palette.option.mono.prompt`),
                value: `mono`,
              },
              {
                label: { emoji: `🌸`, text: i18n(`ui.field.palette.option.pastel.label`) },
                prompt: i18n(`ui.field.palette.option.pastel.prompt`),
                value: `pastel`,
              },
              {
                label: { emoji: `💜`, text: i18n(`ui.field.palette.option.neon.label`) },
                prompt: i18n(`ui.field.palette.option.neon.prompt`),
                value: `neon`,
              },
              {
                label: { emoji: `🌿`, text: i18n(`ui.field.palette.option.earth.label`) },
                prompt: i18n(`ui.field.palette.option.earth.prompt`),
                value: `earth`,
              },
              {
                label: { emoji: `🌙`, text: i18n(`ui.field.palette.option.navy_gold.label`) },
                prompt: i18n(`ui.field.palette.option.navy_gold.prompt`),
                value: `navy_gold`,
              },
              {
                label: { emoji: `🍭`, text: i18n(`ui.field.palette.option.candy.label`) },
                prompt: i18n(`ui.field.palette.option.candy.prompt`),
                value: `candy`,
              },
            ],
          },
          {
            default: `soft_gradient`,
            id: `background`,
            kind: `single_choice`,
            label: { emoji: `🖼️`, text: i18n(`ui.field.background.label`) },
            options: [
              {
                label: { emoji: `🌫️`, text: i18n(`ui.field.background.option.soft_gradient.label`) },
                prompt: i18n(`ui.field.background.option.soft_gradient.prompt`),
                value: `soft_gradient`,
              },
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.background.option.solid_light.label`) },
                prompt: i18n(`ui.field.background.option.solid_light.prompt`),
                value: `solid_light`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.background.option.solid_dark.label`) },
                prompt: i18n(`ui.field.background.option.solid_dark.prompt`),
                value: `solid_dark`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.background.option.studio.label`) },
                prompt: i18n(`ui.field.background.option.studio.prompt`),
                value: `studio`,
              },
              {
                label: { emoji: `🌌`, text: i18n(`ui.field.background.option.bokeh.label`) },
                prompt: i18n(`ui.field.background.option.bokeh.prompt`),
                value: `bokeh`,
              },
            ],
          },
          {
            default: `flat`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🖌️`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.style.option.flat.label`) },
                prompt: i18n(`ui.field.style.option.flat.prompt`),
                value: `flat`,
              },
              {
                label: { emoji: `📷`, text: i18n(`ui.field.style.option.realistic.label`) },
                prompt: i18n(`ui.field.style.option.realistic.prompt`),
                value: `realistic`,
              },
              {
                label: { emoji: `🎌`, text: i18n(`ui.field.style.option.anime.label`) },
                prompt: i18n(`ui.field.style.option.anime.prompt`),
                value: `anime`,
              },
              {
                label: { emoji: `🎮`, text: i18n(`ui.field.style.option.pixel.label`) },
                prompt: i18n(`ui.field.style.option.pixel.prompt`),
                value: `pixel`,
              },
              {
                label: { emoji: `🎨`, text: i18n(`ui.field.style.option.painterly.label`) },
                prompt: i18n(`ui.field.style.option.painterly.prompt`),
                value: `painterly`,
              },
              {
                label: { emoji: `🧊`, text: i18n(`ui.field.style.option.3d.label`) },
                prompt: i18n(`ui.field.style.option.3d.prompt`),
                value: `3d`,
              },
            ],
          },
          {
            default: `soft_front`,
            id: `lighting`,
            kind: `single_choice`,
            label: { emoji: `💡`, text: i18n(`ui.field.lighting.label`) },
            options: [
              {
                label: { emoji: `☁️`, text: i18n(`ui.field.lighting.option.soft_front.label`) },
                prompt: i18n(`ui.field.lighting.option.soft_front.prompt`),
                value: `soft_front`,
              },
              {
                label: { emoji: `🌗`, text: i18n(`ui.field.lighting.option.side.label`) },
                prompt: i18n(`ui.field.lighting.option.side.prompt`),
                value: `side`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.lighting.option.rim.label`) },
                prompt: i18n(`ui.field.lighting.option.rim.prompt`),
                value: `rim`,
              },
              {
                label: { emoji: `🌈`, text: i18n(`ui.field.lighting.option.gel.label`) },
                prompt: i18n(`ui.field.lighting.option.gel.prompt`),
                value: `gel`,
              },
            ],
          },
          {
            id: `extra`,
            kind: `text_input`,
            label: { emoji: `📝`, text: i18n(`ui.field.extra.label`) },
            placeholder: i18n(`ui.field.extra.placeholder`),
            prompt: i18n(`ui.field.extra.prompt`),
          },
        ]),
      localization: () => ({
        "prompt": Prompts.visual.joinMeta([
          `You build image-generation prompts. From the latest user message, the optional one-line detail (if any), and every bullet below, write **one** detailed prompt **for image generation** (it will be sent to the image model). Merge: subject type, mood, framing, art style, **exact palette name from the tabs**, background treatment, lighting implied by choices. If optional detail adds a trait, fold it into the description. No random text on image unless detail asks for text.`,
          `Собери **один** промпт для генерации изображения по последнему сообщению пользователя, необязательной строке уточнения и каждому пункту ниже. Объедини: тип субъекта, настроение, кадр, стиль, **название палитры с вкладок**, фон, свет. Уточнение вплети в описание. Без случайного текста на картинке, если уточнение не просит текст.`,
        ]),
        "ui.field.background.label": [`Background`, `Фон`],
        "ui.field.background.option.bokeh.label": [`Blurred scene`, `Боке`],
        "ui.field.background.option.bokeh.prompt": [
          `Blurred bokeh background; colors harmonize with palette.`,
          `Размытый боке; цвета в тон палитре.`,
        ],
        "ui.field.background.option.soft_gradient.label": [`Soft gradient`, `Градиент`],
        "ui.field.background.option.soft_gradient.prompt": [
          `Soft gradient background matching the palette; no busy detail.`,
          `Мягкий градиент под палитру; без лишней детализации фона.`,
        ],
        "ui.field.background.option.solid_dark.label": [`Solid dark`, `Тёмный`],
        "ui.field.background.option.solid_dark.prompt": [
          `Solid dark background; subject pops forward.`,
          `Ровный тёмный фон; субъект выходит вперёд.`,
        ],
        "ui.field.background.option.solid_light.label": [`Solid light`, `Светлый`],
        "ui.field.background.option.solid_light.prompt": [
          `Solid light neutral background.`,
          `Ровный светлый нейтральный фон.`,
        ],
        "ui.field.background.option.studio.label": [`Studio`, `Студия`],
        "ui.field.background.option.studio.prompt": [
          `Studio-style softbox lighting; subtle gray backdrop.`,
          `Студийный софтбокс; нейтрально-серый фон.`,
        ],
        "ui.field.extra.label": [`Optional detail`, `Уточнение`],
        "ui.field.extra.placeholder": [`Glasses, hat, team name, one trait…`, `Очки, шапка, команда — одна строка…`],
        "ui.field.extra.prompt": [
          `Optional detail (one line — hair, accessory, team, etc.):`,
          `Уточнение одной строкой — волосы, аксессуар, команда и т.п.:`,
        ],
        "ui.field.framing.label": [`Framing`, `Кадр`],
        "ui.field.framing.option.bust.label": [`Bust`, `Плечи`],
        "ui.field.framing.option.bust.prompt": [
          `Bust: head and shoulders with some clothing visible.`,
          `По плечи: голова и плечи, часть одежды видна.`,
        ],
        "ui.field.framing.option.circle.label": [`Avatar circle`, `В круге`],
        "ui.field.framing.option.circle.prompt": [
          `Centered subject as if for a circular avatar crop; even padding.`,
          `По центру как под круглый аватар; ровные поля.`,
        ],
        "ui.field.framing.option.half.label": [`Half body`, `Пояс`],
        "ui.field.framing.option.half.prompt": [
          `Half body: waist-up composition.`,
          `По пояс: композиция от талии вверх.`,
        ],
        "ui.field.framing.option.headshot.label": [`Headshot`, `Крупный план`],
        "ui.field.framing.option.headshot.prompt": [
          `Tight headshot; face fills most of frame.`,
          `Крупный портрет; лицо занимает большую часть кадра.`,
        ],
        "ui.field.lighting.label": [`Light`, `Свет`],
        "ui.field.lighting.option.gel.label": [`Color gel`, `Гель`],
        "ui.field.lighting.option.gel.prompt": [
          `Subtle colored gel lights matching palette.`,
          `Лёгкий цветной гель-свет в тон палитре.`,
        ],
        "ui.field.lighting.option.rim.label": [`Rim`, `Контур`],
        "ui.field.lighting.option.rim.prompt": [
          `Rim light separating subject from background.`,
          `Контовой свет, отделяющий субъект от фона.`,
        ],
        "ui.field.lighting.option.side.label": [`Side`, `Сбоку`],
        "ui.field.lighting.option.side.prompt": [
          `Side light: defined cheek shadows; more cinematic.`,
          `Свет сбоку: тени на щеках; кинематографичнее.`,
        ],
        "ui.field.lighting.option.soft_front.label": [`Soft front`, `Спереди`],
        "ui.field.lighting.option.soft_front.prompt": [
          `Soft frontal key light; even, flattering.`,
          `Мягкий фронтальный ключ; ровно и лестно.`,
        ],
        "ui.field.mood.label": [`Mood`, `Настроение`],
        "ui.field.mood.option.confident.label": [`Confident`, `Уверенное`],
        "ui.field.mood.option.confident.prompt": [
          `Confident, composed, subtle intensity.`,
          `Уверенно, собранно, лёгкая интенсивность.`,
        ],
        "ui.field.mood.option.friendly.label": [`Friendly`, `Дружелюбное`],
        "ui.field.mood.option.friendly.prompt": [
          `Friendly, slight smile, approachable.`,
          `Дружелюбно, лёгкая улыбка, открыто.`,
        ],
        "ui.field.mood.option.mysterious.label": [`Mysterious`, `Загадочное`],
        "ui.field.mood.option.mysterious.prompt": [
          `Mysterious or dramatic lighting on face; intriguing.`,
          `Загадочно или драматичный свет на лице.`,
        ],
        "ui.field.mood.option.neutral.label": [`Neutral`, `Нейтральное`],
        "ui.field.mood.option.neutral.prompt": [`Neutral, calm expression.`, `Нейтральное спокойное выражение.`],
        "ui.field.mood.option.playful.label": [`Playful`, `Живое`],
        "ui.field.mood.option.playful.prompt": [`Playful, energetic, bright expression.`, `Игриво, энергично, ярко.`],
        "ui.field.mood.option.serene.label": [`Serene`, `Спокойное`],
        "ui.field.mood.option.serene.prompt": [`Serene, soft, peaceful.`, `Серено, мягко, мирно.`],
        "ui.field.palette.label": [`Palette`, `Палитра`],
        "ui.field.palette.option.candy.label": [`Candy`, `Candy`],
        "ui.field.palette.option.candy.prompt": [
          `Candy bright: saturated pinks, blues, greens—still harmonious.`,
          `Яркие насыщенные розовый, синий, зелёный — в гармонии.`,
        ],
        "ui.field.palette.option.cool.label": [`Cool`, `Холодная`],
        "ui.field.palette.option.cool.prompt": [
          `Cool palette: teal, blue, icy lavender, silver highlights.`,
          `Холодная палитра: бирюза, синий, лаванда, серебро.`,
        ],
        "ui.field.palette.option.earth.label": [`Earth`, `Земля`],
        "ui.field.palette.option.earth.prompt": [
          `Earth tones: olive, terracotta, sand, deep brown.`,
          `Земляные: олива, терракота, песок, тёмно-коричневый.`,
        ],
        "ui.field.palette.option.mono.label": [`Monochrome`, `Моно`],
        "ui.field.palette.option.mono.prompt": [
          `Black, white, and grays only; strong contrast.`,
          `Только чёрный, белый и серый; сильный контраст.`,
        ],
        "ui.field.palette.option.navy_gold.label": [`Navy & gold`, `Синь+золото`],
        "ui.field.palette.option.navy_gold.prompt": [
          `Navy blue with gold accents; premium feel.`,
          `Тёмно-синий с золотыми акцентами; премиум.`,
        ],
        "ui.field.palette.option.neon.label": [`Neon`, `Неон`],
        "ui.field.palette.option.neon.prompt": [
          `Neon accents on dark base: magenta, cyan, electric purple—controlled glow.`,
          `Неон на тёмном: пурпур, циан, электрофиолет — сдержанное свечение.`,
        ],
        "ui.field.palette.option.pastel.label": [`Pastel`, `Пастель`],
        "ui.field.palette.option.pastel.prompt": [
          `Soft pastels: pink, mint, lilac, light yellow.`,
          `Мягкая пастель: розовый, мята, сирень, светло-жёлтый.`,
        ],
        "ui.field.palette.option.warm.label": [`Warm`, `Тёплая`],
        "ui.field.palette.option.warm.prompt": [
          `Warm palette: cream, peach, coral, soft gold accents.`,
          `Тёплая палитра: крем, персик, коралл, мягкое золото.`,
        ],
        "ui.field.style.label": [`Art style`, `Стиль`],
        "ui.field.style.option.3d.label": [`3D render`, `3D`],
        "ui.field.style.option.3d.prompt": [
          `3D render look: smooth materials, subtle global illumination.`,
          `3D-рендер: гладкие материалы, лёгкий GI.`,
        ],
        "ui.field.style.option.anime.label": [`Anime`, `Аниме`],
        "ui.field.style.option.anime.prompt": [
          `Anime/manga: line art, cel or soft shading.`,
          `Аниме/манга: линии, сел-шейдинг или мягкий.`,
        ],
        "ui.field.style.option.flat.label": [`Flat`, `Плоский`],
        "ui.field.style.option.flat.prompt": [
          `Flat illustration: clean shapes, limited shading.`,
          `Плоская иллюстрация: чистые формы, мало тени.`,
        ],
        "ui.field.style.option.painterly.label": [`Painterly`, `Живопись`],
        "ui.field.style.option.painterly.prompt": [
          `Painterly digital brush strokes; textured.`,
          `Живописные цифровые мазки; фактура.`,
        ],
        "ui.field.style.option.pixel.label": [`Pixel`, `Пиксель`],
        "ui.field.style.option.pixel.prompt": [
          `Pixel art avatar; readable at low resolution.`,
          `Пиксель-арт; читается в низком разрешении.`,
        ],
        "ui.field.style.option.realistic.label": [`Realistic`, `Реализм`],
        "ui.field.style.option.realistic.prompt": [
          `Realistic or photographic skin and light.`,
          `Реализм или фото: кожа и свет правдоподобно.`,
        ],
        "ui.field.subject.label": [`Subject`, `Кто`],
        "ui.field.subject.option.abstract.label": [`Abstract bust`, `Абстракция`],
        "ui.field.subject.option.abstract.prompt": [
          `Abstract or geometric interpretation of a head/figure; still reads as avatar.`,
          `Абстрактная или геометрическая голова/фигура; всё ещё читается как аватар.`,
        ],
        "ui.field.subject.option.animal.label": [`Stylized animal`, `Зверь стилиз.`],
        "ui.field.subject.option.animal.prompt": [
          `Anthropomorphic or stylized animal character; clear species cues.`,
          `Антропоморфный или стилизованный зверь; вид узнаваем.`,
        ],
        "ui.field.subject.option.fantasy.label": [`Fantasy`, `Фэнтези`],
        "ui.field.subject.option.fantasy.prompt": [
          `Fantasy race or costume: elf, knight, mage vibe without copying known IP.`,
          `Фэнтези раса или костюм: эльф, рыцарь, маг — без копирования чужих IP.`,
        ],
        "ui.field.subject.option.human_adult.label": [`Adult`, `Взрослый`],
        "ui.field.subject.option.human_adult.prompt": [
          `Human adult portrait or upper body; natural proportions.`,
          `Взрослый человек, портрет или верх тела; естественные пропорции.`,
        ],
        "ui.field.subject.option.human_youth.label": [`Youth`, `Молодой`],
        "ui.field.subject.option.human_youth.prompt": [
          `Teen or young adult look; age-appropriate styling.`,
          `Подросток или молодой взрослый; стиль по возрасту.`,
        ],
        "ui.field.subject.option.robot.label": [`Robot / android`, `Робот`],
        "ui.field.subject.option.robot.prompt": [
          `Robot or android character; metal, panels, glowing accents as fits palette.`,
          `Робот или андроид; металл, панели, свечение в тон палитре.`,
        ],
      }),
    }),
  ],
  meta,
};
