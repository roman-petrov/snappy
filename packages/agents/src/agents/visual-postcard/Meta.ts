// cspell:disable
/* jscpd:ignore-start */
import { StaticAgentMeta } from "../../common/static-agent";

export const Data = StaticAgentMeta(
  () =>
    ({
      "meta.description": [``, `Greeting card front — rich art options`, `Открытка — много вариантов оформления`],
      "meta.title": [``, `Postcard`, `Открытка`],
      "ui.field.decoration.label": [`🎀`, `Ornament`, `Орнамент`],
      "ui.field.decoration.option.minimal.label": [`◻️`, `Minimal`, `Минимум`],
      "ui.field.decoration.option.rich.label": [`✨`, `Rich`, `Богато`],
      "ui.field.decoration.option.subtle.label": [`〰️`, `Subtle`, `Лёгкий`],
      "ui.field.extra.label": [`📝`, `Optional motif`, `Доп. мотив`],
      "ui.field.extra.placeholder": [
        ``,
        `e.g. cats, bicycles, seaside — one line…`,
        `Коты, велосипед, море — одна строка…`,
      ],
      "ui.field.layout.label": [`📐`, `Layout`, `Формат`],
      "ui.field.layout.option.centered.label": [`⬜`, `Centered icon`, `Центр`],
      "ui.field.layout.option.fullbleed.label": [`🖼️`, `Full bleed`, `В край`],
      "ui.field.layout.option.landscape.label": [`🖼️`, `Landscape`, `Альбомная`],
      "ui.field.layout.option.portrait.label": [`📄`, `Portrait`, `Книжная`],
      "ui.field.mood.label": [`✨`, `Mood`, `Настроение`],
      "ui.field.mood.option.calm.label": [`🕊️`, `Calm`, `Спокойное`],
      "ui.field.mood.option.cheerful.label": [`😊`, `Cheerful`, `Радостное`],
      "ui.field.mood.option.dreamy.label": [`💫`, `Dreamy`, `Мечтательное`],
      "ui.field.mood.option.elegant.label": [`🎩`, `Elegant`, `Элегантное`],
      "ui.field.mood.option.festive.label": [`🎉`, `Festive`, `Праздничное`],
      "ui.field.occasion.label": [`🎂`, `Occasion`, `Повод`],
      "ui.field.occasion.option.baby.label": [`👶`, `Baby`, `Малыш`],
      "ui.field.occasion.option.birthday.label": [`🎂`, `Birthday`, `День рождения`],
      "ui.field.occasion.option.congrats.label": [`💪`, `Congrats`, `Поздравление`],
      "ui.field.occasion.option.graduation.label": [`🎓`, `Scholar`, `Учёба`],
      "ui.field.occasion.option.love.label": [`💕`, `Love`, `Любовь`],
      "ui.field.occasion.option.party.label": [`🎊`, `Party`, `Праздник`],
      "ui.field.occasion.option.sympathy.label": [`🌷`, `Sympathy`, `Соболезнование`],
      "ui.field.occasion.option.thanks.label": [`💐`, `Thanks`, `Спасибо`],
      "ui.field.occasion.option.winter.label": [`🎄`, `Winter`, `Зима`],
      "ui.field.palette.label": [`🎨`, `Palette`, `Палитра`],
      "ui.field.palette.option.candy.label": [`🍭`, `Candy`, `Яркая`],
      "ui.field.palette.option.cool_blue.label": [`🌊`, `Cool blue`, `Холодная`],
      "ui.field.palette.option.elegant_dark.label": [`⬛`, `Elegant dark`, `Тёмная элегант`],
      "ui.field.palette.option.minimal_white.label": [`🤍`, `Minimal white`, `Минимум белого`],
      "ui.field.palette.option.natural.label": [`🌿`, `Natural`, `Натуральная`],
      "ui.field.palette.option.pastel.label": [`🌸`, `Pastel`, `Пастель`],
      "ui.field.palette.option.red_gold.label": [`❤️`, `Red & gold`, `Красное и золото`],
      "ui.field.palette.option.sunset.label": [`🌅`, `Warm sunset`, `Закат`],
      "ui.field.style.label": [`🖌️`, `Art style`, `Стиль`],
      "ui.field.style.option.flat.label": [`✨`, `Flat`, `Плоский`],
      "ui.field.style.option.illustration.label": [`✏️`, `Illustration`, `Иллюстрация`],
      "ui.field.style.option.papercraft.label": [`✨`, `Paper craft`, `Бумага`],
      "ui.field.style.option.photo.label": [`📷`, `Photo collage`, `Фото-коллаж`],
      "ui.field.style.option.watercolor.label": [`🌸`, `Watercolor`, `Акварель`],
      "ui.field.text_on_card.label": [`🔤`, `Text on art`, `Текст`],
      "ui.field.text_on_card.option.fixed_phrase.label": [`🙏`, `Thanks / Congrats`, `Thanks / Congrats`],
      "ui.field.text_on_card.option.generic.label": [`✨`, `Short generic`, `Коротко`],
      "ui.field.text_on_card.option.none.label": [`🚫`, `No text`, `Без текста`],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `💌`,
      group: `visual`,
      plan: {
        fields: [
          {
            default: `birthday`,
            id: `occasion`,
            kind: `tabs_single`,
            label: i18n(`ui.field.occasion.label`),
            options: [
              {
                label: i18n(`ui.field.occasion.option.birthday.label`),
                prompt: `Birthday theme: cake, candles, balloons, or abstract festive motifs.`,
                value: `birthday`,
              },
              {
                label: i18n(`ui.field.occasion.option.thanks.label`),
                prompt: `Gratitude theme: flowers, hearts, gentle light.`,
                value: `thanks`,
              },
              {
                label: i18n(`ui.field.occasion.option.winter.label`),
                prompt: `Winter holidays: snow, stars, ornaments—non-denominational unless user implies otherwise.`,
                value: `winter`,
              },
              {
                label: i18n(`ui.field.occasion.option.congrats.label`),
                prompt: `Congratulations: success, trophy, stars, upward motion.`,
                value: `congrats`,
              },
              {
                label: i18n(`ui.field.occasion.option.love.label`),
                prompt: `Love or anniversary: romantic but tasteful symbols.`,
                value: `love`,
              },
              {
                label: i18n(`ui.field.occasion.option.graduation.label`),
                prompt: `Graduation or achievement: cap, diploma motifs.`,
                value: `graduation`,
              },
              {
                label: i18n(`ui.field.occasion.option.baby.label`),
                prompt: `New baby: soft toys, moon, pastel joy.`,
                value: `baby`,
              },
              {
                label: i18n(`ui.field.occasion.option.sympathy.label`),
                prompt: `Condolence: subdued palette, lilies or candle, respectful.`,
                value: `sympathy`,
              },
              {
                label: i18n(`ui.field.occasion.option.party.label`),
                prompt: `Generic celebration: confetti, streamers, festive abstract.`,
                value: `party`,
              },
            ],
          },
          {
            default: `pastel`,
            id: `palette`,
            kind: `tabs_single`,
            label: i18n(`ui.field.palette.label`),
            options: [
              {
                label: i18n(`ui.field.palette.option.pastel.label`),
                prompt: `Soft pastels: blush, mint, butter, sky blue.`,
                value: `pastel`,
              },
              {
                label: i18n(`ui.field.palette.option.red_gold.label`),
                prompt: `Red and gold accents; festive premium.`,
                value: `red_gold`,
              },
              {
                label: i18n(`ui.field.palette.option.cool_blue.label`),
                prompt: `Cool blues and white; crisp and calm.`,
                value: `cool_blue`,
              },
              {
                label: i18n(`ui.field.palette.option.sunset.label`),
                prompt: `Warm orange, coral, magenta gradients.`,
                value: `sunset`,
              },
              {
                label: i18n(`ui.field.palette.option.natural.label`),
                prompt: `Greens, browns, cream; organic hand-made feel.`,
                value: `natural`,
              },
              {
                label: i18n(`ui.field.palette.option.elegant_dark.label`),
                prompt: `Dark navy or charcoal with gold or silver foil accents.`,
                value: `elegant_dark`,
              },
              {
                label: i18n(`ui.field.palette.option.candy.label`),
                prompt: `Bright candy colors; playful balance.`,
                value: `candy`,
              },
              {
                label: i18n(`ui.field.palette.option.minimal_white.label`),
                prompt: `Mostly white with one accent color; lots of whitespace.`,
                value: `minimal_white`,
              },
            ],
          },
          {
            default: `cheerful`,
            id: `mood`,
            kind: `tabs_single`,
            label: i18n(`ui.field.mood.label`),
            options: [
              {
                label: i18n(`ui.field.mood.option.cheerful.label`),
                prompt: `Bright, upbeat, inviting.`,
                value: `cheerful`,
              },
              {
                label: i18n(`ui.field.mood.option.elegant.label`),
                prompt: `Elegant, refined, restrained detail.`,
                value: `elegant`,
              },
              {
                label: i18n(`ui.field.mood.option.calm.label`),
                prompt: `Calm, soft, peaceful atmosphere.`,
                value: `calm`,
              },
              {
                label: i18n(`ui.field.mood.option.festive.label`),
                prompt: `High energy festive; bold shapes.`,
                value: `festive`,
              },
              {
                label: i18n(`ui.field.mood.option.dreamy.label`),
                prompt: `Dreamy soft focus, sparkles, gentle glow.`,
                value: `dreamy`,
              },
            ],
          },
          {
            default: `portrait`,
            id: `layout`,
            kind: `tabs_single`,
            label: i18n(`ui.field.layout.label`),
            options: [
              {
                label: i18n(`ui.field.layout.option.portrait.label`),
                prompt: `Vertical greeting card composition.`,
                value: `portrait`,
              },
              {
                label: i18n(`ui.field.layout.option.landscape.label`),
                prompt: `Horizontal greeting card composition.`,
                value: `landscape`,
              },
              {
                label: i18n(`ui.field.layout.option.centered.label`),
                prompt: `Strong centered focal illustration with even margins.`,
                value: `centered`,
              },
              {
                label: i18n(`ui.field.layout.option.fullbleed.label`),
                prompt: `Full-bleed art edge to edge; motif extends to borders.`,
                value: `fullbleed`,
              },
            ],
          },
          {
            default: `illustration`,
            id: `style`,
            kind: `tabs_single`,
            label: i18n(`ui.field.style.label`),
            options: [
              {
                label: i18n(`ui.field.style.option.illustration.label`),
                prompt: `Hand-drawn or digital illustration; friendly lines.`,
                value: `illustration`,
              },
              {
                label: i18n(`ui.field.style.option.flat.label`),
                prompt: `Modern flat vector look; bold shapes.`,
                value: `flat`,
              },
              {
                label: i18n(`ui.field.style.option.watercolor.label`),
                prompt: `Watercolor wash and paper texture.`,
                value: `watercolor`,
              },
              {
                label: i18n(`ui.field.style.option.photo.label`),
                prompt: `Photographic collage look—still a single cohesive card front.`,
                value: `photo`,
              },
              {
                label: i18n(`ui.field.style.option.papercraft.label`),
                prompt: `Layered paper-cut or papercraft shadow depth.`,
                value: `papercraft`,
              },
            ],
          },
          {
            default: `medium`,
            id: `decoration`,
            kind: `tabs_single`,
            label: i18n(`ui.field.decoration.label`),
            options: [
              {
                label: i18n(`ui.field.decoration.option.minimal.label`),
                prompt: `Minimal ornament; one focal motif.`,
                value: `minimal`,
              },
              {
                label: i18n(`ui.field.decoration.option.subtle.label`),
                prompt: `Subtle border or corner flourishes.`,
                value: `subtle`,
              },
              {
                label: i18n(`ui.field.decoration.option.rich.label`),
                prompt: `Rich pattern: frames, botanicals, or geometric ornament.`,
                value: `rich`,
              },
            ],
          },
          {
            default: `none`,
            id: `text_on_card`,
            kind: `tabs_single`,
            label: i18n(`ui.field.text_on_card.label`),
            options: [
              {
                label: i18n(`ui.field.text_on_card.option.none.label`),
                prompt: `Image only—no letters or words in the picture.`,
                value: `none`,
              },
              {
                label: i18n(`ui.field.text_on_card.option.generic.label`),
                prompt: `Short generic phrase only if it fits the occasion (e.g. Happy Birthday)—clean typography matching style.`,
                value: `generic`,
              },
              {
                label: i18n(`ui.field.text_on_card.option.fixed_phrase.label`),
                prompt: `Include either “Thank you” or “Congratulations” in elegant type—pick which matches occasion better.`,
                value: `fixed_phrase`,
              },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: i18n(`ui.field.extra.label`),
            placeholder: i18n(`ui.field.extra.placeholder`),
            prompt: `Optional motif or symbol to weave in (one line):`,
          },
        ],
      },
      prompt: `You build image-generation prompts. From every bullet below, write **one** detailed prompt **for image generation**: a **greeting-card front illustration** (not a photo of a printed card unless asked). It will be sent to the image model. Apply: occasion, mood, layout, art style, **palette from tabs**, decoration level, and text-on-card rule. Describe composition, focal motif, and border. End: no watermark. Reply with that string only—no other text.`,
      title: i18n(`meta.title`),
    }) as const,
);
/* jscpd:ignore-end */
