// cspell:disable
import { Flow, type Preset } from "..";

const meta = {
  description: [
    `Upload a photo and pick look, lighting, and background`,
    `Загрузите фото и выберите образ, свет и фон`,
  ],
  emoji: `🎛️`,
  group: `edit`,
  title: [`Photo lab`, `Фотолаборатория`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [
        `I want to improve the quality of my photo — color, light, or sharpness.`,
        `Хочу улучшить качество фото — цвет, свет или резкость.`,
      ],
      skill: `image-editing`,
      tools: [`ask`, `date-time`, `edit-image`, `look-image`, `publish-image`],
    }),
    Flow.staticImageEdit(
      meta,
      ({ form, i18n }) =>
        form([
          {
            id: `image`,
            kind: `image_input`,
            label: { emoji: `📷`, text: i18n(`ui.field.image.label`) },
            pickLabel: i18n(`ui.field.image.pickLabel`),
          },
          {
            default: `noticeable`,
            id: `degree`,
            kind: `single_choice`,
            label: { emoji: `✨`, text: i18n(`ui.field.degree.label`) },
            options: [
              {
                label: { emoji: `🪶`, text: i18n(`ui.field.degree.option.light.label`) },
                prompt: i18n(`ui.field.degree.option.light.prompt`),
                value: `light`,
              },
              {
                label: { emoji: `👀`, text: i18n(`ui.field.degree.option.noticeable.label`) },
                prompt: i18n(`ui.field.degree.option.noticeable.prompt`),
                value: `noticeable`,
              },
              {
                label: { emoji: `🎭`, text: i18n(`ui.field.degree.option.heavy.label`) },
                prompt: i18n(`ui.field.degree.option.heavy.prompt`),
                value: `heavy`,
              },
            ],
          },
          {
            default: `natural`,
            id: `look`,
            kind: `single_choice`,
            label: { emoji: `🖼️`, text: i18n(`ui.field.look.label`) },
            options: [
              {
                label: { emoji: `📸`, text: i18n(`ui.field.look.option.natural.label`) },
                prompt: i18n(`ui.field.look.option.natural.prompt`),
                value: `natural`,
              },
              {
                label: { emoji: `🎬`, text: i18n(`ui.field.look.option.cinematic.label`) },
                prompt: i18n(`ui.field.look.option.cinematic.prompt`),
                value: `cinematic`,
              },
              {
                label: { emoji: `🎞️`, text: i18n(`ui.field.look.option.vintage.label`) },
                prompt: i18n(`ui.field.look.option.vintage.prompt`),
                value: `vintage`,
              },
              {
                label: { emoji: `📰`, text: i18n(`ui.field.look.option.editorial.label`) },
                prompt: i18n(`ui.field.look.option.editorial.prompt`),
                value: `editorial`,
              },
              {
                label: { emoji: `🇯🇵`, text: i18n(`ui.field.look.option.anime.label`) },
                prompt: i18n(`ui.field.look.option.anime.prompt`),
                value: `anime`,
              },
              {
                label: { emoji: `🧸`, text: i18n(`ui.field.look.option.cartoon.label`) },
                prompt: i18n(`ui.field.look.option.cartoon.prompt`),
                value: `cartoon`,
              },
              {
                label: { emoji: `💥`, text: i18n(`ui.field.look.option.comic.label`) },
                prompt: i18n(`ui.field.look.option.comic.prompt`),
                value: `comic`,
              },
              {
                label: { emoji: `🎨`, text: i18n(`ui.field.look.option.watercolor.label`) },
                prompt: i18n(`ui.field.look.option.watercolor.prompt`),
                value: `watercolor`,
              },
              {
                label: { emoji: `🖌️`, text: i18n(`ui.field.look.option.oil.label`) },
                prompt: i18n(`ui.field.look.option.oil.prompt`),
                value: `oil`,
              },
              {
                label: { emoji: `✏️`, text: i18n(`ui.field.look.option.sketch.label`) },
                prompt: i18n(`ui.field.look.option.sketch.prompt`),
                value: `sketch`,
              },
              {
                label: { emoji: `👾`, text: i18n(`ui.field.look.option.pixel.label`) },
                prompt: i18n(`ui.field.look.option.pixel.prompt`),
                value: `pixel`,
              },
              {
                label: { emoji: `🧊`, text: i18n(`ui.field.look.option.3d.label`) },
                prompt: i18n(`ui.field.look.option.3d.prompt`),
                value: `3d`,
              },
              {
                label: { emoji: `☁️`, text: i18n(`ui.field.look.option.dreamy.label`) },
                prompt: i18n(`ui.field.look.option.dreamy.prompt`),
                value: `dreamy`,
              },
              {
                label: { emoji: `🌃`, text: i18n(`ui.field.look.option.cyberpunk.label`) },
                prompt: i18n(`ui.field.look.option.cyberpunk.prompt`),
                value: `cyberpunk`,
              },
            ],
          },
          {
            default: `daylight`,
            id: `light`,
            kind: `single_choice`,
            label: { emoji: `💡`, text: i18n(`ui.field.light.label`) },
            options: [
              {
                label: { emoji: `☀️`, text: i18n(`ui.field.light.option.daylight.label`) },
                prompt: i18n(`ui.field.light.option.daylight.prompt`),
                value: `daylight`,
              },
              {
                label: { emoji: `🌇`, text: i18n(`ui.field.light.option.golden.label`) },
                prompt: i18n(`ui.field.light.option.golden.prompt`),
                value: `golden`,
              },
              {
                label: { emoji: `🌤️`, text: i18n(`ui.field.light.option.soft.label`) },
                prompt: i18n(`ui.field.light.option.soft.prompt`),
                value: `soft`,
              },
              {
                label: { emoji: `☁️`, text: i18n(`ui.field.light.option.overcast.label`) },
                prompt: i18n(`ui.field.light.option.overcast.prompt`),
                value: `overcast`,
              },
              {
                label: { emoji: `🎭`, text: i18n(`ui.field.light.option.dramatic.label`) },
                prompt: i18n(`ui.field.light.option.dramatic.prompt`),
                value: `dramatic`,
              },
              {
                label: { emoji: `💡`, text: i18n(`ui.field.light.option.studio.label`) },
                prompt: i18n(`ui.field.light.option.studio.prompt`),
                value: `studio`,
              },
              {
                label: { emoji: `🌃`, text: i18n(`ui.field.light.option.neon.label`) },
                prompt: i18n(`ui.field.light.option.neon.prompt`),
                value: `neon`,
              },
            ],
          },
          {
            default: `natural`,
            id: `color`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.color.label`) },
            options: [
              {
                label: { emoji: `🌿`, text: i18n(`ui.field.color.option.natural.label`) },
                prompt: i18n(`ui.field.color.option.natural.prompt`),
                value: `natural`,
              },
              {
                label: { emoji: `🔥`, text: i18n(`ui.field.color.option.warm.label`) },
                prompt: i18n(`ui.field.color.option.warm.prompt`),
                value: `warm`,
              },
              {
                label: { emoji: `❄️`, text: i18n(`ui.field.color.option.cool.label`) },
                prompt: i18n(`ui.field.color.option.cool.prompt`),
                value: `cool`,
              },
              {
                label: { emoji: `🌈`, text: i18n(`ui.field.color.option.vivid.label`) },
                prompt: i18n(`ui.field.color.option.vivid.prompt`),
                value: `vivid`,
              },
              {
                label: { emoji: `🪨`, text: i18n(`ui.field.color.option.muted.label`) },
                prompt: i18n(`ui.field.color.option.muted.prompt`),
                value: `muted`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.color.option.mono.label`) },
                prompt: i18n(`ui.field.color.option.mono.prompt`),
                value: `mono`,
              },
            ],
          },
          {
            default: `keep`,
            id: `background`,
            kind: `single_choice`,
            label: { emoji: `🖼️`, text: i18n(`ui.field.background.label`) },
            options: [
              {
                label: { emoji: `✅`, text: i18n(`ui.field.background.option.keep.label`) },
                prompt: i18n(`ui.field.background.option.keep.prompt`),
                value: `keep`,
              },
              {
                label: { emoji: `🌫️`, text: i18n(`ui.field.background.option.blur.label`) },
                prompt: i18n(`ui.field.background.option.blur.prompt`),
                value: `blur`,
              },
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.background.option.remove.label`) },
                prompt: i18n(`ui.field.background.option.remove.prompt`),
                value: `remove`,
              },
              {
                label: { emoji: `🎬`, text: i18n(`ui.field.background.option.neutral.label`) },
                prompt: i18n(`ui.field.background.option.neutral.prompt`),
                value: `neutral`,
              },
              {
                label: { emoji: `🌑`, text: i18n(`ui.field.background.option.darken.label`) },
                prompt: i18n(`ui.field.background.option.darken.prompt`),
                value: `darken`,
              },
            ],
          },
          {
            default: `keep`,
            id: `face`,
            kind: `single_choice`,
            label: { emoji: `🙂`, text: i18n(`ui.field.face.label`) },
            options: [
              {
                label: { emoji: `🚫`, text: i18n(`ui.field.face.option.keep.label`) },
                prompt: i18n(`ui.field.face.option.keep.prompt`),
                value: `keep`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.face.option.smooth.label`) },
                prompt: i18n(`ui.field.face.option.smooth.prompt`),
                value: `smooth`,
              },
              {
                label: { emoji: `💎`, text: i18n(`ui.field.face.option.glamour.label`) },
                prompt: i18n(`ui.field.face.option.glamour.prompt`),
                value: `glamour`,
              },
            ],
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
      {
        localization: () => ({
          "prompt": [
            `Edit the uploaded image. Every bullet below is a hard constraint. Keep the main subject recognizable unless degree of change allows stronger stylization. No watermarks, no new readable text or brand logos.`,
            `Отредактируй загруженное изображение. Каждый пункт ниже — жёсткое ограничение. Сохрани главный объект узнаваемым, если степень переработки не разрешает сильнее стилизовать. Без водяных знаков и читаемых логотипов.`,
          ],
          "ui.field.background.label": [`Background`, `Фон`],
          "ui.field.background.option.blur.label": [`Blur`, `Размыть`],
          "ui.field.background.option.blur.prompt": [
            `Blur the background with natural bokeh; keep the subject sharp and separated.`,
            `Размыть фон с естественным боке; объект остаётся чётким и отделённым.`,
          ],
          "ui.field.background.option.darken.label": [`Darken`, `Затемнить`],
          "ui.field.background.option.darken.prompt": [
            `Darken or vignette the background so the subject stands out; subject stays well lit.`,
            `Затемнить фон или виньетку, чтобы выделить объект; сам объект хорошо освещён.`,
          ],
          "ui.field.background.option.keep.label": [`Keep`, `Оставить`],
          "ui.field.background.option.keep.prompt": [
            `Keep the background as in the original; improve it only if exposure or color needs fixing.`,
            `Оставить фон как на оригинале; поправить только экспозицию или цвет при необходимости.`,
          ],
          "ui.field.background.option.neutral.label": [`Plain`, `Нейтральный`],
          "ui.field.background.option.neutral.prompt": [
            `Replace background with a clean neutral studio backdrop (soft gray, white, or beige).`,
            `Заменить фон на чистый нейтральный студийный (мягкий серый, белый или бежевый).`,
          ],
          "ui.field.background.option.remove.label": [`Remove`, `Убрать`],
          "ui.field.background.option.remove.prompt": [
            `Remove the background; subject on clean white or transparent-looking backdrop.`,
            `Убрать фон; объект на чистом белом или прозрачном фоне.`,
          ],
          "ui.field.color.label": [`Color mood`, `Цветовая гамма`],
          "ui.field.color.option.cool.label": [`Cool`, `Холодная`],
          "ui.field.color.option.cool.prompt": [
            `Cool palette: blue-gray shadows, crisp whites, restrained warmth.`,
            `Холодная палитра: сине-серые тени, чистый белый, сдержанное тепло.`,
          ],
          "ui.field.color.option.mono.label": [`Black & white`, `Чёрно-белое`],
          "ui.field.color.option.mono.prompt": [
            `Rich black-and-white with full tonal range; preserve skin texture.`,
            `Насыщенное ч/б с полным тональным диапазоном; сохрани фактуру кожи.`,
          ],
          "ui.field.color.option.muted.label": [`Muted`, `Приглушённая`],
          "ui.field.color.option.muted.prompt": [
            `Soft desaturated palette; dusty or earthy tones; calm exposure.`,
            `Мягкая десатурация; пыльные или землистые тона; спокойная экспозиция.`,
          ],
          "ui.field.color.option.natural.label": [`Natural`, `Как в жизни`],
          "ui.field.color.option.natural.prompt": [
            `Realistic colors; fix white balance only where clearly needed.`,
            `Реалистичные цвета; поправь баланс белого только где явно нужно.`,
          ],
          "ui.field.color.option.vivid.label": [`Vivid`, `Яркая`],
          "ui.field.color.option.vivid.prompt": [
            `Boost saturation and local contrast; punchy colors without neon clipping.`,
            `Усиль насыщенность и локальный контраст; сочные цвета без неонового пересвета.`,
          ],
          "ui.field.color.option.warm.label": [`Warm`, `Тёплая`],
          "ui.field.color.option.warm.prompt": [
            `Warm palette: golden highlights, amber shadows, pleasant skin tones.`,
            `Тёплая палитра: золотые блики, янтарные тени, приятные тона кожи.`,
          ],
          "ui.field.degree.label": [`How much to change`, `Насколько менять`],
          "ui.field.degree.option.heavy.label": [`Heavy stylization`, `Сильная стилизация`],
          "ui.field.degree.option.heavy.prompt": [
            `Strong restyle: the chosen look dominates; subject pose and identity stay recognizable.`,
            `Сильная переработка: выбранный образ на первом плане; поза и личность объекта узнаваемы.`,
          ],
          "ui.field.degree.option.light.label": [`Light touch-up`, `Лёгкая правка`],
          "ui.field.degree.option.light.prompt": [
            `Light retouch only: exposure, color, small flaws; photo stays natural and close to the original.`,
            `Лёгкая ретушь: экспозиция, цвет, мелкие огрехи; фото остаётся натуральным и близким к оригиналу.`,
          ],
          "ui.field.degree.option.noticeable.label": [`Noticeable changes`, `Заметные изменения`],
          "ui.field.degree.option.noticeable.prompt": [
            `Clear visible changes to style, light, and color while keeping the scene believable.`,
            `Заметные изменения стиля, света и цвета; сцена остаётся правдоподобной.`,
          ],
          "ui.field.extra.label": [`Anything else`, `Ещё пожелание`],
          "ui.field.extra.placeholder": [
            `e.g. smoother skin, greener grass, add snow…`,
            `Напр. сгладить кожу, зеленее трава, добавить снег…`,
          ],
          "ui.field.extra.prompt": [
            `Optional extra note (one short line):`,
            `Дополнительное пожелание (одна короткая строка):`,
          ],
          "ui.field.face.label": [`Face & skin`, `Лицо и кожа`],
          "ui.field.face.option.glamour.label": [`Magazine`, `Журнальная`],
          "ui.field.face.option.glamour.prompt": [
            `Polished magazine retouch on faces: even skin, subtle glow, keep natural features.`,
            `Журнальная ретушь лиц: ровная кожа, лёгкое сияние, черты остаются натуральными.`,
          ],
          "ui.field.face.option.keep.label": [`Keep as is`, `Не трогать`],
          "ui.field.face.option.keep.prompt": [
            `Do not retouch faces or skin beyond what global color and light already change.`,
            `Не ретушировать лица и кожу сверх того, что дают общий цвет и свет.`,
          ],
          "ui.field.face.option.smooth.label": [`Light smooth`, `Лёгкая ретушь`],
          "ui.field.face.option.smooth.prompt": [
            `Gentle skin smoothing and blemish cleanup; pores and identity stay natural.`,
            `Мягкое сглаживание кожи и уборка мелких дефектов; поры и черты остаются натуральными.`,
          ],
          "ui.field.image.label": [`Photo`, `Фото`],
          "ui.field.image.pickLabel": [`Choose file`, `Выбрать файл`],
          "ui.field.light.label": [`Lighting`, `Освещение`],
          "ui.field.light.option.daylight.label": [`Daylight`, `Дневной свет`],
          "ui.field.light.option.daylight.prompt": [
            `Bright natural daylight; soft realistic shadows; neutral white balance.`,
            `Яркий дневной свет; мягкие реалистичные тени; нейтральный баланс белого.`,
          ],
          "ui.field.light.option.dramatic.label": [`Dramatic`, `Драматичный`],
          "ui.field.light.option.dramatic.prompt": [
            `Directional light, deeper shadows, higher contrast, cinematic mood.`,
            `Направленный свет, глубже тени, выше контраст, кинематографичное настроение.`,
          ],
          "ui.field.light.option.golden.label": [`Golden hour`, `Золотой час`],
          "ui.field.light.option.golden.prompt": [
            `Warm low sun, golden rim light, long soft shadows.`,
            `Низкое тёплое солнце, золотой контровой, длинные мягкие тени.`,
          ],
          "ui.field.light.option.neon.label": [`Night neon`, `Ночь и неон`],
          "ui.field.light.option.neon.prompt": [
            `Night scene with colored neon or city glow; reflective highlights on surfaces.`,
            `Ночная сцена с цветным неоном или городским свечением; отражающие блики.`,
          ],
          "ui.field.light.option.overcast.label": [`Overcast`, `Пасмурно`],
          "ui.field.light.option.overcast.prompt": [
            `Soft even overcast light; low contrast; flattering and calm.`,
            `Мягкий ровный пасмурный свет; низкий контраст; спокойно и льстит лицам.`,
          ],
          "ui.field.light.option.soft.label": [`Soft`, `Мягкий`],
          "ui.field.light.option.soft.prompt": [
            `Diffused soft light; gentle shadows; flattering on faces.`,
            `Рассеянный мягкий свет; деликатные тени; льстит лицам.`,
          ],
          "ui.field.light.option.studio.label": [`Studio`, `Студийный`],
          "ui.field.light.option.studio.prompt": [
            `Clean studio lighting: even key light, controlled shadows, product-ready clarity.`,
            `Чистый студийный свет: ровный ключ, контролируемые тени, чёткость как в каталоге.`,
          ],
          "ui.field.look.label": [`Look`, `Образ`],
          "ui.field.look.option.3d.label": [`3D render`, `3D-рендер`],
          "ui.field.look.option.3d.prompt": [
            `High-quality 3D render look: smooth materials, clean lighting, Pixar-like polish.`,
            `Качественный 3D-рендер: гладкие материалы, чистый свет, полировка в духе Pixar.`,
          ],
          "ui.field.look.option.anime.label": [`Anime`, `Аниме`],
          "ui.field.look.option.anime.prompt": [
            `Japanese anime style: clean linework, expressive eyes, cel shading, vibrant anime color.`,
            `Японское аниме: чистый контур, выразительные глаза, cel-shading, яркая аниме-палитра.`,
          ],
          "ui.field.look.option.cartoon.label": [`Cartoon`, `Мультфильм`],
          "ui.field.look.option.cartoon.prompt": [
            `Western cartoon style: bold shapes, simplified textures, playful proportions, bright color.`,
            `Западный мультфильм: смелые формы, упрощённые текстуры, игривые пропорции, яркий цвет.`,
          ],
          "ui.field.look.option.cinematic.label": [`Cinematic`, `Кино`],
          "ui.field.look.option.cinematic.prompt": [
            `Cinematic color grade: teal-orange hints, wide dynamic range, filmic contrast.`,
            `Кинематографичный грейд: лёгкий teal-orange, широкий динамический диапазон, плёночный контраст.`,
          ],
          "ui.field.look.option.comic.label": [`Comic`, `Комикс`],
          "ui.field.look.option.comic.prompt": [
            `Comic book style: ink outlines, halftone or flat fills, dynamic contrast.`,
            `Комикс: контур тушью, полутон или плоские заливки, динамичный контраст.`,
          ],
          "ui.field.look.option.cyberpunk.label": [`Cyberpunk`, `Киберпанк`],
          "ui.field.look.option.cyberpunk.prompt": [
            `Cyberpunk sci-fi: neon accents, rain-slick surfaces, high-tech grit, moody night city feel.`,
            `Киберпанк: неоновые акценты, мокрые поверхности, хай-тек грязь, ночной город.`,
          ],
          "ui.field.look.option.dreamy.label": [`Dreamy`, `Мечтательный`],
          "ui.field.look.option.dreamy.prompt": [
            `Soft glow, gentle haze, pastel lift; romantic fairy-tale atmosphere.`,
            `Мягкое свечение, лёгкая дымка, пастель; романтичная сказочная атмосфера.`,
          ],
          "ui.field.look.option.editorial.label": [`Magazine`, `Журнал`],
          "ui.field.look.option.editorial.prompt": [
            `Magazine editorial photo: crisp detail, polished look, clean composition.`,
            `Журнальное фото: чёткие детали, вылизанный вид, чистая композиция.`,
          ],
          "ui.field.look.option.natural.label": [`Realistic photo`, `Реалистичное фото`],
          "ui.field.look.option.natural.prompt": [
            `Clean realistic photograph; true-to-life textures; minimal stylization.`,
            `Чистое реалистичное фото; правдивые текстуры; минимум стилизации.`,
          ],
          "ui.field.look.option.oil.label": [`Oil painting`, `Масло`],
          "ui.field.look.option.oil.prompt": [
            `Classical oil painting: visible brushstrokes, rich pigments, painterly depth.`,
            `Классическая масляная живопись: заметные мазки, насыщенные пигменты, живописная глубина.`,
          ],
          "ui.field.look.option.pixel.label": [`Pixel art`, `Пиксель-арт`],
          "ui.field.look.option.pixel.prompt": [
            `Retro pixel art: limited palette, crisp pixels, 16-bit game aesthetic.`,
            `Ретро пиксель-арт: ограниченная палитра, чёткие пиксели, эстетика 16-bit игр.`,
          ],
          "ui.field.look.option.sketch.label": [`Pencil sketch`, `Карандаш`],
          "ui.field.look.option.sketch.prompt": [
            `Hand-drawn pencil sketch: graphite lines, shading hatching, paper texture.`,
            `Карандашный скетч: графитовые линии, штриховка, текстура бумаги.`,
          ],
          "ui.field.look.option.vintage.label": [`Vintage film`, `Плёночное фото`],
          "ui.field.look.option.vintage.prompt": [
            `Analog film look: subtle grain, faded blacks, gentle color shift, nostalgic mood.`,
            `Плёночное фото: лёгкое зерно, приглушённые чёрные, мягкий цветовой сдвиг, ностальгия.`,
          ],
          "ui.field.look.option.watercolor.label": [`Watercolor`, `Акварель`],
          "ui.field.look.option.watercolor.prompt": [
            `Watercolor illustration: soft washes, bleeding edges, paper grain, light pigment.`,
            `Акварель: мягкие заливки, растекающиеся края, зернистая бумага, лёгкий пигмент.`,
          ],
        }),
        resolve: ({ answers: { image } }) => (image === undefined ? undefined : { images: [image] }),
      },
    ),
  ],
  meta,
};
