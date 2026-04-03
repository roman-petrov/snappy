// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = () =>
  ({
    en: {
      emoji: `🛋️`,
      labels: {
        description: `Room render for renovation planning — style, palette, light, staging`,
        title: `Interior`,
      },
      prompt: `Build **one** image-generation prompt. Use every bullet below as hard constraints. Target: **single interior visualization** for renovation planning—photorealistic architectural photo or high-end interior 3D render. Exclude: floor plans, blueprints, top-down layouts, isometric dollhouse cutaways, exterior-only shots. Merge: room type, design style, **exact palette named in the tabs**, staging level, floor material, lighting recipe, camera framing. If optional detail names objects, materials, or colors, weave them in without contradicting the tabs. Forbid: people and pets unless optional detail explicitly requests them; watermarks; readable brand logos on products; posters or signs with legible words—use abstract art or texture only. Demand crisp materials, believable scale, clean composition. Reply with that string only—no other text.`,
      uiPlan: {
        fields: [
          {
            default: `living`,
            id: `room`,
            kind: `tabs_single`,
            label: `🚪 Room`,
            options: [
              {
                label: `🛋️ Living`,
                prompt: `Depict a living room; show seating zone and at least one full wall treatment clearly.`,
                value: `living`,
              },
              {
                label: `🍳 Kitchen`,
                prompt: `Depict a kitchen; show cabinetry run, countertop, backsplash, and hood or upper cabinets legibly.`,
                value: `kitchen`,
              },
              {
                label: `🛏️ Bedroom`,
                prompt: `Depict a bedroom; center the bed; include nightstands or wardrobe cues for scale.`,
                value: `bedroom`,
              },
              {
                label: `🛁 Bathroom`,
                prompt: `Depict a bathroom; show vanity, mirror zone, fixtures, and wall/floor tile readably; spa-clean.`,
                value: `bathroom`,
              },
              {
                label: `🧸 Kids`,
                prompt: `Depict a children's room; playful but tidy; safe layout; age-neutral styling.`,
                value: `kids`,
              },
              {
                label: `💼 Office`,
                prompt: `Depict a home office; desk workspace plus storage wall or shelving visible.`,
                value: `office`,
              },
              {
                label: `🚶 Hall`,
                prompt: `Depict an entryway or corridor; emphasize depth; console, bench, or built-in storage optional.`,
                value: `hall`,
              },
              {
                label: `🍽️ Dining`,
                prompt: `Depict a dining zone; table and chairs as hero; pendant or linear light above table.`,
                value: `dining`,
              },
            ],
          },
          {
            default: `scandi`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Style`,
            options: [
              {
                label: `🌲 Scandinavian`,
                prompt: `Apply Scandinavian design: pale wood, clean lines, cozy textiles, minimal clutter.`,
                value: `scandi`,
              },
              {
                label: `◻️ Minimal`,
                prompt: `Apply strict minimalism: few objects, hidden-storage feel, generous negative space.`,
                value: `minimal`,
              },
              {
                label: `🏭 Industrial`,
                prompt: `Apply refined industrial loft: concrete or brick hints, black metal frames, factory pendants—polished not grimy.`,
                value: `industrial`,
              },
              {
                label: `🏛️ Modern classic`,
                prompt: `Apply modern classic: subtle moldings, symmetry, neutral luxe fabrics, restrained metallic accents.`,
                value: `modern_classic`,
              },
              {
                label: `🌿 Boho`,
                prompt: `Apply curated boho: layered rugs and textiles, plants, warm patterns—tidy not chaotic.`,
                value: `boho`,
              },
              {
                label: `🎋 Japandi`,
                prompt: `Apply Japandi: light wood, low horizontals, calm textures, wabi-sabi restraint.`,
                value: `japandi`,
              },
              {
                label: `🪑 Mid-century`,
                prompt: `Apply mid-century modern: tapered legs, organic curves, walnut and muted accent hues—generic not branded.`,
                value: `midcentury`,
              },
              {
                label: `🐚 Coastal`,
                prompt: `Apply relaxed coastal: airy whites, sand tones, natural fibers, soft blue-green hints.`,
                value: `coastal`,
              },
              {
                label: `🏙️ Urban loft`,
                prompt: `Apply contemporary loft: tall volume, large window wall implied, bold simple furniture silhouettes.`,
                value: `loft`,
              },
            ],
          },
          {
            default: `warm_neutral`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Palette`,
            options: [
              {
                label: `🌅 Warm neutral`,
                prompt: `Use warm neutrals: cream, beige, camel, greige, warm white walls.`,
                value: `warm_neutral`,
              },
              {
                label: `🌫️ Cool gray`,
                prompt: `Use cool grays with crisp white; allow brushed nickel or chrome accents sparingly.`,
                value: `cool_gray`,
              },
              {
                label: `🪨 Earth`,
                prompt: `Use earth tones: terracotta, clay, olive, walnut, stone, sand.`,
                value: `earth`,
              },
              {
                label: `⬛ Monochrome`,
                prompt: `Use black, white, and gray only; strong planar contrast.`,
                value: `monochrome`,
              },
              {
                label: `🍬 Pastel accents`,
                prompt: `Use soft pastel base walls with one or two controlled accent colors in furniture or decor.`,
                value: `pastel_pop`,
              },
              {
                label: `🌙 Dark moody`,
                prompt: `Use dark walls or cabinetry with warm wood and amber light for depth—still readable detail.`,
                value: `dark_moody`,
              },
              {
                label: `☁️ White airy`,
                prompt: `Use predominantly white and pale tones; bright gallery-like airiness.`,
                value: `white_air`,
              },
            ],
          },
          {
            default: `full_staged`,
            id: `stage`,
            kind: `tabs_single`,
            label: `🪑 Fill`,
            options: [
              {
                label: `🏗️ Shell`,
                prompt: `Show near-empty architectural shell: finished surfaces, minimal or no furniture—planning clarity.`,
                value: `shell`,
              },
              {
                label: `📦 Essentials`,
                prompt: `Show only essential pieces defining function; no heavy styling props.`,
                value: `light_furnished`,
              },
              {
                label: `✨ Full staging`,
                prompt: `Show magazine-complete staging: full furniture set, layered decor, styled surfaces.`,
                value: `full_staged`,
              },
              {
                label: `🏠 Lived-in`,
                prompt: `Show warm lived-in cues: throws, books, slight asymmetry—still photogenic and tidy.`,
                value: `lived_in`,
              },
            ],
          },
          {
            default: `wood_light`,
            id: `floor`,
            kind: `tabs_single`,
            label: `⬛ Floor`,
            options: [
              {
                label: `🪵 Light wood`,
                prompt: `Specify wide-plank light oak or maple flooring with subtle grain.`,
                value: `wood_light`,
              },
              { label: `🪵 Dark wood`, prompt: `Specify dark-stained wide-plank wood flooring.`, value: `wood_dark` },
              {
                label: `◻️ Light tile`,
                prompt: `Specify large-format light stone-look or porcelain tiles; minimal grout contrast.`,
                value: `tile_light`,
              },
              {
                label: `◼️ Dark tile`,
                prompt: `Specify large-format charcoal or slate-look tiles; matte or satin.`,
                value: `tile_dark`,
              },
              {
                label: `🧱 Concrete`,
                prompt: `Specify polished concrete or microcement floor; subtle variation, no harsh stains.`,
                value: `concrete`,
              },
              {
                label: `🟫 Carpet / rug`,
                prompt: `Specify neutral low-pile wall-to-wall or large area rug; describe texture and edge clean.`,
                value: `carpet`,
              },
            ],
          },
          {
            default: `daylight`,
            id: `light`,
            kind: `tabs_single`,
            label: `💡 Light`,
            options: [
              {
                label: `☀️ Daylight`,
                prompt: `Light with bright natural daylight through windows; soft realistic shadows; neutral white balance.`,
                value: `daylight`,
              },
              {
                label: `🌇 Golden hour`,
                prompt: `Light with warm low sun; golden beams and gentle bounce on walls.`,
                value: `golden`,
              },
              {
                label: `☁️ Soft overcast`,
                prompt: `Light with soft even overcast daylight; low contrast; calm exposure.`,
                value: `soft_overcast`,
              },
              {
                label: `🕯️ Evening cozy`,
                prompt: `Light with warm ambient lamps, floor uplight, and subtle indirect strip—pools of cozy light.`,
                value: `evening_cozy`,
              },
              {
                label: `🎭 Accent drama`,
                prompt: `Use directional accent spots on key pieces or art; higher contrast sculptural lighting.`,
                value: `accent_dramatic`,
              },
            ],
          },
          {
            default: `wide`,
            id: `camera`,
            kind: `tabs_single`,
            label: `📷 Camera`,
            options: [
              {
                label: `🏠 Wide shot`,
                prompt: `Frame wide-angle one-point perspective showing most of the room volume and ceiling line.`,
                value: `wide`,
              },
              {
                label: `📐 Corner`,
                prompt: `Frame from a corner looking diagonally across—maximize depth and both wall planes.`,
                value: `corner`,
              },
              {
                label: `⬜ Straight-on`,
                prompt: `Frame straight-on to a hero wall or symmetrical composition—architectural elevation feel.`,
                value: `straight_on`,
              },
              {
                label: `🎯 Feature wall`,
                prompt: `Frame tighter on one feature wall with furniture in foreground—material and styling readable.`,
                value: `focal_wall`,
              },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: `📝 Optional detail`,
            omitWhenEmpty: true,
            placeholder: `e.g. emerald sofa, fluted panels, terrazzo…`,
            prompt: `Optional furniture, material, or layout note (one short line):`,
          },
        ],
        title: `🛋️ Interior`,
      },
    },
    group: `visual`,
    ru: {
      emoji: `🛋️`,
      labels: { description: `Визуализация комнаты под ремонт — стиль, палитра, свет, наполнение`, title: `Интерьер` },
      prompt: `Собери **один** промпт для генерации изображения. Каждый пункт ниже — жёсткое условие. Цель: **одна визуализация интерьера** для планирования ремонта — фотореализм или качественный интерьерный 3D-рендер. Исключить: планы этажей, чертежи, вид сверху, изометрические «разрезы домика», только фасад снаружи. Собери тип комнаты, стиль, **палитру строго по подписи выбранной вкладки**, степень заполнения мебелью, материал пола, свет, кадр. Строку уточнения вплети в предметы или планировку — не противоречь вкладкам. Запрет: люди и животные, если уточнение явно не просит; водяные знаки; читаемые бренды на предметах; постеры со словами — только абстрактное искусство или фактура. Требуй читаемые материалы, правдоподобный масштаб, чистую композицию. Верни только эту строку — без другого текста.`,
      uiPlan: {
        fields: [
          {
            default: `living`,
            id: `room`,
            kind: `tabs_single`,
            label: `🚪 Комната`,
            options: [
              {
                label: `🛋️ Гостиная`,
                prompt: `Покажи гостиную; зона дивана и минимум одна целая стена с отделкой читаемы.`,
                value: `living`,
              },
              {
                label: `🍳 Кухня`,
                prompt: `Покажи кухню; ряд шкафов, столешница, фартук, вытяжка или верхние шкафы — всё узнаваемо.`,
                value: `kitchen`,
              },
              {
                label: `🛏️ Спальня`,
                prompt: `Покажи спальню; кровать в фокусе; тумбы или шкаф для масштаба.`,
                value: `bedroom`,
              },
              {
                label: `🛁 Ванная`,
                prompt: `Покажи ванную; раковина, зеркало, сантехника, плитка на стене и полу читаемы; «спа»-чистота.`,
                value: `bathroom`,
              },
              {
                label: `🧸 Детская`,
                prompt: `Покажи детскую; игриво, но аккуратно; безопасная планировка; возраст нейтрален.`,
                value: `kids`,
              },
              {
                label: `💼 Кабинет`,
                prompt: `Покажи домашний офис; рабочий стол и стена хранения или полки в кадре.`,
                value: `office`,
              },
              {
                label: `🚶 Прихожая`,
                prompt: `Покажи прихожую или коридор; глубина; консоль, лавка или встроенное хранение по смыслу.`,
                value: `hall`,
              },
              {
                label: `🍽️ Столовая`,
                prompt: `Покажи столовую зону; стол и стулья — герой; светильник над столом.`,
                value: `dining`,
              },
            ],
          },
          {
            default: `scandi`,
            id: `style`,
            kind: `tabs_single`,
            label: `🖌️ Стиль`,
            options: [
              {
                label: `🌲 Сканди`,
                prompt: `Стиль скандинавский: светлое дерево, простые линии, уютный текстиль, мало визуального шума.`,
                value: `scandi`,
              },
              {
                label: `◻️ Минимализм`,
                prompt: `Строгий минимализм: мало предметов, ощущение скрытого хранения, много воздуха.`,
                value: `minimal`,
              },
              {
                label: `🏭 Лофт`,
                prompt: `Утончённый индустриальный лофт: бетон или кирпич намёк, чёрный металл, фабричные светильники — чисто, не грязно.`,
                value: `industrial`,
              },
              {
                label: `🏛️ Неоклассика`,
                prompt: `Современная классика: лёгкий молдинг, симметрия, нейтральные дорогие ткани, сдержанный металл.`,
                value: `modern_classic`,
              },
              {
                label: `🌿 Бохо`,
                prompt: `Аккуратное бохо: слои ковров и тканей, растения, тёплый орнамент — порядок, не хаос.`,
                value: `boho`,
              },
              {
                label: `🎋 Джапанди`,
                prompt: `Джапанди: светлое дерево, низкие горизонтали, спокойные фактуры, сдержанность ваби-саби.`,
                value: `japandi`,
              },
              {
                label: `🪑 Модерн`,
                prompt: `Модерн mid-century: сужающиеся ножки, мягкие изгибы, орех и приглушённые акценты — обобщённо, без брендов.`,
                value: `midcentury`,
              },
              {
                label: `🐚 Побережье`,
                prompt: `Побережье: воздушные белые, песочные тона, натуральные волокна, лёгкий сине-зелёный акцент.`,
                value: `coastal`,
              },
              {
                label: `🏙️ Урбан`,
                prompt: `Современный урбан-лофт: высокий объём, крупное окно в подразумеваемой стене, смелые простые формы мебели.`,
                value: `loft`,
              },
            ],
          },
          {
            default: `warm_neutral`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Палитра`,
            options: [
              {
                label: `🌅 Тёплый нейтраль`,
                prompt: `Тёплые нейтрали: крем, беж, верблюд, грейдж, тёплый белый на стенах.`,
                value: `warm_neutral`,
              },
              {
                label: `🌫️ Холодный серый`,
                prompt: `Холодные серые с чистым белым; хром или сатин никель точечно.`,
                value: `cool_gray`,
              },
              {
                label: `🪨 Земля`,
                prompt: `Земляная палитра: терракота, глина, олива, орех, камень, песок.`,
                value: `earth`,
              },
              {
                label: `⬛ Монохром`,
                prompt: `Только чёрный, белый и серый; сильный контраст плоскостей.`,
                value: `monochrome`,
              },
              {
                label: `🍬 Пастель + акцент`,
                prompt: `Светлая пастельная база и один–два сдержанных акцентных цвета в мебели или декоре.`,
                value: `pastel_pop`,
              },
              {
                label: `🌙 Тёмное настроение`,
                prompt: `Тёмные стены или фасады кухни, тёплое дерево и янтарный свет — детали читаемы.`,
                value: `dark_moody`,
              },
              {
                label: `☁️ Белое облако`,
                prompt: `Преобладают белый и очень светлые тона; яркая «галерейная» воздушность.`,
                value: `white_air`,
              },
            ],
          },
          {
            default: `full_staged`,
            id: `stage`,
            kind: `tabs_single`,
            label: `🪑 Наполнение`,
            options: [
              {
                label: `🏗️ Коробка`,
                prompt: `Почти пустое архитектурное пространство: отделка есть, мебели нет или минимум — для планирования.`,
                value: `shell`,
              },
              {
                label: `📦 Минимум`,
                prompt: `Только необходимая мебель по функции; без декоративного перегруза.`,
                value: `light_furnished`,
              },
              {
                label: `✨ Полный антураж`,
                prompt: `Журнальная постановка: полный комплект мебели, декор, стилизованные поверхности.`,
                value: `full_staged`,
              },
              {
                label: `🏠 Живой`,
                prompt: `Тёплые «живые» детали: пледы, книги, лёгкая асимметрия — всё ещё опрятно и фотогенично.`,
                value: `lived_in`,
              },
            ],
          },
          {
            default: `wood_light`,
            id: `floor`,
            kind: `tabs_single`,
            label: `⬛ Пол`,
            options: [
              {
                label: `🪵 Светлое дерево`,
                prompt: `Широкая доска светлого дуба или клёна; умеренный рисунок волокна.`,
                value: `wood_light`,
              },
              { label: `🪵 Тёмное дерево`, prompt: `Тёмный тониров широкой доски.`, value: `wood_dark` },
              {
                label: `◻️ Светлая плитка`,
                prompt: `Крупный формат светлого керамогранита или камня; шов едва заметен.`,
                value: `tile_light`,
              },
              {
                label: `◼️ Тёмная плитка`,
                prompt: `Крупный формат графитовой или сланцевой плитки; матовый или сатин.`,
                value: `tile_dark`,
              },
              {
                label: `🧱 Бетон`,
                prompt: `Полированный бетон или микроцемент; лёгкая вариация, без пятен.`,
                value: `concrete`,
              },
              {
                label: `🟫 Ковёр`,
                prompt: `Нейтральный низкий ворс по всей комнате или крупный ковёр; опиши фактуру и ровные края.`,
                value: `carpet`,
              },
            ],
          },
          {
            default: `daylight`,
            id: `light`,
            kind: `tabs_single`,
            label: `💡 Свет`,
            options: [
              {
                label: `☀️ День`,
                prompt: `Яркий дневной свет из окон; мягкие реалистичные тени; нейтральный баланс белого.`,
                value: `daylight`,
              },
              {
                label: `🌇 Золотой час`,
                prompt: `Низкое тёплое солнце; золотые лучи и мягкий отскок на стенах.`,
                value: `golden`,
              },
              {
                label: `☁️ Пасмурно`,
                prompt: `Ровный рассеянный дневной свет; низкий контраст; спокойная экспозиция.`,
                value: `soft_overcast`,
              },
              {
                label: `🕯️ Вечер`,
                prompt: `Тёплые торшеры и настольные, лёгкий индирект — уютные пятна света.`,
                value: `evening_cozy`,
              },
              {
                label: `🎭 Акценты`,
                prompt: `Направленные акценты на мебель или арт; выше контраст, скульптурный свет.`,
                value: `accent_dramatic`,
              },
            ],
          },
          {
            default: `wide`,
            id: `camera`,
            kind: `tabs_single`,
            label: `📷 Камера`,
            options: [
              {
                label: `🏠 Широкий план`,
                prompt: `Широкий угол, одна точка схода; виден объём комнаты и линия потолка.`,
                value: `wide`,
              },
              {
                label: `📐 Из угла`,
                prompt: `Кадр из угла по диагонали — максимум глубины и двух стен.`,
                value: `corner`,
              },
              {
                label: `⬜ Фронтально`,
                prompt: `Строго на героическую стену или симметричную композицию — почти фасад интерьера.`,
                value: `straight_on`,
              },
              {
                label: `🎯 Акцентная стена`,
                prompt: `Крупнее акцентная стена, мебель на переднем плане — материал и стиль читаемы.`,
                value: `focal_wall`,
              },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: `📝 Уточнение`,
            omitWhenEmpty: true,
            placeholder: `Напр. диван изумрудный, рейки на стене, терраццо…`,
            prompt: `Уточнение: мебель, материал или планировка (одна короткая строка):`,
          },
        ],
        title: `🛋️ Интерьер`,
      },
    },
  }) as const;
/* jscpd:ignore-end */
