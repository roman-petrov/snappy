// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = () =>
  ({
    en: {
      emoji: `🧑‍🎨`,
      labels: { description: `Portrait or character — rich options, then generate`, title: `Avatar` },
      prompt: `You build image-generation prompts. From the latest user message, the optional one-line detail (if any), and every bullet below, write **one** detailed prompt **for image generation** (it will be sent to the image model). Merge: subject type, mood, framing, art style, **exact palette name from the tabs**, background treatment, lighting implied by choices. If optional detail adds a trait, fold it into the description. End: no watermark; no random text on image unless detail asks for text. Reply with that string only—no other text.`,
      uiPlan: {
        fields: [
          {
            default: `human_adult`,
            id: `subject`,
            kind: `tabs_single`,
            label: `🧬 Subject`,
            options: [
              {
                label: `👤 Adult`,
                prompt: `Human adult portrait or upper body; natural proportions.`,
                value: `human_adult`,
              },
              { label: `🧒 Youth`, prompt: `Teen or young adult look; age-appropriate styling.`, value: `human_youth` },
              {
                label: `🤖 Robot / android`,
                prompt: `Robot or android character; metal, panels, glowing accents as fits palette.`,
                value: `robot`,
              },
              {
                label: `🐾 Stylized animal`,
                prompt: `Anthropomorphic or stylized animal character; clear species cues.`,
                value: `animal`,
              },
              {
                label: `🧝 Fantasy`,
                prompt: `Fantasy race or costume: elf, knight, mage vibe without copying known IP.`,
                value: `fantasy`,
              },
              {
                label: `◻️ Abstract bust`,
                prompt: `Abstract or geometric interpretation of a head/figure; still reads as avatar.`,
                value: `abstract`,
              },
            ],
          },
          {
            default: `neutral`,
            id: `mood`,
            kind: `tabs_single`,
            label: `😶 Mood`,
            options: [
              { label: `😐 Neutral`, prompt: `Neutral, calm expression.`, value: `neutral` },
              { label: `😊 Friendly`, prompt: `Friendly, slight smile, approachable.`, value: `friendly` },
              { label: `😎 Confident`, prompt: `Confident, composed, subtle intensity.`, value: `confident` },
              {
                label: `🌙 Mysterious`,
                prompt: `Mysterious or dramatic lighting on face; intriguing.`,
                value: `mysterious`,
              },
              { label: `🎉 Playful`, prompt: `Playful, energetic, bright expression.`, value: `playful` },
              { label: `😌 Serene`, prompt: `Serene, soft, peaceful.`, value: `serene` },
            ],
          },
          {
            default: `headshot`,
            id: `framing`,
            kind: `tabs_single`,
            label: `📷 Framing`,
            options: [
              { label: `🎯 Headshot`, prompt: `Tight headshot; face fills most of frame.`, value: `headshot` },
              { label: `👔 Bust`, prompt: `Bust: head and shoulders with some clothing visible.`, value: `bust` },
              { label: `🧍 Half body`, prompt: `Half body: waist-up composition.`, value: `half` },
              {
                label: `⬜ Avatar circle`,
                prompt: `Centered subject as if for a circular avatar crop; even padding.`,
                value: `circle`,
              },
            ],
          },
          {
            default: `warm`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Palette`,
            options: [
              { label: `🌅 Warm`, prompt: `Warm palette: cream, peach, coral, soft gold accents.`, value: `warm` },
              { label: `🌊 Cool`, prompt: `Cool palette: teal, blue, icy lavender, silver highlights.`, value: `cool` },
              { label: `⬛ Monochrome`, prompt: `Black, white, and grays only; strong contrast.`, value: `mono` },
              { label: `🌸 Pastel`, prompt: `Soft pastels: pink, mint, lilac, light yellow.`, value: `pastel` },
              {
                label: `💜 Neon`,
                prompt: `Neon accents on dark base: magenta, cyan, electric purple—controlled glow.`,
                value: `neon`,
              },
              { label: `🌿 Earth`, prompt: `Earth tones: olive, terracotta, sand, deep brown.`, value: `earth` },
              { label: `🌙 Navy & gold`, prompt: `Navy blue with gold accents; premium feel.`, value: `navy_gold` },
              {
                label: `🍭 Candy`,
                prompt: `Candy bright: saturated pinks, blues, greens—still harmonious.`,
                value: `candy`,
              },
            ],
          },
          {
            default: `soft_gradient`,
            id: `background`,
            kind: `tabs_single`,
            label: `🖼️ Background`,
            options: [
              {
                label: `🌫️ Soft gradient`,
                prompt: `Soft gradient background matching the palette; no busy detail.`,
                value: `soft_gradient`,
              },
              { label: `⬜ Solid light`, prompt: `Solid light neutral background.`, value: `solid_light` },
              { label: `⬛ Solid dark`, prompt: `Solid dark background; subject pops forward.`, value: `solid_dark` },
              { label: `✨ Studio`, prompt: `Studio-style softbox lighting; subtle gray backdrop.`, value: `studio` },
              {
                label: `🌌 Blurred scene`,
                prompt: `Blurred bokeh background; colors harmonize with palette.`,
                value: `bokeh`,
              },
            ],
          },
          {
            default: `flat`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Art style`,
            options: [
              { label: `⬜ Flat`, prompt: `Flat illustration: clean shapes, limited shading.`, value: `flat` },
              { label: `📷 Realistic`, prompt: `Realistic or photographic skin and light.`, value: `realistic` },
              { label: `🎌 Anime`, prompt: `Anime/manga: line art, cel or soft shading.`, value: `anime` },
              { label: `🎮 Pixel`, prompt: `Pixel art avatar; readable at low resolution.`, value: `pixel` },
              { label: `🎨 Painterly`, prompt: `Painterly digital brush strokes; textured.`, value: `painterly` },
              {
                label: `🧊 3D render`,
                prompt: `3D render look: smooth materials, subtle global illumination.`,
                value: `3d`,
              },
            ],
          },
          {
            default: `soft_front`,
            id: `lighting`,
            kind: `tabs_single`,
            label: `💡 Light`,
            options: [
              { label: `☁️ Soft front`, prompt: `Soft frontal key light; even, flattering.`, value: `soft_front` },
              { label: `🌗 Side`, prompt: `Side light: defined cheek shadows; more cinematic.`, value: `side` },
              { label: `✨ Rim`, prompt: `Rim light separating subject from background.`, value: `rim` },
              { label: `🌈 Color gel`, prompt: `Subtle colored gel lights matching palette.`, value: `gel` },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: `📝 Optional detail`,
            placeholder: `Glasses, hat, team name, one trait…`,
            prompt: `Optional detail (one line — hair, accessory, team, etc.):`,
          },
        ],
        title: `🧑‍🎨 Avatar`,
      },
    },
    group: `visual`,
    ru: {
      emoji: `🖼️`,
      labels: { description: `Портрет или персонаж — детальные настройки`, title: `Аватар` },
      prompt: `Ты составляешь промпты для генерации. По сообщению, опциональной строке уточнения и каждому пункту ниже напиши **один** подробный промпт **для генерации изображения** (его получит модель картинки). Собери тип субъекта, настроение, кадр, стиль, **именно выбранную палитру из табов**, фон, свет. Уточнение в одну строку — вписать в образ. В конце: без водяных знаков; без лишнего текста на картинке. Верни только эту строку — без другого текста.`,
      uiPlan: {
        fields: [
          {
            default: `human_adult`,
            id: `subject`,
            kind: `tabs_single`,
            label: `🧬 Кто`,
            options: [
              {
                label: `👤 Взрослый`,
                prompt: `Взрослый человек: портрет или верх тела; естественные пропорции.`,
                value: `human_adult`,
              },
              {
                label: `🧒 Молодой`,
                prompt: `Подросток или молодой человек; возраст по смыслу.`,
                value: `human_youth`,
              },
              {
                label: `🤖 Робот`,
                prompt: `Робот или андроид; панели, металл, акценты в цветах палитры.`,
                value: `robot`,
              },
              {
                label: `🐾 Зверь стилиз.`,
                prompt: `Стилизованный зверь или антропоморф; узнаваемый вид.`,
                value: `animal`,
              },
              {
                label: `🧝 Фэнтези`,
                prompt: `Фэнтези-образ: эльф, рыцарь, маг — без копирования чужих IP.`,
                value: `fantasy`,
              },
              {
                label: `◻️ Абстракция`,
                prompt: `Абстрактный или геометрический «портрет»; читается как аватар.`,
                value: `abstract`,
              },
            ],
          },
          {
            default: `neutral`,
            id: `mood`,
            kind: `tabs_single`,
            label: `😶 Настроение`,
            options: [
              { label: `😐 Нейтральное`, prompt: `Спокойное нейтральное выражение.`, value: `neutral` },
              { label: `😊 Дружелюбное`, prompt: `Дружелюбное, лёгкая улыбка.`, value: `friendly` },
              { label: `😎 Уверенное`, prompt: `Уверенный взгляд, собранность.`, value: `confident` },
              { label: `🌙 Загадочное`, prompt: `Драматичный свет, интрига.`, value: `mysterious` },
              { label: `🎉 Живое`, prompt: `Игривое, энергичное выражение.`, value: `playful` },
              { label: `😌 Спокойное`, prompt: `Мягкое, умиротворённое.`, value: `serene` },
            ],
          },
          {
            default: `headshot`,
            id: `framing`,
            kind: `tabs_single`,
            label: `📷 Кадр`,
            options: [
              { label: `🎯 Крупный план`, prompt: `Крупный план лица.`, value: `headshot` },
              { label: `👔 Плечи`, prompt: `Голова и плечи, видна одежда.`, value: `bust` },
              { label: `🧍 Пояс`, prompt: `По пояс.`, value: `half` },
              { label: `⬜ В круге`, prompt: `Центрировать как для круглого аватара; поля ровные.`, value: `circle` },
            ],
          },
          {
            default: `warm`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Палитра`,
            options: [
              { label: `🌅 Тёплая`, prompt: `Тёплая палитра: крем, персик, коралл, мягкое золото.`, value: `warm` },
              { label: `🌊 Холодная`, prompt: `Холодная: бирюза, синий, лаванда, серебро.`, value: `cool` },
              { label: `⬛ Моно`, prompt: `Чёрно-бело-серый; контраст.`, value: `mono` },
              { label: `🌸 Пастель`, prompt: `Пастель: роза, мята, сирень, лимон.`, value: `pastel` },
              { label: `💜 Неон`, prompt: `Неон на тёмном фоне: пурпур, циан, электрик — без каши.`, value: `neon` },
              { label: `🌿 Земля`, prompt: `Земляные: олива, терракота, песок, шоколад.`, value: `earth` },
              { label: `🌙 Синь+золото`, prompt: `Тёмно-синий с золотом.`, value: `navy_gold` },
              { label: `🍭 Candy`, prompt: `Яркие насыщенные цвета в гармонии.`, value: `candy` },
            ],
          },
          {
            default: `soft_gradient`,
            id: `background`,
            kind: `tabs_single`,
            label: `🖼️ Фон`,
            options: [
              { label: `🌫️ Градиент`, prompt: `Мягкий градиент в тон палитры; без шума.`, value: `soft_gradient` },
              { label: `⬜ Светлый`, prompt: `Ровный светлый фон.`, value: `solid_light` },
              { label: `⬛ Тёмный`, prompt: `Ровный тёмный фон; объект выделяется.`, value: `solid_dark` },
              { label: `✨ Студия`, prompt: `Студийный свет; серый фон.`, value: `studio` },
              { label: `🌌 Боке`, prompt: `Размытый фон-боке в цветах палитры.`, value: `bokeh` },
            ],
          },
          {
            default: `flat`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Стиль`,
            options: [
              { label: `⬜ Плоский`, prompt: `Плоская иллюстрация, чистые формы.`, value: `flat` },
              { label: `📷 Реализм`, prompt: `Реалистичная или фотореалистичная подача.`, value: `realistic` },
              { label: `🎌 Аниме`, prompt: `Аниме/манга.`, value: `anime` },
              { label: `🎮 Пиксель`, prompt: `Пиксель-арт; читается в мелком размере.`, value: `pixel` },
              { label: `🎨 Живопись`, prompt: `Живописные мазки, текстура.`, value: `painterly` },
              { label: `🧊 3D`, prompt: `Вид 3D-рендера: материалы, мягкий GI.`, value: `3d` },
            ],
          },
          {
            default: `soft_front`,
            id: `lighting`,
            kind: `tabs_single`,
            label: `💡 Свет`,
            options: [
              { label: `☁️ Спереди`, prompt: `Мягкий фронтальный свет; лицо ровно.`, value: `soft_front` },
              { label: `🌗 Сбоку`, prompt: `Боковой свет; тени на щеках.`, value: `side` },
              { label: `✨ Контур`, prompt: `Контурный свет по контуру.`, value: `rim` },
              { label: `🌈 Гель`, prompt: `Лёгкий цветной гель в тон палитры.`, value: `gel` },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: `📝 Уточнение`,
            placeholder: `Очки, шапка, команда — одна строка…`,
            prompt: `Уточнение (одна строка — волосы, аксессуар, команда и т.д.):`,
          },
        ],
        title: `🖼️ Аватар`,
      },
    },
  }) as const;
/* jscpd:ignore-end */
