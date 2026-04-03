// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = () =>
  ({
    en: {
      emoji: `💌`,
      labels: { description: `Greeting card front — rich art options`, title: `Postcard` },
      prompt: `You build image-generation prompts. From every bullet below, write **one** detailed prompt **for image generation**: a **greeting-card front illustration** (not a photo of a printed card unless asked). It will be sent to the image model. Apply: occasion, mood, layout, art style, **palette from tabs**, decoration level, and text-on-card rule. Describe composition, focal motif, and border. End: no watermark. Reply with that string only—no other text.`,
      uiPlan: {
        fields: [
          {
            default: `birthday`,
            id: `occasion`,
            kind: `tabs_single`,
            label: `🎂 Occasion`,
            options: [
              {
                label: `🎂 Birthday`,
                prompt: `Birthday theme: cake, candles, balloons, or abstract festive motifs.`,
                value: `birthday`,
              },
              { label: `💐 Thanks`, prompt: `Gratitude theme: flowers, hearts, gentle light.`, value: `thanks` },
              {
                label: `🎄 Winter`,
                prompt: `Winter holidays: snow, stars, ornaments—non-denominational unless user implies otherwise.`,
                value: `winter`,
              },
              {
                label: `💪 Congrats`,
                prompt: `Congratulations: success, trophy, stars, upward motion.`,
                value: `congrats`,
              },
              { label: `💕 Love`, prompt: `Love or anniversary: romantic but tasteful symbols.`, value: `love` },
              { label: `🎓 Scholar`, prompt: `Graduation or achievement: cap, diploma motifs.`, value: `graduation` },
              { label: `👶 Baby`, prompt: `New baby: soft toys, moon, pastel joy.`, value: `baby` },
              {
                label: `🌷 Sympathy`,
                prompt: `Condolence: subdued palette, lilies or candle, respectful.`,
                value: `sympathy`,
              },
              {
                label: `🎊 Party`,
                prompt: `Generic celebration: confetti, streamers, festive abstract.`,
                value: `party`,
              },
            ],
          },
          {
            default: `pastel`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Palette`,
            options: [
              { label: `🌸 Pastel`, prompt: `Soft pastels: blush, mint, butter, sky blue.`, value: `pastel` },
              { label: `❤️ Red & gold`, prompt: `Red and gold accents; festive premium.`, value: `red_gold` },
              { label: `🌊 Cool blue`, prompt: `Cool blues and white; crisp and calm.`, value: `cool_blue` },
              { label: `🌅 Warm sunset`, prompt: `Warm orange, coral, magenta gradients.`, value: `sunset` },
              { label: `🌿 Natural`, prompt: `Greens, browns, cream; organic hand-made feel.`, value: `natural` },
              {
                label: `⬛ Elegant dark`,
                prompt: `Dark navy or charcoal with gold or silver foil accents.`,
                value: `elegant_dark`,
              },
              { label: `🍭 Candy`, prompt: `Bright candy colors; playful balance.`, value: `candy` },
              {
                label: `🤍 Minimal white`,
                prompt: `Mostly white with one accent color; lots of whitespace.`,
                value: `minimal_white`,
              },
            ],
          },
          {
            default: `cheerful`,
            id: `mood`,
            kind: `tabs_single`,
            label: `✨ Mood`,
            options: [
              { label: `😊 Cheerful`, prompt: `Bright, upbeat, inviting.`, value: `cheerful` },
              { label: `🎩 Elegant`, prompt: `Elegant, refined, restrained detail.`, value: `elegant` },
              { label: `🕊️ Calm`, prompt: `Calm, soft, peaceful atmosphere.`, value: `calm` },
              { label: `🎉 Festive`, prompt: `High energy festive; bold shapes.`, value: `festive` },
              { label: `💫 Dreamy`, prompt: `Dreamy soft focus, sparkles, gentle glow.`, value: `dreamy` },
            ],
          },
          {
            default: `portrait`,
            id: `layout`,
            kind: `tabs_single`,
            label: `📐 Layout`,
            options: [
              { label: `📄 Portrait`, prompt: `Vertical greeting card composition.`, value: `portrait` },
              { label: `🖼️ Landscape`, prompt: `Horizontal greeting card composition.`, value: `landscape` },
              {
                label: `⬜ Centered icon`,
                prompt: `Strong centered focal illustration with even margins.`,
                value: `centered`,
              },
              {
                label: `🖼️ Full bleed`,
                prompt: `Full-bleed art edge to edge; motif extends to borders.`,
                value: `fullbleed`,
              },
            ],
          },
          {
            default: `illustration`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Art style`,
            options: [
              {
                label: `✏️ Illustration`,
                prompt: `Hand-drawn or digital illustration; friendly lines.`,
                value: `illustration`,
              },
              { label: `✨ Flat`, prompt: `Modern flat vector look; bold shapes.`, value: `flat` },
              { label: `🌸 Watercolor`, prompt: `Watercolor wash and paper texture.`, value: `watercolor` },
              {
                label: `📷 Photo collage`,
                prompt: `Photographic collage look—still a single cohesive card front.`,
                value: `photo`,
              },
              { label: `✨ Paper craft`, prompt: `Layered paper-cut or papercraft shadow depth.`, value: `papercraft` },
            ],
          },
          {
            default: `medium`,
            id: `decoration`,
            kind: `tabs_single`,
            label: `🎀 Ornament`,
            options: [
              { label: `◻️ Minimal`, prompt: `Minimal ornament; one focal motif.`, value: `minimal` },
              { label: `〰️ Subtle`, prompt: `Subtle border or corner flourishes.`, value: `subtle` },
              { label: `✨ Rich`, prompt: `Rich pattern: frames, botanicals, or geometric ornament.`, value: `rich` },
            ],
          },
          {
            default: `none`,
            id: `text_on_card`,
            kind: `tabs_single`,
            label: `🔤 Text on art`,
            options: [
              { label: `🚫 No text`, prompt: `Image only—no letters or words in the picture.`, value: `none` },
              {
                label: `✨ Short generic`,
                prompt: `Short generic phrase only if it fits the occasion (e.g. Happy Birthday)—clean typography matching style.`,
                value: `generic`,
              },
              {
                label: `🙏 Thanks / Congrats`,
                prompt: `Include either “Thank you” or “Congratulations” in elegant type—pick which matches occasion better.`,
                value: `fixed_phrase`,
              },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: `📝 Optional motif`,
            placeholder: `e.g. cats, bicycles, seaside — one line…`,
            prompt: `Optional motif or symbol to weave in (one line):`,
          },
        ],
        title: `💌 Postcard`,
      },
    },
    group: `visual`,
    ru: {
      emoji: `💌`,
      labels: { description: `Открытка — много вариантов оформления`, title: `Открытка` },
      prompt: `Собери **один** подробный промпт **для генерации изображения**: **лицевая сторона открытки** (иллюстрация); промпт получит модель картинки. Учти повод, настроение, формат, стиль, **палитру из вкладок**, орнамент, правило про текст на картинке. Опциональная строка — вплести мотив. Без водяных знаков. Верни только эту строку — без другого текста.`,
      uiPlan: {
        fields: [
          {
            default: `birthday`,
            id: `occasion`,
            kind: `tabs_single`,
            label: `🎂 Повод`,
            options: [
              {
                label: `🎂 День рождения`,
                prompt: `День рождения: торт, свечи, шары или абстрактный праздник.`,
                value: `birthday`,
              },
              { label: `💐 Спасибо`, prompt: `Благодарность: цветы, сердечки, мягкий свет.`, value: `thanks` },
              {
                label: `🎄 Зима`,
                prompt: `Зимние праздники: снег, звёзды, без навязывания конфессии.`,
                value: `winter`,
              },
              {
                label: `💪 Поздравление`,
                prompt: `Поздравление с успехом: звёзды, кубок, движение вверх.`,
                value: `congrats`,
              },
              { label: `💕 Любовь`, prompt: `Любовь или годовщина; тактичные символы.`, value: `love` },
              { label: `🎓 Учёба`, prompt: `Выпуск: шапка, атрибуты успеха.`, value: `graduation` },
              { label: `👶 Малыш`, prompt: `Рождение: нежность, пастель.`, value: `baby` },
              {
                label: `🌷 Соболезнование`,
                prompt: `Соболезнование: сдержанная палитра, уважение.`,
                value: `sympathy`,
              },
              { label: `🎊 Праздник`, prompt: `Общий праздник: конфетти, ленты.`, value: `party` },
            ],
          },
          {
            default: `pastel`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Палитра`,
            options: [
              { label: `🌸 Пастель`, prompt: `Нежная пастель: роза, мята, лимон, небо.`, value: `pastel` },
              { label: `❤️ Красное и золото`, prompt: `Красный и золото; торжество.`, value: `red_gold` },
              { label: `🌊 Холодная`, prompt: `Холодный синий и белый.`, value: `cool_blue` },
              { label: `🌅 Закат`, prompt: `Тёплый закат: коралл, маджента.`, value: `sunset` },
              { label: `🌿 Натуральная`, prompt: `Зелень, коричневый, крем; крафт.`, value: `natural` },
              {
                label: `⬛ Тёмная элегант`,
                prompt: `Тёмно-синий или уголь с золотом/серебром.`,
                value: `elegant_dark`,
              },
              { label: `🍭 Яркая`, prompt: `Конфетные цвета в балансе.`, value: `candy` },
              { label: `🤍 Минимум белого`, prompt: `Преимущественно белый и один акцент.`, value: `minimal_white` },
            ],
          },
          {
            default: `cheerful`,
            id: `mood`,
            kind: `tabs_single`,
            label: `✨ Настроение`,
            options: [
              { label: `😊 Радостное`, prompt: `Светлое и радостное.`, value: `cheerful` },
              { label: `🎩 Элегантное`, prompt: `Элегантное, сдержанный декор.`, value: `elegant` },
              { label: `🕊️ Спокойное`, prompt: `Спокойное, мягкое.`, value: `calm` },
              { label: `🎉 Праздничное`, prompt: `Яркий праздник.`, value: `festive` },
              { label: `💫 Мечтательное`, prompt: `Мягкий свет, блёстки, глубина.`, value: `dreamy` },
            ],
          },
          {
            default: `portrait`,
            id: `layout`,
            kind: `tabs_single`,
            label: `📐 Формат`,
            options: [
              { label: `📄 Книжная`, prompt: `Книжная композиция открытки.`, value: `portrait` },
              { label: `🖼️ Альбомная`, prompt: `Альбомная композиция.`, value: `landscape` },
              { label: `⬜ Центр`, prompt: `Сильный центр, ровные поля.`, value: `centered` },
              { label: `🖼️ В край`, prompt: `Картинка на весь кадр до краёв.`, value: `fullbleed` },
            ],
          },
          {
            default: `illustration`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Стиль`,
            options: [
              { label: `✏️ Иллюстрация`, prompt: `Иллюстрация с характером линии.`, value: `illustration` },
              { label: `✨ Плоский`, prompt: `Плоский векторный стиль.`, value: `flat` },
              { label: `🌸 Акварель`, prompt: `Акварельная фактура.`, value: `watercolor` },
              { label: `📷 Фото-коллаж`, prompt: `Вид фотоколлажа, но единая композиция.`, value: `photo` },
              { label: `✨ Бумага`, prompt: `Бумажные слои и тени.`, value: `papercraft` },
            ],
          },
          {
            default: `medium`,
            id: `decoration`,
            kind: `tabs_single`,
            label: `🎀 Орнамент`,
            options: [
              { label: `◻️ Минимум`, prompt: `Минимум украшений; один мотив.`, value: `minimal` },
              { label: `〰️ Лёгкий`, prompt: `Лёгкая рамка или углы.`, value: `subtle` },
              { label: `✨ Богато`, prompt: `Богатый орнамент: рамка, ботаника, геометрия.`, value: `rich` },
            ],
          },
          {
            default: `none`,
            id: `text_on_card`,
            kind: `tabs_single`,
            label: `🔤 Текст`,
            options: [
              { label: `🚫 Без текста`, prompt: `Только рисунок — без букв.`, value: `none` },
              {
                label: `✨ Коротко`,
                prompt: `Короткая нейтральная фраза в типографике стиля (напр. Happy Birthday), если уместно.`,
                value: `generic`,
              },
              {
                label: `🙏 Thanks / Congrats`,
                prompt: `«Thank you» или «Congratulations» — выбери по поводу; аккуратная типографика.`,
                value: `fixed_phrase`,
              },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: `📝 Доп. мотив`,
            placeholder: `Коты, велосипед, море — одна строка…`,
            prompt: `Дополнительный мотив или символ (одна строка, необязательно):`,
          },
        ],
        title: `💌 Открытка`,
      },
    },
  }) as const;
/* jscpd:ignore-end */
