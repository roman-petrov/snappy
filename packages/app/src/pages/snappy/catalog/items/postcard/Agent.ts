import { Prompts } from "../../shared";
// cspell:disable
import { StaticVisualAgent } from "../../static-agent";

export const Agent = StaticVisualAgent(
  () =>
    ({
      "meta.description": [`Greeting card front — rich art options`, `Открытка — много вариантов оформления`],
      "meta.prompt": Prompts.visual.joinMeta([
        `You build image-generation prompts. From every bullet below, write **one** detailed prompt **for image generation**: a **greeting-card front illustration** (not a photo of a printed card unless asked). It will be sent to the image model. Apply: occasion, mood, layout, art style, **palette from tabs**, decoration level, and text-on-card rule. Describe composition, focal motif, and border.`,
        `Собери **один** промпт для **иллюстрации лицевой стороны открытки** (не фото готовой открытки, если не просили). Учти: повод, настроение, формат, стиль, **палитру по вкладкам**, орнамент, правило текста на картинке. Опиши композицию, мотив, кайму.`,
      ]),
      "meta.title": [`Postcard`, `Открытка`],
      "ui.field.decoration.label": [`Ornament`, `Орнамент`],
      "ui.field.decoration.option.minimal.label": [`Minimal`, `Минимум`],
      "ui.field.decoration.option.minimal.prompt": [
        `Minimal ornament; one focal motif.`,
        `Минимум украшений; один главный мотив.`,
      ],
      "ui.field.decoration.option.rich.label": [`Rich`, `Богато`],
      "ui.field.decoration.option.rich.prompt": [
        `Rich pattern: frames, botanicals, or geometric ornament.`,
        `Богатый орнамент: рамки, ботаника или геометрия.`,
      ],
      "ui.field.decoration.option.subtle.label": [`Subtle`, `Лёгкий`],
      "ui.field.decoration.option.subtle.prompt": [`Subtle border or corner flourishes.`, `Лёгкая кайма или уголки.`],
      "ui.field.extra.label": [`Optional motif`, `Доп. мотив`],
      "ui.field.extra.placeholder": [
        `e.g. cats, bicycles, seaside — one line…`,
        `Коты, велосипед, море — одна строка…`,
      ],
      "ui.field.extra.prompt": [
        `Optional motif or symbol to weave in (one line):`,
        `Необязательный мотив или символ (одна строка):`,
      ],
      "ui.field.layout.label": [`Layout`, `Формат`],
      "ui.field.layout.option.centered.label": [`Centered icon`, `Центр`],
      "ui.field.layout.option.centered.prompt": [
        `Strong centered focal illustration with even margins.`,
        `Сильный центр, ровные поля.`,
      ],
      "ui.field.layout.option.fullbleed.label": [`Full bleed`, `В край`],
      "ui.field.layout.option.fullbleed.prompt": [
        `Full-bleed art edge to edge; motif extends to borders.`,
        `В край: мотив до краёв.`,
      ],
      "ui.field.layout.option.landscape.label": [`Landscape`, `Альбомная`],
      "ui.field.layout.option.landscape.prompt": [
        `Horizontal greeting card composition.`,
        `Горизонтальная композиция открытки.`,
      ],
      "ui.field.layout.option.portrait.label": [`Portrait`, `Книжная`],
      "ui.field.layout.option.portrait.prompt": [
        `Vertical greeting card composition.`,
        `Вертикальная композиция открытки.`,
      ],
      "ui.field.mood.label": [`Mood`, `Настроение`],
      "ui.field.mood.option.calm.label": [`Calm`, `Спокойное`],
      "ui.field.mood.option.calm.prompt": [`Calm, soft, peaceful atmosphere.`, `Спокойная мягкая атмосфера.`],
      "ui.field.mood.option.cheerful.label": [`Cheerful`, `Радостное`],
      "ui.field.mood.option.cheerful.prompt": [`Bright, upbeat, inviting.`, `Светло, бодро, приветливо.`],
      "ui.field.mood.option.dreamy.label": [`Dreamy`, `Мечтательное`],
      "ui.field.mood.option.dreamy.prompt": [
        `Dreamy soft focus, sparkles, gentle glow.`,
        `Мечтательно: мягкий фокус, искры, лёгкое свечение.`,
      ],
      "ui.field.mood.option.elegant.label": [`Elegant`, `Элегантное`],
      "ui.field.mood.option.elegant.prompt": [
        `Elegant, refined, restrained detail.`,
        `Элегантно, сдержанно, выверенно.`,
      ],
      "ui.field.mood.option.festive.label": [`Festive`, `Праздничное`],
      "ui.field.mood.option.festive.prompt": [
        `High energy festive; bold shapes.`,
        `Праздничная энергия; смелые формы.`,
      ],
      "ui.field.occasion.label": [`Occasion`, `Повод`],
      "ui.field.occasion.option.baby.label": [`Baby`, `Малыш`],
      "ui.field.occasion.option.baby.prompt": [
        `New baby: soft toys, moon, pastel joy.`,
        `Новорождённый: мягкие игрушки, луна, пастельная радость.`,
      ],
      "ui.field.occasion.option.birthday.label": [`Birthday`, `День рождения`],
      "ui.field.occasion.option.birthday.prompt": [
        `Birthday theme: cake, candles, balloons, or abstract festive motifs.`,
        `День рождения: торт, свечи, шары или абстрактный праздник.`,
      ],
      "ui.field.occasion.option.congrats.label": [`Congrats`, `Поздравление`],
      "ui.field.occasion.option.congrats.prompt": [
        `Congratulations: success, trophy, stars, upward motion.`,
        `Поздравление с успехом: кубок, звёзды, движение вверх.`,
      ],
      "ui.field.occasion.option.graduation.label": [`Scholar`, `Учёба`],
      "ui.field.occasion.option.graduation.prompt": [
        `Graduation or achievement: cap, diploma motifs.`,
        `Выпуск или достижение: шапочка, диплом.`,
      ],
      "ui.field.occasion.option.love.label": [`Love`, `Любовь`],
      "ui.field.occasion.option.love.prompt": [
        `Love or anniversary: romantic but tasteful symbols.`,
        `Любовь или годовщина: романтично и со вкусом.`,
      ],
      "ui.field.occasion.option.party.label": [`Party`, `Праздник`],
      "ui.field.occasion.option.party.prompt": [
        `Generic celebration: confetti, streamers, festive abstract.`,
        `Общий праздник: конфетти, ленты, абстракция.`,
      ],
      "ui.field.occasion.option.sympathy.label": [`Sympathy`, `Соболезнование`],
      "ui.field.occasion.option.sympathy.prompt": [
        `Condolence: subdued palette, lilies or candle, respectful.`,
        `Соболезнование: сдержанная палитра, лилии или свеча, уважение.`,
      ],
      "ui.field.occasion.option.thanks.label": [`Thanks`, `Спасибо`],
      "ui.field.occasion.option.thanks.prompt": [
        `Gratitude theme: flowers, hearts, gentle light.`,
        `Благодарность: цветы, сердца, мягкий свет.`,
      ],
      "ui.field.occasion.option.winter.label": [`Winter`, `Зима`],
      "ui.field.occasion.option.winter.prompt": [
        `Winter holidays: snow, stars, ornaments—non-denominational unless user implies otherwise.`,
        `Зимние праздники: снег, звёзды, украшения — нейтрально, если пользователь не указал иначе.`,
      ],
      "ui.field.palette.label": [`Palette`, `Палитра`],
      "ui.field.palette.option.candy.label": [`Candy`, `Яркая`],
      "ui.field.palette.option.candy.prompt": [
        `Bright candy colors; playful balance.`,
        `Яркие «конфетные» цвета; игривый баланс.`,
      ],
      "ui.field.palette.option.cool_blue.label": [`Cool blue`, `Холодная`],
      "ui.field.palette.option.cool_blue.prompt": [
        `Cool blues and white; crisp and calm.`,
        `Холодный синий и белый; свежо и спокойно.`,
      ],
      "ui.field.palette.option.elegant_dark.label": [`Elegant dark`, `Тёмная элегант`],
      "ui.field.palette.option.elegant_dark.prompt": [
        `Dark navy or charcoal with gold or silver foil accents.`,
        `Тёмно-синий или уголь с золотой или серебряной фольгой.`,
      ],
      "ui.field.palette.option.minimal_white.label": [`Minimal white`, `Минимум белого`],
      "ui.field.palette.option.minimal_white.prompt": [
        `Mostly white with one accent color; lots of whitespace.`,
        `Преимущественно белый с одним акцентом; много воздуха.`,
      ],
      "ui.field.palette.option.natural.label": [`Natural`, `Натуральная`],
      "ui.field.palette.option.natural.prompt": [
        `Greens, browns, cream; organic hand-made feel.`,
        `Зелёный, коричневый, крем; органика, ручная работа.`,
      ],
      "ui.field.palette.option.pastel.label": [`Pastel`, `Пастель`],
      "ui.field.palette.option.pastel.prompt": [
        `Soft pastels: blush, mint, butter, sky blue.`,
        `Мягкая пастель: румянец, мята, масло, небо.`,
      ],
      "ui.field.palette.option.red_gold.label": [`Red & gold`, `Красное и золото`],
      "ui.field.palette.option.red_gold.prompt": [
        `Red and gold accents; festive premium.`,
        `Красное и золото; празднично-премиально.`,
      ],
      "ui.field.palette.option.sunset.label": [`Warm sunset`, `Закат`],
      "ui.field.palette.option.sunset.prompt": [
        `Warm orange, coral, magenta gradients.`,
        `Тёплый оранжевый, коралл, пурпур в градиентах.`,
      ],
      "ui.field.style.label": [`Art style`, `Стиль`],
      "ui.field.style.option.flat.label": [`Flat`, `Плоский`],
      "ui.field.style.option.flat.prompt": [
        `Modern flat vector look; bold shapes.`,
        `Современный плоский вектор; смелые формы.`,
      ],
      "ui.field.style.option.illustration.label": [`Illustration`, `Иллюстрация`],
      "ui.field.style.option.illustration.prompt": [
        `Hand-drawn or digital illustration; friendly lines.`,
        `Рисованная или цифровая иллюстрация; дружелюбный контур.`,
      ],
      "ui.field.style.option.papercraft.label": [`Paper craft`, `Бумага`],
      "ui.field.style.option.papercraft.prompt": [
        `Layered paper-cut or papercraft shadow depth.`,
        `Бумажные слои или вырезка с глубиной тени.`,
      ],
      "ui.field.style.option.photo.label": [`Photo collage`, `Фото-коллаж`],
      "ui.field.style.option.photo.prompt": [
        `Photographic collage look—still a single cohesive card front.`,
        `Вид фото-коллажа, но единое целое лицевой стороны.`,
      ],
      "ui.field.style.option.watercolor.label": [`Watercolor`, `Акварель`],
      "ui.field.style.option.watercolor.prompt": [
        `Watercolor wash and paper texture.`,
        `Акварельная заливка и фактура бумаги.`,
      ],
      "ui.field.text_on_card.label": [`Text on art`, `Текст`],
      "ui.field.text_on_card.option.fixed_phrase.label": [`Thanks / Congrats`, `Thanks / Congrats`],
      "ui.field.text_on_card.option.fixed_phrase.prompt": [
        `Include either “Thank you” or “Congratulations” in elegant type—pick which matches occasion better.`,
        `Добавь «Thank you» или «Congratulations» элегантной типографикой — что лучше подходит поводу.`,
      ],
      "ui.field.text_on_card.option.generic.label": [`Short generic`, `Коротко`],
      "ui.field.text_on_card.option.generic.prompt": [
        `Short generic phrase only if it fits the occasion (e.g. Happy Birthday)—clean typography matching style.`,
        `Короткая нейтральная фраза по поводу (например Happy Birthday) — чистая типографика в стиле.`,
      ],
      "ui.field.text_on_card.option.none.label": [`No text`, `Без текста`],
      "ui.field.text_on_card.option.none.prompt": [
        `Image only—no letters or words in the picture.`,
        `Только картинка — без букв и слов на изображении.`,
      ],
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
            kind: `single_choice`,
            label: { emoji: `🎂`, text: i18n(`ui.field.occasion.label`) },
            options: [
              {
                label: { emoji: `🎂`, text: i18n(`ui.field.occasion.option.birthday.label`) },
                prompt: i18n(`ui.field.occasion.option.birthday.prompt`),
                value: `birthday`,
              },
              {
                label: { emoji: `💐`, text: i18n(`ui.field.occasion.option.thanks.label`) },
                prompt: i18n(`ui.field.occasion.option.thanks.prompt`),
                value: `thanks`,
              },
              {
                label: { emoji: `🎄`, text: i18n(`ui.field.occasion.option.winter.label`) },
                prompt: i18n(`ui.field.occasion.option.winter.prompt`),
                value: `winter`,
              },
              {
                label: { emoji: `💪`, text: i18n(`ui.field.occasion.option.congrats.label`) },
                prompt: i18n(`ui.field.occasion.option.congrats.prompt`),
                value: `congrats`,
              },
              {
                label: { emoji: `💕`, text: i18n(`ui.field.occasion.option.love.label`) },
                prompt: i18n(`ui.field.occasion.option.love.prompt`),
                value: `love`,
              },
              {
                label: { emoji: `🎓`, text: i18n(`ui.field.occasion.option.graduation.label`) },
                prompt: i18n(`ui.field.occasion.option.graduation.prompt`),
                value: `graduation`,
              },
              {
                label: { emoji: `👶`, text: i18n(`ui.field.occasion.option.baby.label`) },
                prompt: i18n(`ui.field.occasion.option.baby.prompt`),
                value: `baby`,
              },
              {
                label: { emoji: `🌷`, text: i18n(`ui.field.occasion.option.sympathy.label`) },
                prompt: i18n(`ui.field.occasion.option.sympathy.prompt`),
                value: `sympathy`,
              },
              {
                label: { emoji: `🎊`, text: i18n(`ui.field.occasion.option.party.label`) },
                prompt: i18n(`ui.field.occasion.option.party.prompt`),
                value: `party`,
              },
            ],
          },
          {
            default: `pastel`,
            id: `palette`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.palette.label`) },
            options: [
              {
                label: { emoji: `🌸`, text: i18n(`ui.field.palette.option.pastel.label`) },
                prompt: i18n(`ui.field.palette.option.pastel.prompt`),
                value: `pastel`,
              },
              {
                label: { emoji: `❤️`, text: i18n(`ui.field.palette.option.red_gold.label`) },
                prompt: i18n(`ui.field.palette.option.red_gold.prompt`),
                value: `red_gold`,
              },
              {
                label: { emoji: `🌊`, text: i18n(`ui.field.palette.option.cool_blue.label`) },
                prompt: i18n(`ui.field.palette.option.cool_blue.prompt`),
                value: `cool_blue`,
              },
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.palette.option.sunset.label`) },
                prompt: i18n(`ui.field.palette.option.sunset.prompt`),
                value: `sunset`,
              },
              {
                label: { emoji: `🌿`, text: i18n(`ui.field.palette.option.natural.label`) },
                prompt: i18n(`ui.field.palette.option.natural.prompt`),
                value: `natural`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.palette.option.elegant_dark.label`) },
                prompt: i18n(`ui.field.palette.option.elegant_dark.prompt`),
                value: `elegant_dark`,
              },
              {
                label: { emoji: `🍭`, text: i18n(`ui.field.palette.option.candy.label`) },
                prompt: i18n(`ui.field.palette.option.candy.prompt`),
                value: `candy`,
              },
              {
                label: { emoji: `🤍`, text: i18n(`ui.field.palette.option.minimal_white.label`) },
                prompt: i18n(`ui.field.palette.option.minimal_white.prompt`),
                value: `minimal_white`,
              },
            ],
          },
          {
            default: `cheerful`,
            id: `mood`,
            kind: `single_choice`,
            label: { emoji: `✨`, text: i18n(`ui.field.mood.label`) },
            options: [
              {
                label: { emoji: `😊`, text: i18n(`ui.field.mood.option.cheerful.label`) },
                prompt: i18n(`ui.field.mood.option.cheerful.prompt`),
                value: `cheerful`,
              },
              {
                label: { emoji: `🎩`, text: i18n(`ui.field.mood.option.elegant.label`) },
                prompt: i18n(`ui.field.mood.option.elegant.prompt`),
                value: `elegant`,
              },
              {
                label: { emoji: `🕊️`, text: i18n(`ui.field.mood.option.calm.label`) },
                prompt: i18n(`ui.field.mood.option.calm.prompt`),
                value: `calm`,
              },
              {
                label: { emoji: `🎉`, text: i18n(`ui.field.mood.option.festive.label`) },
                prompt: i18n(`ui.field.mood.option.festive.prompt`),
                value: `festive`,
              },
              {
                label: { emoji: `💫`, text: i18n(`ui.field.mood.option.dreamy.label`) },
                prompt: i18n(`ui.field.mood.option.dreamy.prompt`),
                value: `dreamy`,
              },
            ],
          },
          {
            default: `portrait`,
            id: `layout`,
            kind: `single_choice`,
            label: { emoji: `📐`, text: i18n(`ui.field.layout.label`) },
            options: [
              {
                label: { emoji: `📄`, text: i18n(`ui.field.layout.option.portrait.label`) },
                prompt: i18n(`ui.field.layout.option.portrait.prompt`),
                value: `portrait`,
              },
              {
                label: { emoji: `🖼️`, text: i18n(`ui.field.layout.option.landscape.label`) },
                prompt: i18n(`ui.field.layout.option.landscape.prompt`),
                value: `landscape`,
              },
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.layout.option.centered.label`) },
                prompt: i18n(`ui.field.layout.option.centered.prompt`),
                value: `centered`,
              },
              {
                label: { emoji: `🖼️`, text: i18n(`ui.field.layout.option.fullbleed.label`) },
                prompt: i18n(`ui.field.layout.option.fullbleed.prompt`),
                value: `fullbleed`,
              },
            ],
          },
          {
            default: `illustration`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🖌️`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `✏️`, text: i18n(`ui.field.style.option.illustration.label`) },
                prompt: i18n(`ui.field.style.option.illustration.prompt`),
                value: `illustration`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.style.option.flat.label`) },
                prompt: i18n(`ui.field.style.option.flat.prompt`),
                value: `flat`,
              },
              {
                label: { emoji: `🌸`, text: i18n(`ui.field.style.option.watercolor.label`) },
                prompt: i18n(`ui.field.style.option.watercolor.prompt`),
                value: `watercolor`,
              },
              {
                label: { emoji: `📷`, text: i18n(`ui.field.style.option.photo.label`) },
                prompt: i18n(`ui.field.style.option.photo.prompt`),
                value: `photo`,
              },
              {
                label: { emoji: `📜`, text: i18n(`ui.field.style.option.papercraft.label`) },
                prompt: i18n(`ui.field.style.option.papercraft.prompt`),
                value: `papercraft`,
              },
            ],
          },
          {
            default: `medium`,
            id: `decoration`,
            kind: `single_choice`,
            label: { emoji: `🎀`, text: i18n(`ui.field.decoration.label`) },
            options: [
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.decoration.option.minimal.label`) },
                prompt: i18n(`ui.field.decoration.option.minimal.prompt`),
                value: `minimal`,
              },
              {
                label: { emoji: `〰️`, text: i18n(`ui.field.decoration.option.subtle.label`) },
                prompt: i18n(`ui.field.decoration.option.subtle.prompt`),
                value: `subtle`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.decoration.option.rich.label`) },
                prompt: i18n(`ui.field.decoration.option.rich.prompt`),
                value: `rich`,
              },
            ],
          },
          {
            default: `none`,
            id: `text_on_card`,
            kind: `single_choice`,
            label: { emoji: `🔤`, text: i18n(`ui.field.text_on_card.label`) },
            options: [
              {
                label: { emoji: `🚫`, text: i18n(`ui.field.text_on_card.option.none.label`) },
                prompt: i18n(`ui.field.text_on_card.option.none.prompt`),
                value: `none`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.text_on_card.option.generic.label`) },
                prompt: i18n(`ui.field.text_on_card.option.generic.prompt`),
                value: `generic`,
              },
              {
                label: { emoji: `🙏`, text: i18n(`ui.field.text_on_card.option.fixed_phrase.label`) },
                prompt: i18n(`ui.field.text_on_card.option.fixed_phrase.prompt`),
                value: `fixed_phrase`,
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
        ],
        title: i18n(`meta.title`),
      },
      prompt: i18n(`meta.prompt`),
    }) as const,
);
