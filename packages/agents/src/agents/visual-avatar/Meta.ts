// cspell:disable
/* jscpd:ignore-start */
import { Meta } from "../../common/Meta";

export const Data = Meta(
  () =>
    ({
      "meta.description": [
        ``,
        `Portrait or character — rich options, then generate`,
        `Портрет или персонаж — детальные настройки`,
      ],
      "meta.title": [``, `Avatar`, `Аватар`],
      "ui.field.background.label": [`🖼️`, `Background`, `Фон`],
      "ui.field.background.option.bokeh.label": [`🌌`, `Blurred scene`, `Боке`],
      "ui.field.background.option.soft_gradient.label": [`🌫️`, `Soft gradient`, `Градиент`],
      "ui.field.background.option.solid_dark.label": [`⬛`, `Solid dark`, `Тёмный`],
      "ui.field.background.option.solid_light.label": [`⬜`, `Solid light`, `Светлый`],
      "ui.field.background.option.studio.label": [`✨`, `Studio`, `Студия`],
      "ui.field.extra.label": [`📝`, `Optional detail`, `Уточнение`],
      "ui.field.extra.placeholder": [``, `Glasses, hat, team name, one trait…`, `Очки, шапка, команда — одна строка…`],
      "ui.field.framing.label": [`📷`, `Framing`, `Кадр`],
      "ui.field.framing.option.bust.label": [`👔`, `Bust`, `Плечи`],
      "ui.field.framing.option.circle.label": [`⬜`, `Avatar circle`, `В круге`],
      "ui.field.framing.option.half.label": [`🧍`, `Half body`, `Пояс`],
      "ui.field.framing.option.headshot.label": [`🎯`, `Headshot`, `Крупный план`],
      "ui.field.lighting.label": [`💡`, `Light`, `Свет`],
      "ui.field.lighting.option.gel.label": [`🌈`, `Color gel`, `Гель`],
      "ui.field.lighting.option.rim.label": [`✨`, `Rim`, `Контур`],
      "ui.field.lighting.option.side.label": [`🌗`, `Side`, `Сбоку`],
      "ui.field.lighting.option.soft_front.label": [`☁️`, `Soft front`, `Спереди`],
      "ui.field.mood.label": [`😶`, `Mood`, `Настроение`],
      "ui.field.mood.option.confident.label": [`😎`, `Confident`, `Уверенное`],
      "ui.field.mood.option.friendly.label": [`😊`, `Friendly`, `Дружелюбное`],
      "ui.field.mood.option.mysterious.label": [`🌙`, `Mysterious`, `Загадочное`],
      "ui.field.mood.option.neutral.label": [`😐`, `Neutral`, `Нейтральное`],
      "ui.field.mood.option.playful.label": [`🎉`, `Playful`, `Живое`],
      "ui.field.mood.option.serene.label": [`😌`, `Serene`, `Спокойное`],
      "ui.field.palette.label": [`🎨`, `Palette`, `Палитра`],
      "ui.field.palette.option.candy.label": [`🍭`, `Candy`, `Candy`],
      "ui.field.palette.option.cool.label": [`🌊`, `Cool`, `Холодная`],
      "ui.field.palette.option.earth.label": [`🌿`, `Earth`, `Земля`],
      "ui.field.palette.option.mono.label": [`⬛`, `Monochrome`, `Моно`],
      "ui.field.palette.option.navy_gold.label": [`🌙`, `Navy & gold`, `Синь+золото`],
      "ui.field.palette.option.neon.label": [`💜`, `Neon`, `Неон`],
      "ui.field.palette.option.pastel.label": [`🌸`, `Pastel`, `Пастель`],
      "ui.field.palette.option.warm.label": [`🌅`, `Warm`, `Тёплая`],
      "ui.field.style.label": [`🖌️`, `Art style`, `Стиль`],
      "ui.field.style.option.3d.label": [`🧊`, `3D render`, `3D`],
      "ui.field.style.option.anime.label": [`🎌`, `Anime`, `Аниме`],
      "ui.field.style.option.flat.label": [`⬜`, `Flat`, `Плоский`],
      "ui.field.style.option.painterly.label": [`🎨`, `Painterly`, `Живопись`],
      "ui.field.style.option.pixel.label": [`🎮`, `Pixel`, `Пиксель`],
      "ui.field.style.option.realistic.label": [`📷`, `Realistic`, `Реализм`],
      "ui.field.subject.label": [`🧬`, `Subject`, `Кто`],
      "ui.field.subject.option.abstract.label": [`◻️`, `Abstract bust`, `Абстракция`],
      "ui.field.subject.option.animal.label": [`🐾`, `Stylized animal`, `Зверь стилиз.`],
      "ui.field.subject.option.fantasy.label": [`🧝`, `Fantasy`, `Фэнтези`],
      "ui.field.subject.option.human_adult.label": [`👤`, `Adult`, `Взрослый`],
      "ui.field.subject.option.human_youth.label": [`🧒`, `Youth`, `Молодой`],
      "ui.field.subject.option.robot.label": [`🤖`, `Robot / android`, `Робот`],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `🧑‍🎨`,
      group: `visual`,
      prompt: `You build image-generation prompts. From the latest user message, the optional one-line detail (if any), and every bullet below, write **one** detailed prompt **for image generation** (it will be sent to the image model). Merge: subject type, mood, framing, art style, **exact palette name from the tabs**, background treatment, lighting implied by choices. If optional detail adds a trait, fold it into the description. End: no watermark; no random text on image unless detail asks for text. Reply with that string only—no other text.`,
      title: i18n(`meta.title`),
      uiPlan: {
        fields: [
          {
            default: `human_adult`,
            id: `subject`,
            kind: `tabs_single`,
            label: i18n(`ui.field.subject.label`),
            options: [
              {
                label: i18n(`ui.field.subject.option.human_adult.label`),
                prompt: `Human adult portrait or upper body; natural proportions.`,
                value: `human_adult`,
              },
              {
                label: i18n(`ui.field.subject.option.human_youth.label`),
                prompt: `Teen or young adult look; age-appropriate styling.`,
                value: `human_youth`,
              },
              {
                label: i18n(`ui.field.subject.option.robot.label`),
                prompt: `Robot or android character; metal, panels, glowing accents as fits palette.`,
                value: `robot`,
              },
              {
                label: i18n(`ui.field.subject.option.animal.label`),
                prompt: `Anthropomorphic or stylized animal character; clear species cues.`,
                value: `animal`,
              },
              {
                label: i18n(`ui.field.subject.option.fantasy.label`),
                prompt: `Fantasy race or costume: elf, knight, mage vibe without copying known IP.`,
                value: `fantasy`,
              },
              {
                label: i18n(`ui.field.subject.option.abstract.label`),
                prompt: `Abstract or geometric interpretation of a head/figure; still reads as avatar.`,
                value: `abstract`,
              },
            ],
          },
          {
            default: `neutral`,
            id: `mood`,
            kind: `tabs_single`,
            label: i18n(`ui.field.mood.label`),
            options: [
              {
                label: i18n(`ui.field.mood.option.neutral.label`),
                prompt: `Neutral, calm expression.`,
                value: `neutral`,
              },
              {
                label: i18n(`ui.field.mood.option.friendly.label`),
                prompt: `Friendly, slight smile, approachable.`,
                value: `friendly`,
              },
              {
                label: i18n(`ui.field.mood.option.confident.label`),
                prompt: `Confident, composed, subtle intensity.`,
                value: `confident`,
              },
              {
                label: i18n(`ui.field.mood.option.mysterious.label`),
                prompt: `Mysterious or dramatic lighting on face; intriguing.`,
                value: `mysterious`,
              },
              {
                label: i18n(`ui.field.mood.option.playful.label`),
                prompt: `Playful, energetic, bright expression.`,
                value: `playful`,
              },
              { label: i18n(`ui.field.mood.option.serene.label`), prompt: `Serene, soft, peaceful.`, value: `serene` },
            ],
          },
          {
            default: `headshot`,
            id: `framing`,
            kind: `tabs_single`,
            label: i18n(`ui.field.framing.label`),
            options: [
              {
                label: i18n(`ui.field.framing.option.headshot.label`),
                prompt: `Tight headshot; face fills most of frame.`,
                value: `headshot`,
              },
              {
                label: i18n(`ui.field.framing.option.bust.label`),
                prompt: `Bust: head and shoulders with some clothing visible.`,
                value: `bust`,
              },
              {
                label: i18n(`ui.field.framing.option.half.label`),
                prompt: `Half body: waist-up composition.`,
                value: `half`,
              },
              {
                label: i18n(`ui.field.framing.option.circle.label`),
                prompt: `Centered subject as if for a circular avatar crop; even padding.`,
                value: `circle`,
              },
            ],
          },
          {
            default: `warm`,
            id: `palette`,
            kind: `tabs_single`,
            label: i18n(`ui.field.palette.label`),
            options: [
              {
                label: i18n(`ui.field.palette.option.warm.label`),
                prompt: `Warm palette: cream, peach, coral, soft gold accents.`,
                value: `warm`,
              },
              {
                label: i18n(`ui.field.palette.option.cool.label`),
                prompt: `Cool palette: teal, blue, icy lavender, silver highlights.`,
                value: `cool`,
              },
              {
                label: i18n(`ui.field.palette.option.mono.label`),
                prompt: `Black, white, and grays only; strong contrast.`,
                value: `mono`,
              },
              {
                label: i18n(`ui.field.palette.option.pastel.label`),
                prompt: `Soft pastels: pink, mint, lilac, light yellow.`,
                value: `pastel`,
              },
              {
                label: i18n(`ui.field.palette.option.neon.label`),
                prompt: `Neon accents on dark base: magenta, cyan, electric purple—controlled glow.`,
                value: `neon`,
              },
              {
                label: i18n(`ui.field.palette.option.earth.label`),
                prompt: `Earth tones: olive, terracotta, sand, deep brown.`,
                value: `earth`,
              },
              {
                label: i18n(`ui.field.palette.option.navy_gold.label`),
                prompt: `Navy blue with gold accents; premium feel.`,
                value: `navy_gold`,
              },
              {
                label: i18n(`ui.field.palette.option.candy.label`),
                prompt: `Candy bright: saturated pinks, blues, greens—still harmonious.`,
                value: `candy`,
              },
            ],
          },
          {
            default: `soft_gradient`,
            id: `background`,
            kind: `tabs_single`,
            label: i18n(`ui.field.background.label`),
            options: [
              {
                label: i18n(`ui.field.background.option.soft_gradient.label`),
                prompt: `Soft gradient background matching the palette; no busy detail.`,
                value: `soft_gradient`,
              },
              {
                label: i18n(`ui.field.background.option.solid_light.label`),
                prompt: `Solid light neutral background.`,
                value: `solid_light`,
              },
              {
                label: i18n(`ui.field.background.option.solid_dark.label`),
                prompt: `Solid dark background; subject pops forward.`,
                value: `solid_dark`,
              },
              {
                label: i18n(`ui.field.background.option.studio.label`),
                prompt: `Studio-style softbox lighting; subtle gray backdrop.`,
                value: `studio`,
              },
              {
                label: i18n(`ui.field.background.option.bokeh.label`),
                prompt: `Blurred bokeh background; colors harmonize with palette.`,
                value: `bokeh`,
              },
            ],
          },
          {
            default: `flat`,
            id: `style`,
            kind: `tabs_single`,
            label: i18n(`ui.field.style.label`),
            options: [
              {
                label: i18n(`ui.field.style.option.flat.label`),
                prompt: `Flat illustration: clean shapes, limited shading.`,
                value: `flat`,
              },
              {
                label: i18n(`ui.field.style.option.realistic.label`),
                prompt: `Realistic or photographic skin and light.`,
                value: `realistic`,
              },
              {
                label: i18n(`ui.field.style.option.anime.label`),
                prompt: `Anime/manga: line art, cel or soft shading.`,
                value: `anime`,
              },
              {
                label: i18n(`ui.field.style.option.pixel.label`),
                prompt: `Pixel art avatar; readable at low resolution.`,
                value: `pixel`,
              },
              {
                label: i18n(`ui.field.style.option.painterly.label`),
                prompt: `Painterly digital brush strokes; textured.`,
                value: `painterly`,
              },
              {
                label: i18n(`ui.field.style.option.3d.label`),
                prompt: `3D render look: smooth materials, subtle global illumination.`,
                value: `3d`,
              },
            ],
          },
          {
            default: `soft_front`,
            id: `lighting`,
            kind: `tabs_single`,
            label: i18n(`ui.field.lighting.label`),
            options: [
              {
                label: i18n(`ui.field.lighting.option.soft_front.label`),
                prompt: `Soft frontal key light; even, flattering.`,
                value: `soft_front`,
              },
              {
                label: i18n(`ui.field.lighting.option.side.label`),
                prompt: `Side light: defined cheek shadows; more cinematic.`,
                value: `side`,
              },
              {
                label: i18n(`ui.field.lighting.option.rim.label`),
                prompt: `Rim light separating subject from background.`,
                value: `rim`,
              },
              {
                label: i18n(`ui.field.lighting.option.gel.label`),
                prompt: `Subtle colored gel lights matching palette.`,
                value: `gel`,
              },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: i18n(`ui.field.extra.label`),
            placeholder: i18n(`ui.field.extra.placeholder`),
            prompt: `Optional detail (one line — hair, accessory, team, etc.):`,
          },
        ],
      },
    }) as const,
);
/* jscpd:ignore-end */
