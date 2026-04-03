// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = () =>
  ({
    en: {
      emoji: `🎉`,
      labels: { description: `Occasion, audience, tone, markup — ready greeting`, title: `Greeting` },
      prompt: `Write a greeting. Apply every bullet below exactly. When Name, Interests, or Extra context lines appear in the list, take names, hobbies, and facts only from those lines. Deliver the greeting text alone: continuous wishes and wording from the bullets, structured as a ready-to-send message that opens with the greeting or address from the settings.`,
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
                prompt: `Make the greeting about a birthday: wish health, joy, and a good year ahead; mention age or milestone only if Extra context provides it.`,
                value: `birthday`,
              },
              {
                label: `💍 Wedding`,
                prompt: `Make the greeting about a wedding or engagement: love, partnership, lifelong happiness.`,
                value: `wedding`,
              },
              {
                label: `👶 Newborn`,
                prompt: `Make the greeting about a new baby: warmth for parents and a gentle welcome for the child.`,
                value: `newborn`,
              },
              {
                label: `🎆 New Year`,
                prompt: `Make the greeting about New Year: new beginnings, celebration, hope, and good wishes for the year ahead.`,
                value: `new_year`,
              },
              {
                label: `🌷 8 March`,
                prompt: `Make the greeting about International Women's Day (8 March): appreciation, spring, respect, warmth.`,
                value: `march_8`,
              },
              {
                label: `🎖️ 23 February`,
                prompt: `Make the greeting about Defender of the Fatherland Day (23 February): respect, strength, and best wishes.`,
                value: `feb_23`,
              },
              {
                label: `💝 Valentine's`,
                prompt: `Make the greeting about Valentine's Day: love, partnership, tenderness.`,
                value: `valentines`,
              },
            ],
          },
          {
            default: `friend`,
            id: `recipient`,
            kind: `tabs_single`,
            label: `👤 For whom`,
            options: [
              { label: `🤝 Friend`, prompt: `Write for a close friend: warm and direct.`, value: `friend` },
              {
                label: `💕 Loved one`,
                prompt: `Write for a loved one (romantic partner or beloved person): intimate, warm, sincere—like a private, heartfelt message between two people who are close.`,
                value: `loved_one`,
              },
              {
                label: `👩 Mom`,
                prompt: `Write to your mother: layer in warmth, gratitude, and tenderness; shape address and vocabulary for a child speaking to Mom, with the closeness of that bond.`,
                value: `mom`,
              },
              {
                label: `👨 Dad`,
                prompt: `Write to your father: blend respect, gratitude, and warmth; shape address and vocabulary for a child speaking to Dad, steady and affectionate.`,
                value: `dad`,
              },
              {
                label: `👵 Grandma`,
                prompt: `Write to your grandmother: gentle tenderness and respect across generations; a soft family tone with room for fond memory and care.`,
                value: `grandma`,
              },
              {
                label: `👴 Grandpa`,
                prompt: `Write to your grandfather: warm respect and affection across generations; a calm, sturdy family tone.`,
                value: `grandpa`,
              },
              {
                label: `🧑‍🤝‍🧑 Brother`,
                prompt: `Write to your brother: sibling warmth—direct, lively, and close; peer-to-peer tone with space for shared history and light humor where it fits.`,
                value: `brother`,
              },
              {
                label: `👭 Sister`,
                prompt: `Write to your sister: sibling closeness—caring, open, and personal; the tone sisters share when they speak heart-to-heart.`,
                value: `sister`,
              },
              {
                label: `💒 Husband`,
                prompt: `Write to your husband: intimate married tone—love, partnership, shared life; words that fit a spouse addressing her husband.`,
                value: `husband`,
              },
              {
                label: `💍 Wife`,
                prompt: `Write to your wife: intimate married tone—love, tenderness, shared life; words that fit a spouse addressing his wife.`,
                value: `wife`,
              },
              {
                label: `💼 Colleague`,
                prompt: `Write for a colleague: respectful but can be warm.`,
                value: `colleague`,
              },
              {
                label: `👔 Boss / senior`,
                prompt: `Write for a manager or senior person: polite and measured.`,
                value: `boss`,
              },
              {
                label: `🧒 Child / teen`,
                prompt: `Write for a child or teenager: age-appropriate and kind.`,
                value: `young`,
              },
              { label: `👥 Team / group`, prompt: `Write for a group or team: inclusive “we” tone.`, value: `team` },
              {
                label: `👋 Acquaintance`,
                prompt: `Write for someone you know lightly: polite and friendly, warm and respectful with a light, comfortable distance.`,
                value: `acquaintance`,
              },
            ],
          },
          {
            default: `unspecified`,
            id: `gender`,
            kind: `tabs_single`,
            label: `⚧️ Gender (addressee)`,
            options: [
              {
                label: `➖ Unspecified`,
                prompt: `Choose wording that fits the recipient; use gendered grammar where the language naturally calls for it, and keep phrasing flexible elsewhere.`,
                value: `unspecified`,
              },
              {
                label: `♀️ Feminine`,
                prompt: `Use feminine agreement and address forms in gendered languages (e.g. Russian).`,
                value: `female`,
              },
              {
                label: `♂️ Masculine`,
                prompt: `Use masculine agreement and address forms in gendered languages.`,
                value: `male`,
              },
              {
                label: `➗ Neutral`,
                prompt: `Use gender-neutral wording and inclusive address forms wherever the language allows; keep phrasing open and welcoming.`,
                value: `neutral`,
              },
            ],
          },
          {
            default: `unspecified`,
            id: `writerGender`,
            kind: `tabs_single`,
            label: `✍️ Writer (gender)`,
            options: [
              {
                label: `➖ Unspecified`,
                prompt: `Let the sender’s voice stay flexible in first person; choose natural first-person wording without locking every phrase to one gendered self-reference.`,
                value: `unspecified`,
              },
              {
                label: `♀️ Feminine`,
                prompt: `Shape the greeting as from a woman writing: in gendered languages, use first-person feminine agreement whenever the writer refers to herself.`,
                value: `female`,
              },
              {
                label: `♂️ Masculine`,
                prompt: `Shape the greeting as from a man writing: in gendered languages, use first-person masculine agreement whenever the writer refers to himself.`,
                value: `male`,
              },
              {
                label: `➗ Neutral`,
                prompt: `Use gender-neutral first-person wording for the sender where the language allows; keep the voice steady and inclusive.`,
                value: `neutral`,
              },
            ],
          },
          {
            id: `name`,
            kind: `text`,
            label: `✏️ Name`,
            omitWhenEmpty: true,
            placeholder: `How to address them…`,
            prompt: `Name: use exactly as provided; keep spelling as given.`,
          },
          {
            id: `hobbies`,
            kind: `text`,
            label: `🎯 Interests`,
            omitWhenEmpty: true,
            placeholder: `Hobbies, sports, fandoms — short list…`,
            prompt: `Interests: when this line appears in the list, weave these hobbies or interests naturally into the text where they fit the mood and pacing.`,
          },
          {
            default: `dear_name`,
            id: `address`,
            kind: `tabs_single`,
            label: `✉️ Addressing`,
            options: [
              {
                label: `Dear + name`,
                prompt: `Open with “Dear [name]” using the Name field when present; align gendered words with Gender; when Name is absent, open with a warm neutral greeting that does not name the addressee.`,
                value: `dear_name`,
              },
              {
                label: `Hi + name`,
                prompt: `Open with “Hi [name]” when Name is present; when Name is absent, open with a short friendly greeting such as “Hi.”`,
                value: `hi_name`,
              },
              {
                label: `No name`,
                prompt: `Begin with the heart of the greeting—lead with good wishes or the main thought, and skip naming the addressee in the opening.`,
                value: `no_name`,
              },
              {
                label: `Formal title`,
                prompt: `Use a formal opening suitable for official or senior contexts; align gendered forms with Gender when relevant.`,
                value: `formal_title`,
              },
            ],
          },
          {
            default: `medium`,
            id: `length`,
            kind: `tabs_single`,
            label: `📏 Length`,
            options: [
              { label: `✂️ Short`, prompt: `Keep it brief: a few sentences.`, value: `short` },
              { label: `↔️ Medium`, prompt: `Keep it medium: several sentences.`, value: `medium` },
              { label: `📝 Long`, prompt: `Make it longer: multiple sentences or short paragraphs.`, value: `long` },
            ],
          },
          {
            default: `warm`,
            id: `tone`,
            kind: `tabs_single`,
            label: `🎨 Tone`,
            options: [
              { label: `🤝 Warm`, prompt: `Keep the tone warm and sincere.`, value: `warm` },
              { label: `🎩 Formal`, prompt: `Keep the tone formal and polite.`, value: `formal` },
              {
                label: `😄 Playful`,
                prompt: `Keep the tone light and playful; let humor stay gentle, good-natured, and kind toward the addressee.`,
                value: `playful`,
              },
              { label: `✨ Poetic`, prompt: `Use slightly elevated, lyrical wording—stay readable.`, value: `poetic` },
              { label: `🔥 Energetic`, prompt: `Keep the tone upbeat and energetic.`, value: `energetic` },
              {
                label: `🕊️ Calm`,
                prompt: `Keep the tone gentle and calm; soft and understated, with room to breathe.`,
                value: `calm`,
              },
            ],
          },
          {
            default: true,
            id: `addEmoji`,
            kind: `toggle`,
            label: `😎 Emoji`,
            promptOff: `Deliver the greeting as plain text: letters, numbers, standard punctuation, and spaces.`,
            promptOn: `Use emoji generously throughout the greeting: several per sentence or short stretch where they match the mood and meaning; vary them; place them to reinforce warmth or humor; spread them so each line stays easy to read, with emoji alongside the words.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: `📝 Markup`,
            promptOff: `Plain text only; no HTML tags.`,
            promptOn: `Use <strong> or <b> HTML to stress important words and phrases—more accents than in plain text.`,
          },
          {
            default: false,
            id: `rhyme`,
            kind: `toggle`,
            label: `🪶 Rhyme`,
            promptOff: `Write the greeting in flowing prose; keep rhythm in the sentences and phrasing only.`,
            promptOn: `Prefer light rhyme or rhythm where it sounds natural in the language; let the rhyme support the mood and the message.`,
          },
          {
            id: `extra`,
            kind: `text`,
            label: `📝 Extra context`,
            omitWhenEmpty: true,
            placeholder: `Age, date, inside joke, milestone — one short line…`,
            prompt: `Extra context: anchor every detail you add in what this line states; build only on facts written here.`,
          },
        ],
        title: `🎉 Greeting`,
      },
    },
    group: `text`,
    ru: {
      emoji: `🎊`,
      labels: { description: `Повод, адресат, тон, разметка — готовое поздравление`, title: `Поздравление` },
      prompt: `Напиши поздравление. Выполни строго каждый пункт списка ниже. Если в списке есть поля «Имя», «Увлечения», «Дополнительно» — бери имена, увлечения и факты только из этих строк. В ответе — только текст поздравления: цельное сообщение с пожеланиями по всем пунктам, готовое к отправке; начинай сразу с поздравления или обращения по настройкам.`,
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
                prompt: `Сделай поздравление про день рождения: пожелания здоровья, радости, года вперёд; возраст или веху упоминай только если это есть в «Дополнительно».`,
                value: `birthday`,
              },
              {
                label: `💍 Свадьба`,
                prompt: `Сделай поздравление про свадьбу или помолвку: любовь, союз, счастье.`,
                value: `wedding`,
              },
              {
                label: `👶 Рождение ребёнка`,
                prompt: `Сделай поздравление про рождение ребёнка: тепло родителям и нежное приветствие малышу.`,
                value: `newborn`,
              },
              {
                label: `🎆 Новый год`,
                prompt: `Сделай поздравление с Новым годом: новый круг, праздник, надежда и добрые пожелания на год вперёд.`,
                value: `new_year`,
              },
              {
                label: `🌷 8 марта`,
                prompt: `Сделай поздравление к 8 Марта: признательность, весна, уважение, тепло.`,
                value: `march_8`,
              },
              {
                label: `🎖️ 23 февраля`,
                prompt: `Сделай поздравление к 23 февраля: уважение, сила характера, добрые пожелания.`,
                value: `feb_23`,
              },
              {
                label: `💝 День влюблённых`,
                prompt: `Сделай поздравление ко Дню святого Валентина: любовь, партнёрство, нежность.`,
                value: `valentines`,
              },
            ],
          },
          {
            default: `friend`,
            id: `recipient`,
            kind: `tabs_single`,
            label: `👤 Кому`,
            options: [
              { label: `🤝 Друг`, prompt: `Пиши как для близкого друга: тепло и напрямую.`, value: `friend` },
              {
                label: `💕 Любимый человек`,
                prompt: `Пиши для любимого человека: близко, тепло, искренне — как личное, душевное сообщение между очень близкими людьми.`,
                value: `loved_one`,
              },
              {
                label: `👩 Мама`,
                prompt: `Пиши маме: тепло, благодарность, нежность; обращение и лексика — как ребёнок взрослого возраста родителю, с близостью этой связи.`,
                value: `mom`,
              },
              {
                label: `👨 Папа`,
                prompt: `Пиши папе: уважение, благодарность, тепло; обращение и лексика — как ребёнок взрослого возраста отцу, ровно и по-своему нежно.`,
                value: `dad`,
              },
              {
                label: `👵 Бабушка`,
                prompt: `Пиши бабушке: нежность и уважение через поколения; мягкий семейный тон, место воспоминаниям и заботе.`,
                value: `grandma`,
              },
              {
                label: `👴 Дедушка`,
                prompt: `Пиши дедушке: тёплое уважение и участие через поколения; спокойный, надёжный семейный тон.`,
                value: `grandpa`,
              },
              {
                label: `🧑‍🤝‍🧑 Брат`,
                prompt: `Пиши брату: братская близость — прямо, по-живому, на равных; место общей истории и лёгкому юмору там, где уместно.`,
                value: `brother`,
              },
              {
                label: `👭 Сестра`,
                prompt: `Пиши сестре: сестринская близость — открыто, лично, по душе; тон «свои», когда говорят серьёзно и тепло.`,
                value: `sister`,
              },
              {
                label: `💒 Муж`,
                prompt: `Пиши мужу: тон супругов — любовь, партнёрство, общая жизнь; формулировки как от жены к мужу.`,
                value: `husband`,
              },
              {
                label: `💍 Жена`,
                prompt: `Пиши жене: тон супругов — любовь, нежность, общая жизнь; формулировки как от мужа к жене.`,
                value: `wife`,
              },
              { label: `💼 Коллега`, prompt: `Пиши для коллеги: уважительно, можно тепло.`, value: `colleague` },
              {
                label: `👔 Руководитель`,
                prompt: `Пиши для руководителя или старшего: вежливо и сдержанно.`,
                value: `boss`,
              },
              {
                label: `🧒 Ребёнок / подросток`,
                prompt: `Пиши для ребёнка или подростка: по возрасту, доброжелательно.`,
                value: `young`,
              },
              { label: `👥 Команда`, prompt: `Пиши для команды или группы: общий тон «мы».`, value: `team` },
              {
                label: `👋 Знакомый`,
                prompt: `Пиши для знакомого: дружелюбно и уважительно, с лёгкой дистанцией и теплом без фамильярности.`,
                value: `acquaintance`,
              },
            ],
          },
          {
            default: `unspecified`,
            id: `gender`,
            kind: `tabs_single`,
            label: `⚧️ Пол адресата`,
            options: [
              {
                label: `➖ Не указан`,
                prompt: `Подбирай формулировки под адресата; родовую грамматику используй там, где язык к этому естественно подводит, в остальном оставляй формулировки гибкими.`,
                value: `unspecified`,
              },
              {
                label: `♀️ Женский`,
                prompt: `Используй женские формы согласования и обращения в языках с родом (например русский).`,
                value: `female`,
              },
              {
                label: `♂️ Мужской`,
                prompt: `Используй мужские формы согласования и обращения в языках с родом.`,
                value: `male`,
              },
              {
                label: `➗ Нейтрально`,
                prompt: `Используй нейтральные и инклюзивные формулировки обращения там, где язык это позволяет; сохраняй открытый, уважительный тон.`,
                value: `neutral`,
              },
            ],
          },
          {
            default: `unspecified`,
            id: `writerGender`,
            kind: `tabs_single`,
            label: `✍️ Пол (кто пишет)`,
            options: [
              {
                label: `➖ Не указан`,
                prompt: `Дай голосу отправителя в первом лице гибкость; подбирай естественные формулировки «я» без жёсткой привязки каждой фразы к одному роду говорящего.`,
                value: `unspecified`,
              },
              {
                label: `♀️ Женский`,
                prompt: `Строй текст как от женщины: в языках с родом используй женские формы первого лица там, где говорящая ссылается на себя.`,
                value: `female`,
              },
              {
                label: `♂️ Мужской`,
                prompt: `Строй текст как от мужчины: в языках с родом используй мужские формы первого лица там, где говорящий ссылается на себя.`,
                value: `male`,
              },
              {
                label: `➗ Нейтрально`,
                prompt: `Используй нейтральные формулировки первого лица для отправителя там, где язык это позволяет; держи голос ровным и инклюзивным.`,
                value: `neutral`,
              },
            ],
          },
          {
            id: `name`,
            kind: `text`,
            label: `✏️ Имя`,
            omitWhenEmpty: true,
            placeholder: `Как обращаться…`,
            prompt: `Имя: используй как введено; сохраняй написание и форму имени.`,
          },
          {
            id: `hobbies`,
            kind: `text`,
            label: `🎯 Увлечения`,
            omitWhenEmpty: true,
            placeholder: `Хобби, спорт, увлечения — коротко…`,
            prompt: `Увлечения: если эта строка есть в списке, вплети указанные увлечения в текст естественно, в темпе и настроении поздравления.`,
          },
          {
            default: `dear_name`,
            id: `address`,
            kind: `tabs_single`,
            label: `✉️ Обращение`,
            options: [
              {
                label: `«Дорогой/ая» + имя`,
                prompt: `Начни с «Дорогой/Дорогая [имя]» — имя из поля «Имя», род согласуй с полем «Пол адресата»; если имени нет в списке, начни с тёплого нейтрального обращения без имени.`,
                value: `dear_name`,
              },
              {
                label: `«Привет» + имя`,
                prompt: `Начни с «Привет, [имя]», когда имя задано в поле «Имя»; когда имени нет в списке, начни с короткого дружелюбного приветствия вроде «Привет!».`,
                value: `hi_name`,
              },
              {
                label: `Без имени`,
                prompt: `Начни сразу с сути поздравления: с пожеланий или главной мысли, без имени в первой фразе.`,
                value: `no_name`,
              },
              {
                label: `Официально`,
                prompt: `Используй официальное обращение (Уважаемый/Уважаемая и т.п.); род согласуй с полем «Пол адресата», если уместно.`,
                value: `formal_title`,
              },
            ],
          },
          {
            default: `medium`,
            id: `length`,
            kind: `tabs_single`,
            label: `📏 Длина`,
            options: [
              { label: `✂️ Коротко`, prompt: `Держи текст кратко: несколько предложений.`, value: `short` },
              { label: `↔️ Средне`, prompt: `Держи текст средней длины: несколько предложений.`, value: `medium` },
              {
                label: `📝 Развёрнуто`,
                prompt: `Сделай развёрнуто: несколько абзацев или много предложений.`,
                value: `long`,
              },
            ],
          },
          {
            default: `warm`,
            id: `tone`,
            kind: `tabs_single`,
            label: `🎨 Тон`,
            options: [
              { label: `🤝 Тёплый`, prompt: `Держи тон тёплым и искренним.`, value: `warm` },
              { label: `🎩 Официальный`, prompt: `Держи тон официальным и вежливым.`, value: `formal` },
              {
                label: `😄 Игривый`,
                prompt: `Держи тон лёгким и игривым; юмор добрый, лёгкий и уважительный к адресату.`,
                value: `playful`,
              },
              {
                label: `✨ Лиричный`,
                prompt: `Используй слегка возвышенные формулировки; остаётся читаемо.`,
                value: `poetic`,
              },
              { label: `🔥 Бодрый`, prompt: `Держи тон бодрым и энергичным.`, value: `energetic` },
              {
                label: `🕊️ Спокойный`,
                prompt: `Держи тон мягким и спокойным; ровный, уместный, с пространством между фразами.`,
                value: `calm`,
              },
            ],
          },
          {
            default: true,
            id: `addEmoji`,
            kind: `toggle`,
            label: `😎 Эмодзи`,
            promptOff: `Передай поздравление обычным текстом: буквы, цифры, знаки препинания, пробелы.`,
            promptOn: `Добавляй эмодзи щедро по всему поздравлению: несколько на предложение или короткий смысловой блок, где они усиливают настроение и смысл; чередуй разные эмодзи; ставь их для тепла и юмора; распределяй так, чтобы строки оставались лёгкими для чтения, а эмодзи шли рядом со словами.`,
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `toggle`,
            label: `📝 Разметка`,
            promptOff: `Только обычный текст, без HTML-тегов.`,
            promptOn: `Используй теги <strong> или <b> в HTML, чтобы усилить акценты на словах и фразах — их должно быть заметно больше, чем без разметки.`,
          },
          {
            default: false,
            id: `rhyme`,
            kind: `toggle`,
            label: `🪶 Рифма`,
            promptOff: `Пиши поздравление связной прозой; ритм — за счёт фраз и интонации предложений.`,
            promptOn: `По возможности лёгкая рифма или ритм там, где она звучит естественно; пусть рифма служит настроению и смыслу.`,
          },
          {
            id: `extra`,
            kind: `text`,
            label: `📝 Дополнительно`,
            omitWhenEmpty: true,
            placeholder: `Возраст, дата, шутка, контекст — одна короткая строка…`,
            prompt: `Дополнительно: опирайся на факты и детали, которые явно указаны в этой строке; развивай только то, что из неё следует.`,
          },
        ],
        title: `🎊 Поздравление`,
      },
    },
  }) as const;
/* jscpd:ignore-end */
