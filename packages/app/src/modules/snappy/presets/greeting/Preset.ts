// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [
    `Personalized greeting for any occasion and audience`,
    `Персональное поздравление под повод и адресата`,
  ],
  emoji: `🎉`,
  group: `text`,
  title: [`Greeting`, `Поздравление`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need a greeting or congratulations message.`, `Мне нужно поздравление или приветственное сообщение.`],
      skill: `greeting-text`,
      tools: [`ask`, `date-time`, `publish-text`],
    }),
    Flow.staticText(meta, {
      fields: ({ form, i18n }) =>
        form([
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
                label: { emoji: `💍`, text: i18n(`ui.field.occasion.option.wedding.label`) },
                prompt: i18n(`ui.field.occasion.option.wedding.prompt`),
                value: `wedding`,
              },
              {
                label: { emoji: `👶`, text: i18n(`ui.field.occasion.option.newborn.label`) },
                prompt: i18n(`ui.field.occasion.option.newborn.prompt`),
                value: `newborn`,
              },
              {
                label: { emoji: `🎆`, text: i18n(`ui.field.occasion.option.new_year.label`) },
                prompt: i18n(`ui.field.occasion.option.new_year.prompt`),
                value: `new_year`,
              },
              {
                label: { emoji: `🌷`, text: i18n(`ui.field.occasion.option.march_8.label`) },
                prompt: i18n(`ui.field.occasion.option.march_8.prompt`),
                value: `march_8`,
              },
              {
                label: { emoji: `🎖️`, text: i18n(`ui.field.occasion.option.feb_23.label`) },
                prompt: i18n(`ui.field.occasion.option.feb_23.prompt`),
                value: `feb_23`,
              },
              {
                label: { emoji: `💝`, text: i18n(`ui.field.occasion.option.valentines.label`) },
                prompt: i18n(`ui.field.occasion.option.valentines.prompt`),
                value: `valentines`,
              },
            ],
          },
          {
            default: `friend`,
            id: `recipient`,
            kind: `single_choice`,
            label: { emoji: `👤`, text: i18n(`ui.field.recipient.label`) },
            options: [
              {
                label: { emoji: `🤝`, text: i18n(`ui.field.recipient.option.friend.label`) },
                prompt: i18n(`ui.field.recipient.option.friend.prompt`),
                value: `friend`,
              },
              {
                label: { emoji: `💕`, text: i18n(`ui.field.recipient.option.loved_one.label`) },
                prompt: i18n(`ui.field.recipient.option.loved_one.prompt`),
                value: `loved_one`,
              },
              {
                label: { emoji: `👩`, text: i18n(`ui.field.recipient.option.mom.label`) },
                prompt: i18n(`ui.field.recipient.option.mom.prompt`),
                value: `mom`,
              },
              {
                label: { emoji: `👨`, text: i18n(`ui.field.recipient.option.dad.label`) },
                prompt: i18n(`ui.field.recipient.option.dad.prompt`),
                value: `dad`,
              },
              {
                label: { emoji: `👵`, text: i18n(`ui.field.recipient.option.grandma.label`) },
                prompt: i18n(`ui.field.recipient.option.grandma.prompt`),
                value: `grandma`,
              },
              {
                label: { emoji: `👴`, text: i18n(`ui.field.recipient.option.grandpa.label`) },
                prompt: i18n(`ui.field.recipient.option.grandpa.prompt`),
                value: `grandpa`,
              },
              {
                label: { emoji: `🧑‍🤝‍🧑`, text: i18n(`ui.field.recipient.option.brother.label`) },
                prompt: i18n(`ui.field.recipient.option.brother.prompt`),
                value: `brother`,
              },
              {
                label: { emoji: `👭`, text: i18n(`ui.field.recipient.option.sister.label`) },
                prompt: i18n(`ui.field.recipient.option.sister.prompt`),
                value: `sister`,
              },
              {
                label: { emoji: `💒`, text: i18n(`ui.field.recipient.option.husband.label`) },
                prompt: i18n(`ui.field.recipient.option.husband.prompt`),
                value: `husband`,
              },
              {
                label: { emoji: `💍`, text: i18n(`ui.field.recipient.option.wife.label`) },
                prompt: i18n(`ui.field.recipient.option.wife.prompt`),
                value: `wife`,
              },
              {
                label: { emoji: `💼`, text: i18n(`ui.field.recipient.option.colleague.label`) },
                prompt: i18n(`ui.field.recipient.option.colleague.prompt`),
                value: `colleague`,
              },
              {
                label: { emoji: `👔`, text: i18n(`ui.field.recipient.option.boss.label`) },
                prompt: i18n(`ui.field.recipient.option.boss.prompt`),
                value: `boss`,
              },
              {
                label: { emoji: `🧒`, text: i18n(`ui.field.recipient.option.young.label`) },
                prompt: i18n(`ui.field.recipient.option.young.prompt`),
                value: `young`,
              },
              {
                label: { emoji: `👥`, text: i18n(`ui.field.recipient.option.team.label`) },
                prompt: i18n(`ui.field.recipient.option.team.prompt`),
                value: `team`,
              },
              {
                label: { emoji: `👋`, text: i18n(`ui.field.recipient.option.acquaintance.label`) },
                prompt: i18n(`ui.field.recipient.option.acquaintance.prompt`),
                value: `acquaintance`,
              },
            ],
          },
          {
            default: `unspecified`,
            id: `gender`,
            kind: `single_choice`,
            label: { emoji: `⚧️`, text: i18n(`ui.field.gender.label`) },
            options: [
              {
                label: { emoji: `➖`, text: i18n(`ui.field.gender.option.unspecified.label`) },
                prompt: i18n(`ui.field.gender.option.unspecified.prompt`),
                value: `unspecified`,
              },
              {
                label: { emoji: `♀️`, text: i18n(`ui.field.gender.option.female.label`) },
                prompt: i18n(`ui.field.gender.option.female.prompt`),
                value: `female`,
              },
              {
                label: { emoji: `♂️`, text: i18n(`ui.field.gender.option.male.label`) },
                prompt: i18n(`ui.field.gender.option.male.prompt`),
                value: `male`,
              },
              {
                label: { emoji: `➗`, text: i18n(`ui.field.gender.option.neutral.label`) },
                prompt: i18n(`ui.field.gender.option.neutral.prompt`),
                value: `neutral`,
              },
            ],
          },
          {
            default: `unspecified`,
            id: `writerGender`,
            kind: `single_choice`,
            label: { emoji: `✍️`, text: i18n(`ui.field.writerGender.label`) },
            options: [
              {
                label: { emoji: `➖`, text: i18n(`ui.field.writerGender.option.unspecified.label`) },
                prompt: i18n(`ui.field.writerGender.option.unspecified.prompt`),
                value: `unspecified`,
              },
              {
                label: { emoji: `♀️`, text: i18n(`ui.field.writerGender.option.female.label`) },
                prompt: i18n(`ui.field.writerGender.option.female.prompt`),
                value: `female`,
              },
              {
                label: { emoji: `♂️`, text: i18n(`ui.field.writerGender.option.male.label`) },
                prompt: i18n(`ui.field.writerGender.option.male.prompt`),
                value: `male`,
              },
              {
                label: { emoji: `➗`, text: i18n(`ui.field.writerGender.option.neutral.label`) },
                prompt: i18n(`ui.field.writerGender.option.neutral.prompt`),
                value: `neutral`,
              },
            ],
          },
          {
            id: `name`,
            kind: `text_input`,
            label: { emoji: `✏️`, text: i18n(`ui.field.name.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.name.placeholder`),
            prompt: i18n(`ui.field.name.prompt`),
          },
          {
            id: `hobbies`,
            kind: `text_input`,
            label: { emoji: `🎯`, text: i18n(`ui.field.hobbies.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.hobbies.placeholder`),
            prompt: i18n(`ui.field.hobbies.prompt`),
          },
          {
            default: `medium`,
            id: `length`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.length.label`) },
            options: [
              {
                label: { emoji: `✂️`, text: i18n(`ui.field.length.option.short.label`) },
                prompt: i18n(`ui.field.length.option.short.prompt`),
                value: `short`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.length.option.medium.label`) },
                prompt: i18n(`ui.field.length.option.medium.prompt`),
                value: `medium`,
              },
              {
                label: { emoji: `📝`, text: i18n(`ui.field.length.option.long.label`) },
                prompt: i18n(`ui.field.length.option.long.prompt`),
                value: `long`,
              },
            ],
          },
          {
            default: `warm`,
            id: `tone`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.tone.label`) },
            options: [
              {
                label: { emoji: `🤝`, text: i18n(`ui.field.tone.option.warm.label`) },
                prompt: i18n(`ui.field.tone.option.warm.prompt`),
                value: `warm`,
              },
              {
                label: { emoji: `🎩`, text: i18n(`ui.field.tone.option.formal.label`) },
                prompt: i18n(`ui.field.tone.option.formal.prompt`),
                value: `formal`,
              },
              {
                label: { emoji: `😄`, text: i18n(`ui.field.tone.option.playful.label`) },
                prompt: i18n(`ui.field.tone.option.playful.prompt`),
                value: `playful`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.tone.option.poetic.label`) },
                prompt: i18n(`ui.field.tone.option.poetic.prompt`),
                value: `poetic`,
              },
              {
                label: { emoji: `🔥`, text: i18n(`ui.field.tone.option.energetic.label`) },
                prompt: i18n(`ui.field.tone.option.energetic.prompt`),
                value: `energetic`,
              },
              {
                label: { emoji: `🕊️`, text: i18n(`ui.field.tone.option.calm.label`) },
                prompt: i18n(`ui.field.tone.option.calm.prompt`),
                value: `calm`,
              },
            ],
          },
          {
            default: true,
            id: `addEmoji`,
            kind: `binary_choice`,
            label: { emoji: `😎`, text: i18n(`ui.field.addEmoji.label`) },
            promptOff: i18n(`ui.field.addEmoji.promptOff`),
            promptOn: i18n(`ui.field.addEmoji.promptOn`),
          },
          {
            default: true,
            id: `addFormatting`,
            kind: `binary_choice`,
            label: { emoji: `📝`, text: i18n(`ui.field.addFormatting.label`) },
            promptOff: i18n(`ui.field.addFormatting.promptOff`),
            promptOn: i18n(`ui.field.addFormatting.promptOn`),
          },
          {
            default: false,
            id: `rhyme`,
            kind: `binary_choice`,
            label: { emoji: `🪶`, text: i18n(`ui.field.rhyme.label`) },
            promptOff: i18n(`ui.field.rhyme.promptOff`),
            promptOn: i18n(`ui.field.rhyme.promptOn`),
          },
          {
            id: `extra`,
            kind: `text_input`,
            label: { emoji: `📝`, text: i18n(`ui.field.extra.label`) },
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.extra.placeholder`),
            prompt: i18n(`ui.field.extra.prompt`),
          },
        ]),
      localization: () => ({
        "prompt": [
          `Write a greeting in English. Apply every bullet below exactly. Take names, hobbies, and facts only from Name, Interests, and Extra context lines when they appear. Deliver continuous wishes and wording from the bullets as a ready-to-send message only.

Salutation: choose the opening yourself from recipient, tone, occasion, gender, and Name—no fixed template. Match relationship distance; align gendered forms with Gender. With Name—use it in the address; without Name—kinship term, warm neutral opening, or lead straight with the wish. Formal tone or senior recipient: respectful salutation. Close ties: “Dear [name]”, “Hi [name]”, “My dear…”, kinship terms. Groups: plural address (“Dear team”, “Hi everyone”). Align first-person grammar with Writer settings. English throughout.`,
          `Напиши поздравление на русском языке. Строго выполни каждый пункт списка ниже. Имена, увлечения и факты — только из строк про имя, увлечения и доп. контекст, если они есть. Верни сплошные пожелания и формулировки из пунктов как готовый текст.

Обращение: подбери начало сам — по адресату, тону, поводу, полу и имени; без шаблона на все случаи; род в обращениях — по полу адресата. С именем — в обращении; без имени — по роду связи, тёплое нейтральное или сразу «Поздравляю…». Официальный тон или начальник: «Уважаемый/Уважаемая». Близким — «Дорогой/Дорогая», «Любимый/Любимая», «Родной/Родная»; друзьям — по имени или «Привет, [имя]»; коллегам — по имени или «Уважаемый/Уважаемая [имя]»; родителям и бабушке/дедушке — «Мама», «Папа», «Бабушка», «Дедушка» или имя; паре — нежно. Группе — «Дорогие коллеги», «Друзья», «Вы». Род автора — по настройке пола пишущего.`,
        ],
        "ui.field.addEmoji.label": [`Emoji`, `Эмодзи`],
        "ui.field.addEmoji.promptOff": [
          `Deliver the greeting as plain text: letters, numbers, standard punctuation, and spaces.`,
          `Только текст: буквы, цифры, обычная пунктуация и пробелы.`,
        ],
        "ui.field.addEmoji.promptOn": [
          `Use emoji generously throughout the greeting: several per sentence or short stretch where they match the mood and meaning; vary them; place them to reinforce warmth or humor; spread them so each line stays easy to read, with emoji alongside the words.`,
          `Щедро используй эмодзи по всему тексту: по нескольку на фразу, где подходят настроение и смысл; чередуй; ставь рядом со словами; строки остаются читаемыми.`,
        ],
        "ui.field.addFormatting.label": [`Markup`, `Разметка`],
        "ui.field.addFormatting.promptOff": Prompts.formatting.off,
        "ui.field.addFormatting.promptOn": Prompts.formatting.on,
        "ui.field.extra.label": [`Extra context`, `Дополнительно`],
        "ui.field.extra.placeholder": [
          `Age, date, inside joke, milestone — one short line…`,
          `Возраст, дата, шутка, контекст — одна короткая строка…`,
        ],
        "ui.field.extra.prompt": [
          `Extra context: anchor every detail you add in what this line states; build only on facts written here.`,
          `Доп. контекст: каждую деталь бери только из этой строки; не выдумывай сверх написанного.`,
        ],
        "ui.field.gender.label": [`Gender (addressee)`, `Пол адресата`],
        "ui.field.gender.option.female.label": [`Feminine`, `Женский`],
        "ui.field.gender.option.female.prompt": [
          `Use feminine agreement and address forms in gendered languages (e.g. Russian).`,
          `Женский род в согласованиях и формах обращения.`,
        ],
        "ui.field.gender.option.male.label": [`Masculine`, `Мужской`],
        "ui.field.gender.option.male.prompt": [
          `Use masculine agreement and address forms in gendered languages.`,
          `Мужской род в согласованиях и формах обращения.`,
        ],
        "ui.field.gender.option.neutral.label": [`Neutral`, `Нейтрально`],
        "ui.field.gender.option.neutral.prompt": [
          `Use gender-neutral wording and inclusive address forms wherever the language allows; keep phrasing open and welcoming.`,
          `Гендерно-нейтральные формулировки и инклюзивное обращение, где язык позволяет.`,
        ],
        "ui.field.gender.option.unspecified.label": [`Unspecified`, `Не указан`],
        "ui.field.gender.option.unspecified.prompt": [
          `Choose wording that fits the recipient; use gendered grammar where the language naturally calls for it, and keep phrasing flexible elsewhere.`,
          `Подбери формулировки под адресата; род там, где язык требует, иначе оставь гибкость.`,
        ],
        "ui.field.hobbies.label": [`Interests`, `Увлечения`],
        "ui.field.hobbies.placeholder": [
          `Hobbies, sports, fandoms — short list…`,
          `Хобби, спорт, увлечения — коротко…`,
        ],
        "ui.field.hobbies.prompt": [
          `Interests: when this line appears in the list, weave these hobbies or interests naturally into the text where they fit the mood and pacing.`,
          `Увлечения: если строка в списке, вплети хобби естественно в ритм и настроение текста.`,
        ],
        "ui.field.length.label": [`Length`, `Длина`],
        "ui.field.length.option.long.label": [`Long`, `Развёрнуто`],
        "ui.field.length.option.long.prompt": [
          `Make it longer: multiple sentences or short paragraphs.`,
          `Развёрнуто: несколько предложений или короткие абзацы.`,
        ],
        "ui.field.length.option.medium.label": [`Medium`, `Средне`],
        "ui.field.length.option.medium.prompt": [
          `Keep it medium: several sentences.`,
          `Средняя длина: несколько предложений.`,
        ],
        "ui.field.length.option.short.label": [`Short`, `Коротко`],
        "ui.field.length.option.short.prompt": [`Keep it brief: a few sentences.`, `Кратко: несколько предложений.`],
        "ui.field.name.label": [`Name`, `Имя`],
        "ui.field.name.placeholder": [`Name or how to address them…`, `Имя или как обращаться…`],
        "ui.field.name.prompt": [
          `Name: use for the opening address when present; keep spelling; if it reads like a nickname or kinship form, treat it as the preferred vocative; if absent, follow salutation rules from the main prompt.`,
          `Имя: используй в обращении, если указано; орфографию не меняй; если похоже на ласковое или родственное — считай предпочтительной формой обращения; если не указано — по правилам обращения из основного промпта.`,
        ],
        "ui.field.occasion.label": [`Occasion`, `Повод`],
        "ui.field.occasion.option.birthday.label": [`Birthday`, `День рождения`],
        "ui.field.occasion.option.birthday.prompt": [
          `Make the greeting about a birthday: wish health, joy, and a good year ahead; mention age or milestone only if Extra context provides it.`,
          `День рождения: здоровье, радость, хороший год впереди; возраст или веха — только если это есть в доп. контексте.`,
        ],
        "ui.field.occasion.option.feb_23.label": [`23 February`, `23 февраля`],
        "ui.field.occasion.option.feb_23.prompt": [
          `Make the greeting about Defender of the Fatherland Day (23 February): respect, strength, and best wishes.`,
          `23 февраля: уважение, сила, добрые пожелания.`,
        ],
        "ui.field.occasion.option.march_8.label": [`8 March`, `8 марта`],
        "ui.field.occasion.option.march_8.prompt": [
          `Make the greeting about International Women's Day (8 March): appreciation, spring, respect, warmth.`,
          `8 марта: признательность, весна, уважение, тепло.`,
        ],
        "ui.field.occasion.option.new_year.label": [`New Year`, `Новый год`],
        "ui.field.occasion.option.new_year.prompt": [
          `Make the greeting about New Year: new beginnings, celebration, hope, and good wishes for the year ahead.`,
          `Новый год: новый старт, праздник, надежда, пожелания на год.`,
        ],
        "ui.field.occasion.option.newborn.label": [`Newborn`, `Рождение ребёнка`],
        "ui.field.occasion.option.newborn.prompt": [
          `Make the greeting about a new baby: warmth for parents and a gentle welcome for the child.`,
          `Рождение ребёнка: тепло родителям и мягкое приветствие малышу.`,
        ],
        "ui.field.occasion.option.valentines.label": [`Valentine's`, `День влюблённых`],
        "ui.field.occasion.option.valentines.prompt": [
          `Make the greeting about Valentine's Day: love, partnership, tenderness.`,
          `День влюблённых: любовь, партнёрство, нежность.`,
        ],
        "ui.field.occasion.option.wedding.label": [`Wedding`, `Свадьба`],
        "ui.field.occasion.option.wedding.prompt": [
          `Make the greeting about a wedding or engagement: love, partnership, lifelong happiness.`,
          `Свадьба или помолвка: любовь, партнёрство, счастье на долгие годы.`,
        ],
        "ui.field.recipient.label": [`For whom`, `Кому`],
        "ui.field.recipient.option.acquaintance.label": [`Acquaintance`, `Знакомый`],
        "ui.field.recipient.option.acquaintance.prompt": [
          `Write for someone you know lightly: polite and friendly, warm and respectful with a light, comfortable distance.`,
          `Знакомый: вежливо и дружелюбно, тепло и с лёгкой дистанцией.`,
        ],
        "ui.field.recipient.option.boss.label": [`Boss / senior`, `Руководитель`],
        "ui.field.recipient.option.boss.prompt": [
          `Write for a manager or senior person: polite and measured; formal respectful salutation or no name in the opening.`,
          `Руководителю: вежливо и сдержанно; в начале — «Уважаемый/Уважаемая» или без имени, без фамильярности.`,
        ],
        "ui.field.recipient.option.brother.label": [`Brother`, `Брат`],
        "ui.field.recipient.option.brother.prompt": [
          `Write to your brother: sibling warmth—direct, lively, and close; peer-to-peer tone with space for shared history and light humor where it fits.`,
          `Брату: братский тон — прямо, живо, близко; место общим воспоминаниям и лёгкому юмору.`,
        ],
        "ui.field.recipient.option.colleague.label": [`Colleague`, `Коллега`],
        "ui.field.recipient.option.colleague.prompt": [
          `Write for a colleague: respectful, can be warm; open by name or with a polite address.`,
          `Коллеге: уважительно, можно тепло; в начале — по имени или «Уважаемый/Уважаемая [имя]».`,
        ],
        "ui.field.recipient.option.dad.label": [`Dad`, `Папа`],
        "ui.field.recipient.option.dad.prompt": [
          `Write to your father: respect, gratitude, warmth; child-to-Dad voice—steady and affectionate; open with “Dad” or his name.`,
          `Папе: уважение, благодарность, тепло; как ребёнок к отцу — ровно и с нежностью; в начале — «Папа» или по имени.`,
        ],
        "ui.field.recipient.option.friend.label": [`Friend`, `Друг`],
        "ui.field.recipient.option.friend.prompt": [
          `Write for a close friend: warm and direct; open by name or with a casual “Hi [name]”.`,
          `Близкому другу: тепло и прямо; в начале — по имени или «Привет, [имя]».`,
        ],
        "ui.field.recipient.option.grandma.label": [`Grandma`, `Бабушка`],
        "ui.field.recipient.option.grandma.prompt": [
          `Write to your grandmother: gentle tenderness and respect across generations; soft family tone with room for fond memory; open with “Grandma” or her name.`,
          `Бабушке: нежность и уважение между поколениями; мягкий семейный тон, место тёплым воспоминаниям; в начале — «Бабушка» или по имени.`,
        ],
        "ui.field.recipient.option.grandpa.label": [`Grandpa`, `Дедушка`],
        "ui.field.recipient.option.grandpa.prompt": [
          `Write to your grandfather: warm respect and affection across generations; calm, sturdy family tone; open with “Grandpa” or his name.`,
          `Дедушке: тёплое уважение и привязанность; спокойный надёжный семейный тон; в начале — «Дедушка» или по имени.`,
        ],
        "ui.field.recipient.option.husband.label": [`Husband`, `Муж`],
        "ui.field.recipient.option.husband.prompt": [
          `Write to your husband: intimate married tone—love, partnership, shared life; words that fit a spouse addressing her husband.`,
          `Мужу: интимный супружеский тон — любовь, союз, общая жизнь; как жена мужу.`,
        ],
        "ui.field.recipient.option.loved_one.label": [`Loved one`, `Любимый человек`],
        "ui.field.recipient.option.loved_one.prompt": [
          `Write for a loved one: intimate, warm, sincere—like a private heartfelt message; open tenderly by name or with “My dear…”.`,
          `Любимому человеку: близко, тепло, искренне — как личное послание двоих; в начале — по имени или «Любимый/Любимая», «Дорогой/Дорогая».`,
        ],
        "ui.field.recipient.option.mom.label": [`Mom`, `Мама`],
        "ui.field.recipient.option.mom.prompt": [
          `Write to your mother: warmth, gratitude, tenderness; child-to-Mom voice with the closeness of that bond; open with “Mom” or her name.`,
          `Маме: благодарность, нежность, тепло; как ребёнок к маме, с близостью этой связи; в начале — «Мама» или по имени.`,
        ],
        "ui.field.recipient.option.sister.label": [`Sister`, `Сестра`],
        "ui.field.recipient.option.sister.prompt": [
          `Write to your sister: sibling closeness—caring, open, and personal; the tone sisters share when they speak heart-to-heart.`,
          `Сестре: сестринская близость — забота, открытость, личный тон «сердце к сердцу».`,
        ],
        "ui.field.recipient.option.team.label": [`Team / group`, `Команда`],
        "ui.field.recipient.option.team.prompt": [
          `Write for a group or team: inclusive “we” tone; open with plural address (“Dear team”, “Hi everyone”).`,
          `Команде или группе: инклюзивное «мы»; в начале — «Дорогие коллеги», «Друзья» или «Вы».`,
        ],
        "ui.field.recipient.option.wife.label": [`Wife`, `Жена`],
        "ui.field.recipient.option.wife.prompt": [
          `Write to your wife: intimate married tone—love, tenderness, shared life; words that fit a spouse addressing his wife.`,
          `Жене: интимный супружеский тон — любовь, нежность, общая жизнь; как муж жене.`,
        ],
        "ui.field.recipient.option.young.label": [`Child / teen`, `Ребёнок / подросток`],
        "ui.field.recipient.option.young.prompt": [
          `Write for a child or teenager: age-appropriate and kind.`,
          `Ребёнку или подростку: по возрасту и с добротой.`,
        ],
        "ui.field.rhyme.label": [`Rhyme`, `Рифма`],
        "ui.field.rhyme.promptOff": [
          `Write the greeting in flowing prose; keep rhythm in the sentences and phrasing only.`,
          `Пиши связной прозой; ритм — только в фразах и интонации.`,
        ],
        "ui.field.rhyme.promptOn": [
          `Prefer light rhyme or rhythm where it sounds natural in the language; let the rhyme support the mood and the message.`,
          `Лёгкая рифма или ритм, где звучит естественно; рифма служит настроению и смыслу.`,
        ],
        "ui.field.tone.label": [`Tone`, `Тон`],
        "ui.field.tone.option.calm.label": [`Calm`, `Спокойный`],
        "ui.field.tone.option.calm.prompt": [
          `Keep the tone gentle and calm; soft and understated, with room to breathe.`,
          `Тон мягкий и спокойный; приглушённо, с воздухом между фразами.`,
        ],
        "ui.field.tone.option.energetic.label": [`Energetic`, `Бодрый`],
        "ui.field.tone.option.energetic.prompt": [`Keep the tone upbeat and energetic.`, `Тон бодрый и энергичный.`],
        "ui.field.tone.option.formal.label": [`Formal`, `Официальный`],
        "ui.field.tone.option.formal.prompt": [
          `Keep the tone formal and polite; if you open with an address, use a respectful salutation that fits the relationship.`,
          `Тон официальный и вежливый; обращение в начале — уважительное, по степени близости.`,
        ],
        "ui.field.tone.option.playful.label": [`Playful`, `Игривый`],
        "ui.field.tone.option.playful.prompt": [
          `Keep the tone light and playful; let humor stay gentle, good-natured, and kind toward the addressee.`,
          `Тон лёгкий и игривый; юмор добрый и безобидный к адресату.`,
        ],
        "ui.field.tone.option.poetic.label": [`Poetic`, `Лиричный`],
        "ui.field.tone.option.poetic.prompt": [
          `Use slightly elevated, lyrical wording—stay readable.`,
          `Слегка возвышенная лиричная лексика — оставайся читаемым.`,
        ],
        "ui.field.tone.option.warm.label": [`Warm`, `Тёплый`],
        "ui.field.tone.option.warm.prompt": [`Keep the tone warm and sincere.`, `Тон тёплый и искренний.`],
        "ui.field.writerGender.label": [`Writer (gender)`, `Пол (кто пишет)`],
        "ui.field.writerGender.option.female.label": [`Feminine`, `Женский`],
        "ui.field.writerGender.option.female.prompt": [
          `Shape the greeting as from a woman writing: in gendered languages, use first-person feminine agreement whenever the writer refers to herself.`,
          `От женщины: в языках с родом — женское согласование от первого лица о себе.`,
        ],
        "ui.field.writerGender.option.male.label": [`Masculine`, `Мужской`],
        "ui.field.writerGender.option.male.prompt": [
          `Shape the greeting as from a man writing: in gendered languages, use first-person masculine agreement whenever the writer refers to himself.`,
          `От мужчины: в языках с родом — мужское согласование от первого лица о себе.`,
        ],
        "ui.field.writerGender.option.neutral.label": [`Neutral`, `Нейтрально`],
        "ui.field.writerGender.option.neutral.prompt": [
          `Use gender-neutral first-person wording for the sender where the language allows; keep the voice steady and inclusive.`,
          `Нейтральное первое лицо отправителя, где язык позволяет; ровный инклюзивный голос.`,
        ],
        "ui.field.writerGender.option.unspecified.label": [`Unspecified`, `Не указан`],
        "ui.field.writerGender.option.unspecified.prompt": [
          `Let the sender’s voice stay flexible in first person; choose natural first-person wording without locking every phrase to one gendered self-reference.`,
          `Гибкое первое лицо; естественные формулировки без жёсткой привязки каждой фразы к роду пишущего.`,
        ],
      }),
    }),
  ],
  meta,
};
