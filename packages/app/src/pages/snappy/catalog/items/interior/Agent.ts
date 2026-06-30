import { Prompts } from "../../shared";
// cspell:disable
import { StaticVisualAgent } from "../../static-agent";

export const Agent = StaticVisualAgent(
  () =>
    ({
      "meta.description": [
        `Room render for renovation planning — style, palette, light, staging`,
        `Визуализация комнаты под ремонт — стиль, палитра, свет, наполнение`,
      ],
      "meta.prompt": Prompts.visual.joinMeta([
        `Build **one** image-generation prompt. Use every bullet below as hard constraints. Target: **single interior visualization** for renovation planning—photorealistic architectural photo or high-end interior 3D render. Exclude: floor plans, blueprints, top-down layouts, isometric dollhouse cutaways, exterior-only shots. Merge: room type, design style, **exact palette named in the tabs**, staging level, floor material, lighting recipe, camera framing. If optional detail names objects, materials, or colors, weave them in without contradicting the tabs. Forbid: people and pets unless optional detail explicitly requests them; readable brand logos on products; posters or signs with legible words—use abstract art or texture only. Demand crisp materials, believable scale, clean composition.`,
        `Собери **один** промпт для генерации изображения. Каждый пункт ниже — жёсткое ограничение. Цель: **одна** визуализация интерьера для планирования ремонта — фотореализм или премиум 3D-рендер. Исключи: планы этажей, чертежи, вид сверху, изометрические «разрезы», только фасад. Объедини: тип комнаты, стиль, **палитра по названию вкладок**, наполнение, пол, свет, ракурс. Уточнение с предметами/материалами/цветами вплети без противоречий вкладкам. Запрет: люди и питомцы, если явно не запрошено; читаемые логотипы; плакаты с текстом — только абстракция или фактура. Требуй чёткие материалы, масштаб, композицию.`,
      ]),
      "meta.title": [`Interior`, `Интерьер`],
      "ui.field.camera.label": [`Camera`, `Камера`],
      "ui.field.camera.option.corner.label": [`Corner`, `Из угла`],
      "ui.field.camera.option.corner.prompt": [
        `Frame from a corner looking diagonally across—maximize depth and both wall planes.`,
        `Ракурс из угла по диагонали — максимум глубины и обеих плоскостей стен.`,
      ],
      "ui.field.camera.option.focal_wall.label": [`Feature wall`, `Акцентная стена`],
      "ui.field.camera.option.focal_wall.prompt": [
        `Frame tighter on one feature wall with furniture in foreground—material and styling readable.`,
        `Крупнее одну акцентную стену с мебелью на переднем плане — читаемы материал и стиль.`,
      ],
      "ui.field.camera.option.straight_on.label": [`Straight-on`, `Фронтально`],
      "ui.field.camera.option.straight_on.prompt": [
        `Frame straight-on to a hero wall or symmetrical composition—architectural elevation feel.`,
        `Фронтально к герой-стене или симметричной композиции — ощущение архитектурного фасада.`,
      ],
      "ui.field.camera.option.wide.label": [`Wide shot`, `Широкий план`],
      "ui.field.camera.option.wide.prompt": [
        `Frame wide-angle one-point perspective showing most of the room volume and ceiling line.`,
        `Широкий ракурс в одну точку схода — большая часть объёма комнаты и линия потолка.`,
      ],
      "ui.field.extra.label": [`Optional detail`, `Уточнение`],
      "ui.field.extra.placeholder": [
        `e.g. emerald sofa, fluted panels, terrazzo…`,
        `Напр. диван изумрудный, рейки на стене, терраццо…`,
      ],
      "ui.field.extra.prompt": [
        `Optional furniture, material, or layout note (one short line):`,
        `Необязательно: мебель, материал или планировка (одна короткая строка):`,
      ],
      "ui.field.floor.label": [`Floor`, `Пол`],
      "ui.field.floor.option.carpet.label": [`Carpet / rug`, `Ковёр`],
      "ui.field.floor.option.carpet.prompt": [
        `Specify neutral low-pile wall-to-wall or large area rug; describe texture and edge clean.`,
        `Нейтральный низкий ворс wall-to-wall или большой ковёр; опиши фактуру и аккуратный край.`,
      ],
      "ui.field.floor.option.concrete.label": [`Concrete`, `Бетон`],
      "ui.field.floor.option.concrete.prompt": [
        `Specify polished concrete or microcement floor; subtle variation, no harsh stains.`,
        `Полированный бетон или микроцемент; лёгкая вариация, без грязных пятен.`,
      ],
      "ui.field.floor.option.tile_dark.label": [`Dark tile`, `Тёмная плитка`],
      "ui.field.floor.option.tile_dark.prompt": [
        `Specify large-format charcoal or slate-look tiles; matte or satin.`,
        `Крупноформатная тёмная плитка под сланец/уголь; матовая или сатин.`,
      ],
      "ui.field.floor.option.tile_light.label": [`Light tile`, `Светлая плитка`],
      "ui.field.floor.option.tile_light.prompt": [
        `Specify large-format light stone-look or porcelain tiles; minimal grout contrast.`,
        `Крупноформатная светлая плитка под камень/фарфор; минимальный контраст швов.`,
      ],
      "ui.field.floor.option.wood_dark.label": [`Dark wood`, `Тёмное дерево`],
      "ui.field.floor.option.wood_dark.prompt": [
        `Specify dark-stained wide-plank wood flooring.`,
        `Тёмный широкий паркет/инженерная доска с пропиткой.`,
      ],
      "ui.field.floor.option.wood_light.label": [`Light wood`, `Светлое дерево`],
      "ui.field.floor.option.wood_light.prompt": [
        `Specify wide-plank light oak or maple flooring with subtle grain.`,
        `Светлый дуб или клён, широкая доска, едва заметный рисунок волокон.`,
      ],
      "ui.field.light.label": [`Light`, `Свет`],
      "ui.field.light.option.accent_dramatic.label": [`Accent drama`, `Акценты`],
      "ui.field.light.option.accent_dramatic.prompt": [
        `Use directional accent spots on key pieces or art; higher contrast sculptural lighting.`,
        `Направленные акценты на предметы или искусство; контрастный скульптурный свет.`,
      ],
      "ui.field.light.option.daylight.label": [`Daylight`, `День`],
      "ui.field.light.option.daylight.prompt": [
        `Light with bright natural daylight through windows; soft realistic shadows; neutral white balance.`,
        `Яркий дневной свет из окон; мягкие реалистичные тени; нейтральный баланс белого.`,
      ],
      "ui.field.light.option.evening_cozy.label": [`Evening cozy`, `Вечер`],
      "ui.field.light.option.evening_cozy.prompt": [
        `Light with warm ambient lamps, floor uplight, and subtle indirect strip—pools of cozy light.`,
        `Тёплые торшеры и лампы, подсветка пола и мягкие полосы — уютные пятна света.`,
      ],
      "ui.field.light.option.golden.label": [`Golden hour`, `Золотой час`],
      "ui.field.light.option.golden.prompt": [
        `Light with warm low sun; golden beams and gentle bounce on walls.`,
        `Низкое тёплое солнце; золотые лучи и мягкий отскок на стены.`,
      ],
      "ui.field.light.option.soft_overcast.label": [`Soft overcast`, `Пасмурно`],
      "ui.field.light.option.soft_overcast.prompt": [
        `Light with soft even overcast daylight; low contrast; calm exposure.`,
        `Ровный пасмурный дневной свет; низкий контраст; спокойная экспозиция.`,
      ],
      "ui.field.palette.label": [`Palette`, `Палитра`],
      "ui.field.palette.option.cool_gray.label": [`Cool gray`, `Холодный серый`],
      "ui.field.palette.option.cool_gray.prompt": [
        `Use cool grays with crisp white; allow brushed nickel or chrome accents sparingly.`,
        `Холодные серые с чистым белым; немного матового никеля или хрома.`,
      ],
      "ui.field.palette.option.dark_moody.label": [`Dark moody`, `Тёмное настроение`],
      "ui.field.palette.option.dark_moody.prompt": [
        `Use dark walls or cabinetry with warm wood and amber light for depth—still readable detail.`,
        `Тёмные стены или фасады с тёплым деревом и янтарным светом — детали остаются читаемыми.`,
      ],
      "ui.field.palette.option.earth.label": [`Earth`, `Земля`],
      "ui.field.palette.option.earth.prompt": [
        `Use earth tones: terracotta, clay, olive, walnut, stone, sand.`,
        `Земляные тона: терракота, глина, оливковый, орех, камень, песок.`,
      ],
      "ui.field.palette.option.monochrome.label": [`Monochrome`, `Монохром`],
      "ui.field.palette.option.monochrome.prompt": [
        `Use black, white, and gray only; strong planar contrast.`,
        `Только чёрный, белый и серый; сильный плоскостной контраст.`,
      ],
      "ui.field.palette.option.pastel_pop.label": [`Pastel accents`, `Пастель + акцент`],
      "ui.field.palette.option.pastel_pop.prompt": [
        `Use soft pastel base walls with one or two controlled accent colors in furniture or decor.`,
        `Мягкая пастельная база стен и один–два контролируемых акцента в мебели или декоре.`,
      ],
      "ui.field.palette.option.warm_neutral.label": [`Warm neutral`, `Тёплый нейтраль`],
      "ui.field.palette.option.warm_neutral.prompt": [
        `Use warm neutrals: cream, beige, camel, greige, warm white walls.`,
        `Тёплые нейтрали: крем, беж, верблюд, грейдж, тёплый белый на стенах.`,
      ],
      "ui.field.palette.option.white_air.label": [`White airy`, `Белое облако`],
      "ui.field.palette.option.white_air.prompt": [
        `Use predominantly white and pale tones; bright gallery-like airiness.`,
        `Преобладают белый и светлые тона; светлая «галерейная» воздушность.`,
      ],
      "ui.field.room.label": [`Room`, `Комната`],
      "ui.field.room.option.bathroom.label": [`Bathroom`, `Ванная`],
      "ui.field.room.option.bathroom.prompt": [
        `Depict a bathroom; show vanity, mirror zone, fixtures, and wall/floor tile readably; spa-clean.`,
        `Ванная: умывальник, зеркало, сантехника, плитка стен и пола читаемо; «спа»-чистота.`,
      ],
      "ui.field.room.option.bedroom.label": [`Bedroom`, `Спальня`],
      "ui.field.room.option.bedroom.prompt": [
        `Depict a bedroom; center the bed; include nightstands or wardrobe cues for scale.`,
        `Спальня: кровать в центре; тумбы или шкаф для масштаба.`,
      ],
      "ui.field.room.option.dining.label": [`Dining`, `Столовая`],
      "ui.field.room.option.dining.prompt": [
        `Depict a dining zone; table and chairs as hero; pendant or linear light above table.`,
        `Зона стола: стол и стулья в фокусе; подвес или линейный свет над столом.`,
      ],
      "ui.field.room.option.hall.label": [`Hall`, `Прихожая`],
      "ui.field.room.option.hall.prompt": [
        `Depict an entryway or corridor; emphasize depth; console, bench, or built-in storage optional.`,
        `Прихожая или коридор; акцент на глубину; консоль, скамья или встроенное хранение по желанию.`,
      ],
      "ui.field.room.option.kids.label": [`Kids`, `Детская`],
      "ui.field.room.option.kids.prompt": [
        `Depict a children's room; playful but tidy; safe layout; age-neutral styling.`,
        `Детская: игриво, но аккуратно; безопасная планировка; стиль без жёсткого возраста.`,
      ],
      "ui.field.room.option.kitchen.label": [`Kitchen`, `Кухня`],
      "ui.field.room.option.kitchen.prompt": [
        `Depict a kitchen; show cabinetry run, countertop, backsplash, and hood or upper cabinets legibly.`,
        `Кухня: ряд фасадов, столешница, фартук, вытяжка или верхние шкафы читаемы.`,
      ],
      "ui.field.room.option.living.label": [`Living`, `Гостиная`],
      "ui.field.room.option.living.prompt": [
        `Depict a living room; show seating zone and at least one full wall treatment clearly.`,
        `Гостиная: зона дивана и хотя бы одна целая стена/отделка хорошо видны.`,
      ],
      "ui.field.room.option.office.label": [`Office`, `Кабинет`],
      "ui.field.room.option.office.prompt": [
        `Depict a home office; desk workspace plus storage wall or shelving visible.`,
        `Домашний офис: рабочий стол и стена хранения или полки в кадре.`,
      ],
      "ui.field.stage.label": [`Fill`, `Наполнение`],
      "ui.field.stage.option.full_staged.label": [`Full staging`, `Полный антураж`],
      "ui.field.stage.option.full_staged.prompt": [
        `Show magazine-complete staging: full furniture set, layered decor, styled surfaces.`,
        `Как в журнале: полный комплект мебели, декор, стилизованные поверхности.`,
      ],
      "ui.field.stage.option.light_furnished.label": [`Essentials`, `Минимум`],
      "ui.field.stage.option.light_furnished.prompt": [
        `Show only essential pieces defining function; no heavy styling props.`,
        `Только необходимое для функции; без тяжёлого реквизита.`,
      ],
      "ui.field.stage.option.lived_in.label": [`Lived-in`, `Живой`],
      "ui.field.stage.option.lived_in.prompt": [
        `Show warm lived-in cues: throws, books, slight asymmetry—still photogenic and tidy.`,
        `Тёплые «живые» детали: пледы, книги, лёгкая асимметрия — всё ещё фотогенично и аккуратно.`,
      ],
      "ui.field.stage.option.shell.label": [`Shell`, `Коробка`],
      "ui.field.stage.option.shell.prompt": [
        `Show near-empty architectural shell: finished surfaces, minimal or no furniture—planning clarity.`,
        `Почти пустая «коробка»: готовые поверхности, минимум мебели — ясность для планирования.`,
      ],
      "ui.field.style.label": [`Style`, `Стиль`],
      "ui.field.style.option.boho.label": [`Boho`, `Бохо`],
      "ui.field.style.option.boho.prompt": [
        `Apply curated boho: layered rugs and textiles, plants, warm patterns—tidy not chaotic.`,
        `Бохо в умеренности: слои ковров и текстиля, растения, тёплые узоры — аккуратно, не хаос.`,
      ],
      "ui.field.style.option.coastal.label": [`Coastal`, `Побережье`],
      "ui.field.style.option.coastal.prompt": [
        `Apply relaxed coastal: airy whites, sand tones, natural fibers, soft blue-green hints.`,
        `Побережье: воздушный белый, песок, натуральные волокна, мягкие сине-зелёные акценты.`,
      ],
      "ui.field.style.option.industrial.label": [`Industrial`, `Лофт`],
      "ui.field.style.option.industrial.prompt": [
        `Apply refined industrial loft: concrete or brick hints, black metal frames, factory pendants—polished not grimy.`,
        `Утончённый лофт: бетон или кирпич, чёрный металл, фабричные светильники — чисто, не грязно.`,
      ],
      "ui.field.style.option.japandi.label": [`Japandi`, `Джапанди`],
      "ui.field.style.option.japandi.prompt": [
        `Apply Japandi: light wood, low horizontals, calm textures, wabi-sabi restraint.`,
        `Джапанди: светлое дерево, низкие горизонтали, спокойные текстуры, сдержанность ваби-саби.`,
      ],
      "ui.field.style.option.loft.label": [`Urban loft`, `Урбан`],
      "ui.field.style.option.loft.prompt": [
        `Apply contemporary loft: tall volume, large window wall implied, bold simple furniture silhouettes.`,
        `Современный лофт: высокий объём, намёк на большое окно, смелые простые силуэты мебели.`,
      ],
      "ui.field.style.option.midcentury.label": [`Mid-century`, `Модерн`],
      "ui.field.style.option.midcentury.prompt": [
        `Apply mid-century modern: tapered legs, organic curves, walnut and muted accent hues—generic not branded.`,
        `Мид-сенчури: сужающиеся ножки, органические линии, орех и приглушённые акценты — без брендов.`,
      ],
      "ui.field.style.option.minimal.label": [`Minimal`, `Минимализм`],
      "ui.field.style.option.minimal.prompt": [
        `Apply strict minimalism: few objects, hidden-storage feel, generous negative space.`,
        `Строгий минимализм: мало предметов, ощущение скрытого хранения, много воздуха.`,
      ],
      "ui.field.style.option.modern_classic.label": [`Modern classic`, `Неоклассика`],
      "ui.field.style.option.modern_classic.prompt": [
        `Apply modern classic: subtle moldings, symmetry, neutral luxe fabrics, restrained metallic accents.`,
        `Современная классика: лёгкий молдинг, симметрия, нейтральные люкс-ткани, сдержанный металл.`,
      ],
      "ui.field.style.option.scandi.label": [`Scandinavian`, `Сканди`],
      "ui.field.style.option.scandi.prompt": [
        `Apply Scandinavian design: pale wood, clean lines, cozy textiles, minimal clutter.`,
        `Скандинавия: светлое дерево, чистые линии, уютный текстиль, минимум визуального шума.`,
      ],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `🛋️`,
      group: `visual`,
      plan: {
        fields: [
          {
            default: `living`,
            id: `room`,
            kind: `single_choice`,
            label: { emoji: `🚪`, text: i18n(`ui.field.room.label`) },
            options: [
              {
                label: { emoji: `🛋️`, text: i18n(`ui.field.room.option.living.label`) },
                prompt: i18n(`ui.field.room.option.living.prompt`),
                value: `living`,
              },
              {
                label: { emoji: `🍳`, text: i18n(`ui.field.room.option.kitchen.label`) },
                prompt: i18n(`ui.field.room.option.kitchen.prompt`),
                value: `kitchen`,
              },
              {
                label: { emoji: `🛏️`, text: i18n(`ui.field.room.option.bedroom.label`) },
                prompt: i18n(`ui.field.room.option.bedroom.prompt`),
                value: `bedroom`,
              },
              {
                label: { emoji: `🛁`, text: i18n(`ui.field.room.option.bathroom.label`) },
                prompt: i18n(`ui.field.room.option.bathroom.prompt`),
                value: `bathroom`,
              },
              {
                label: { emoji: `🧸`, text: i18n(`ui.field.room.option.kids.label`) },
                prompt: i18n(`ui.field.room.option.kids.prompt`),
                value: `kids`,
              },
              {
                label: { emoji: `💼`, text: i18n(`ui.field.room.option.office.label`) },
                prompt: i18n(`ui.field.room.option.office.prompt`),
                value: `office`,
              },
              {
                label: { emoji: `🚶`, text: i18n(`ui.field.room.option.hall.label`) },
                prompt: i18n(`ui.field.room.option.hall.prompt`),
                value: `hall`,
              },
              {
                label: { emoji: `🍽️`, text: i18n(`ui.field.room.option.dining.label`) },
                prompt: i18n(`ui.field.room.option.dining.prompt`),
                value: `dining`,
              },
            ],
          },
          {
            default: `scandi`,
            id: `style`,
            kind: `single_choice`,
            label: { emoji: `🖌️`, text: i18n(`ui.field.style.label`) },
            options: [
              {
                label: { emoji: `🌲`, text: i18n(`ui.field.style.option.scandi.label`) },
                prompt: i18n(`ui.field.style.option.scandi.prompt`),
                value: `scandi`,
              },
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.style.option.minimal.label`) },
                prompt: i18n(`ui.field.style.option.minimal.prompt`),
                value: `minimal`,
              },
              {
                label: { emoji: `🏭`, text: i18n(`ui.field.style.option.industrial.label`) },
                prompt: i18n(`ui.field.style.option.industrial.prompt`),
                value: `industrial`,
              },
              {
                label: { emoji: `🏛️`, text: i18n(`ui.field.style.option.modern_classic.label`) },
                prompt: i18n(`ui.field.style.option.modern_classic.prompt`),
                value: `modern_classic`,
              },
              {
                label: { emoji: `🌿`, text: i18n(`ui.field.style.option.boho.label`) },
                prompt: i18n(`ui.field.style.option.boho.prompt`),
                value: `boho`,
              },
              {
                label: { emoji: `🎋`, text: i18n(`ui.field.style.option.japandi.label`) },
                prompt: i18n(`ui.field.style.option.japandi.prompt`),
                value: `japandi`,
              },
              {
                label: { emoji: `🪑`, text: i18n(`ui.field.style.option.midcentury.label`) },
                prompt: i18n(`ui.field.style.option.midcentury.prompt`),
                value: `midcentury`,
              },
              {
                label: { emoji: `🐚`, text: i18n(`ui.field.style.option.coastal.label`) },
                prompt: i18n(`ui.field.style.option.coastal.prompt`),
                value: `coastal`,
              },
              {
                label: { emoji: `🏙️`, text: i18n(`ui.field.style.option.loft.label`) },
                prompt: i18n(`ui.field.style.option.loft.prompt`),
                value: `loft`,
              },
            ],
          },
          {
            default: `warm_neutral`,
            id: `palette`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.palette.label`) },
            options: [
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.palette.option.warm_neutral.label`) },
                prompt: i18n(`ui.field.palette.option.warm_neutral.prompt`),
                value: `warm_neutral`,
              },
              {
                label: { emoji: `🌫️`, text: i18n(`ui.field.palette.option.cool_gray.label`) },
                prompt: i18n(`ui.field.palette.option.cool_gray.prompt`),
                value: `cool_gray`,
              },
              {
                label: { emoji: `🪨`, text: i18n(`ui.field.palette.option.earth.label`) },
                prompt: i18n(`ui.field.palette.option.earth.prompt`),
                value: `earth`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.palette.option.monochrome.label`) },
                prompt: i18n(`ui.field.palette.option.monochrome.prompt`),
                value: `monochrome`,
              },
              {
                label: { emoji: `🍬`, text: i18n(`ui.field.palette.option.pastel_pop.label`) },
                prompt: i18n(`ui.field.palette.option.pastel_pop.prompt`),
                value: `pastel_pop`,
              },
              {
                label: { emoji: `🌙`, text: i18n(`ui.field.palette.option.dark_moody.label`) },
                prompt: i18n(`ui.field.palette.option.dark_moody.prompt`),
                value: `dark_moody`,
              },
              {
                label: { emoji: `☁️`, text: i18n(`ui.field.palette.option.white_air.label`) },
                prompt: i18n(`ui.field.palette.option.white_air.prompt`),
                value: `white_air`,
              },
            ],
          },
          {
            default: `full_staged`,
            id: `stage`,
            kind: `single_choice`,
            label: { emoji: `🪑`, text: i18n(`ui.field.stage.label`) },
            options: [
              {
                label: { emoji: `🏗️`, text: i18n(`ui.field.stage.option.shell.label`) },
                prompt: i18n(`ui.field.stage.option.shell.prompt`),
                value: `shell`,
              },
              {
                label: { emoji: `📦`, text: i18n(`ui.field.stage.option.light_furnished.label`) },
                prompt: i18n(`ui.field.stage.option.light_furnished.prompt`),
                value: `light_furnished`,
              },
              {
                label: { emoji: `✨`, text: i18n(`ui.field.stage.option.full_staged.label`) },
                prompt: i18n(`ui.field.stage.option.full_staged.prompt`),
                value: `full_staged`,
              },
              {
                label: { emoji: `🏠`, text: i18n(`ui.field.stage.option.lived_in.label`) },
                prompt: i18n(`ui.field.stage.option.lived_in.prompt`),
                value: `lived_in`,
              },
            ],
          },
          {
            default: `wood_light`,
            id: `floor`,
            kind: `single_choice`,
            label: { emoji: `⬛`, text: i18n(`ui.field.floor.label`) },
            options: [
              {
                label: { emoji: `🪵`, text: i18n(`ui.field.floor.option.wood_light.label`) },
                prompt: i18n(`ui.field.floor.option.wood_light.prompt`),
                value: `wood_light`,
              },
              {
                label: { emoji: `🪵`, text: i18n(`ui.field.floor.option.wood_dark.label`) },
                prompt: i18n(`ui.field.floor.option.wood_dark.prompt`),
                value: `wood_dark`,
              },
              {
                label: { emoji: `◻️`, text: i18n(`ui.field.floor.option.tile_light.label`) },
                prompt: i18n(`ui.field.floor.option.tile_light.prompt`),
                value: `tile_light`,
              },
              {
                label: { emoji: `◼️`, text: i18n(`ui.field.floor.option.tile_dark.label`) },
                prompt: i18n(`ui.field.floor.option.tile_dark.prompt`),
                value: `tile_dark`,
              },
              {
                label: { emoji: `🧱`, text: i18n(`ui.field.floor.option.concrete.label`) },
                prompt: i18n(`ui.field.floor.option.concrete.prompt`),
                value: `concrete`,
              },
              {
                label: { emoji: `🟫`, text: i18n(`ui.field.floor.option.carpet.label`) },
                prompt: i18n(`ui.field.floor.option.carpet.prompt`),
                value: `carpet`,
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
                label: { emoji: `☁️`, text: i18n(`ui.field.light.option.soft_overcast.label`) },
                prompt: i18n(`ui.field.light.option.soft_overcast.prompt`),
                value: `soft_overcast`,
              },
              {
                label: { emoji: `🕯️`, text: i18n(`ui.field.light.option.evening_cozy.label`) },
                prompt: i18n(`ui.field.light.option.evening_cozy.prompt`),
                value: `evening_cozy`,
              },
              {
                label: { emoji: `🎭`, text: i18n(`ui.field.light.option.accent_dramatic.label`) },
                prompt: i18n(`ui.field.light.option.accent_dramatic.prompt`),
                value: `accent_dramatic`,
              },
            ],
          },
          {
            default: `wide`,
            id: `camera`,
            kind: `single_choice`,
            label: { emoji: `📷`, text: i18n(`ui.field.camera.label`) },
            options: [
              {
                label: { emoji: `🏠`, text: i18n(`ui.field.camera.option.wide.label`) },
                prompt: i18n(`ui.field.camera.option.wide.prompt`),
                value: `wide`,
              },
              {
                label: { emoji: `📐`, text: i18n(`ui.field.camera.option.corner.label`) },
                prompt: i18n(`ui.field.camera.option.corner.prompt`),
                value: `corner`,
              },
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.camera.option.straight_on.label`) },
                prompt: i18n(`ui.field.camera.option.straight_on.prompt`),
                value: `straight_on`,
              },
              {
                label: { emoji: `🎯`, text: i18n(`ui.field.camera.option.focal_wall.label`) },
                prompt: i18n(`ui.field.camera.option.focal_wall.prompt`),
                value: `focal_wall`,
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
        ],
        title: i18n(`meta.title`),
      },
      prompt: i18n(`meta.prompt`),
    }) as const,
);
