// cspell:disable
/* jscpd:ignore-start */
import { StaticAgentMeta } from "../../common/static-agent";

export const Data = StaticAgentMeta(
  () =>
    ({
      "meta.description": [
        ``,
        `Room render for renovation planning — style, palette, light, staging`,
        `Визуализация комнаты под ремонт — стиль, палитра, свет, наполнение`,
      ],
      "meta.title": [``, `Interior`, `Интерьер`],
      "ui.field.camera.label": [`📷`, `Camera`, `Камера`],
      "ui.field.camera.option.corner.label": [`📐`, `Corner`, `Из угла`],
      "ui.field.camera.option.focal_wall.label": [`🎯`, `Feature wall`, `Акцентная стена`],
      "ui.field.camera.option.straight_on.label": [`⬜`, `Straight-on`, `Фронтально`],
      "ui.field.camera.option.wide.label": [`🏠`, `Wide shot`, `Широкий план`],
      "ui.field.extra.label": [`📝`, `Optional detail`, `Уточнение`],
      "ui.field.extra.placeholder": [
        ``,
        `e.g. emerald sofa, fluted panels, terrazzo…`,
        `Напр. диван изумрудный, рейки на стене, терраццо…`,
      ],
      "ui.field.floor.label": [`⬛`, `Floor`, `Пол`],
      "ui.field.floor.option.carpet.label": [`🟫`, `Carpet / rug`, `Ковёр`],
      "ui.field.floor.option.concrete.label": [`🧱`, `Concrete`, `Бетон`],
      "ui.field.floor.option.tile_dark.label": [`◼️`, `Dark tile`, `Тёмная плитка`],
      "ui.field.floor.option.tile_light.label": [`◻️`, `Light tile`, `Светлая плитка`],
      "ui.field.floor.option.wood_dark.label": [`🪵`, `Dark wood`, `Тёмное дерево`],
      "ui.field.floor.option.wood_light.label": [`🪵`, `Light wood`, `Светлое дерево`],
      "ui.field.light.label": [`💡`, `Light`, `Свет`],
      "ui.field.light.option.accent_dramatic.label": [`🎭`, `Accent drama`, `Акценты`],
      "ui.field.light.option.daylight.label": [`☀️`, `Daylight`, `День`],
      "ui.field.light.option.evening_cozy.label": [`🕯️`, `Evening cozy`, `Вечер`],
      "ui.field.light.option.golden.label": [`🌇`, `Golden hour`, `Золотой час`],
      "ui.field.light.option.soft_overcast.label": [`☁️`, `Soft overcast`, `Пасмурно`],
      "ui.field.palette.label": [`🎨`, `Palette`, `Палитра`],
      "ui.field.palette.option.cool_gray.label": [`🌫️`, `Cool gray`, `Холодный серый`],
      "ui.field.palette.option.dark_moody.label": [`🌙`, `Dark moody`, `Тёмное настроение`],
      "ui.field.palette.option.earth.label": [`🪨`, `Earth`, `Земля`],
      "ui.field.palette.option.monochrome.label": [`⬛`, `Monochrome`, `Монохром`],
      "ui.field.palette.option.pastel_pop.label": [`🍬`, `Pastel accents`, `Пастель + акцент`],
      "ui.field.palette.option.warm_neutral.label": [`🌅`, `Warm neutral`, `Тёплый нейтраль`],
      "ui.field.palette.option.white_air.label": [`☁️`, `White airy`, `Белое облако`],
      "ui.field.room.label": [`🚪`, `Room`, `Комната`],
      "ui.field.room.option.bathroom.label": [`🛁`, `Bathroom`, `Ванная`],
      "ui.field.room.option.bedroom.label": [`🛏️`, `Bedroom`, `Спальня`],
      "ui.field.room.option.dining.label": [`🍽️`, `Dining`, `Столовая`],
      "ui.field.room.option.hall.label": [`🚶`, `Hall`, `Прихожая`],
      "ui.field.room.option.kids.label": [`🧸`, `Kids`, `Детская`],
      "ui.field.room.option.kitchen.label": [`🍳`, `Kitchen`, `Кухня`],
      "ui.field.room.option.living.label": [`🛋️`, `Living`, `Гостиная`],
      "ui.field.room.option.office.label": [`💼`, `Office`, `Кабинет`],
      "ui.field.stage.label": [`🪑`, `Fill`, `Наполнение`],
      "ui.field.stage.option.full_staged.label": [`✨`, `Full staging`, `Полный антураж`],
      "ui.field.stage.option.light_furnished.label": [`📦`, `Essentials`, `Минимум`],
      "ui.field.stage.option.lived_in.label": [`🏠`, `Lived-in`, `Живой`],
      "ui.field.stage.option.shell.label": [`🏗️`, `Shell`, `Коробка`],
      "ui.field.style.label": [`🖌️`, `Style`, `Стиль`],
      "ui.field.style.option.boho.label": [`🌿`, `Boho`, `Бохо`],
      "ui.field.style.option.coastal.label": [`🐚`, `Coastal`, `Побережье`],
      "ui.field.style.option.industrial.label": [`🏭`, `Industrial`, `Лофт`],
      "ui.field.style.option.japandi.label": [`🎋`, `Japandi`, `Джапанди`],
      "ui.field.style.option.loft.label": [`🏙️`, `Urban loft`, `Урбан`],
      "ui.field.style.option.midcentury.label": [`🪑`, `Mid-century`, `Модерн`],
      "ui.field.style.option.minimal.label": [`◻️`, `Minimal`, `Минимализм`],
      "ui.field.style.option.modern_classic.label": [`🏛️`, `Modern classic`, `Неоклассика`],
      "ui.field.style.option.scandi.label": [`🌲`, `Scandinavian`, `Сканди`],
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
            kind: `tabs_single`,
            label: i18n(`ui.field.room.label`),
            options: [
              {
                label: i18n(`ui.field.room.option.living.label`),
                prompt: `Depict a living room; show seating zone and at least one full wall treatment clearly.`,
                value: `living`,
              },
              {
                label: i18n(`ui.field.room.option.kitchen.label`),
                prompt: `Depict a kitchen; show cabinetry run, countertop, backsplash, and hood or upper cabinets legibly.`,
                value: `kitchen`,
              },
              {
                label: i18n(`ui.field.room.option.bedroom.label`),
                prompt: `Depict a bedroom; center the bed; include nightstands or wardrobe cues for scale.`,
                value: `bedroom`,
              },
              {
                label: i18n(`ui.field.room.option.bathroom.label`),
                prompt: `Depict a bathroom; show vanity, mirror zone, fixtures, and wall/floor tile readably; spa-clean.`,
                value: `bathroom`,
              },
              {
                label: i18n(`ui.field.room.option.kids.label`),
                prompt: `Depict a children's room; playful but tidy; safe layout; age-neutral styling.`,
                value: `kids`,
              },
              {
                label: i18n(`ui.field.room.option.office.label`),
                prompt: `Depict a home office; desk workspace plus storage wall or shelving visible.`,
                value: `office`,
              },
              {
                label: i18n(`ui.field.room.option.hall.label`),
                prompt: `Depict an entryway or corridor; emphasize depth; console, bench, or built-in storage optional.`,
                value: `hall`,
              },
              {
                label: i18n(`ui.field.room.option.dining.label`),
                prompt: `Depict a dining zone; table and chairs as hero; pendant or linear light above table.`,
                value: `dining`,
              },
            ],
          },
          {
            default: `scandi`,
            id: `style`,
            kind: `tabs_single`,
            label: i18n(`ui.field.style.label`),
            options: [
              {
                label: i18n(`ui.field.style.option.scandi.label`),
                prompt: `Apply Scandinavian design: pale wood, clean lines, cozy textiles, minimal clutter.`,
                value: `scandi`,
              },
              {
                label: i18n(`ui.field.style.option.minimal.label`),
                prompt: `Apply strict minimalism: few objects, hidden-storage feel, generous negative space.`,
                value: `minimal`,
              },
              {
                label: i18n(`ui.field.style.option.industrial.label`),
                prompt: `Apply refined industrial loft: concrete or brick hints, black metal frames, factory pendants—polished not grimy.`,
                value: `industrial`,
              },
              {
                label: i18n(`ui.field.style.option.modern_classic.label`),
                prompt: `Apply modern classic: subtle moldings, symmetry, neutral luxe fabrics, restrained metallic accents.`,
                value: `modern_classic`,
              },
              {
                label: i18n(`ui.field.style.option.boho.label`),
                prompt: `Apply curated boho: layered rugs and textiles, plants, warm patterns—tidy not chaotic.`,
                value: `boho`,
              },
              {
                label: i18n(`ui.field.style.option.japandi.label`),
                prompt: `Apply Japandi: light wood, low horizontals, calm textures, wabi-sabi restraint.`,
                value: `japandi`,
              },
              {
                label: i18n(`ui.field.style.option.midcentury.label`),
                prompt: `Apply mid-century modern: tapered legs, organic curves, walnut and muted accent hues—generic not branded.`,
                value: `midcentury`,
              },
              {
                label: i18n(`ui.field.style.option.coastal.label`),
                prompt: `Apply relaxed coastal: airy whites, sand tones, natural fibers, soft blue-green hints.`,
                value: `coastal`,
              },
              {
                label: i18n(`ui.field.style.option.loft.label`),
                prompt: `Apply contemporary loft: tall volume, large window wall implied, bold simple furniture silhouettes.`,
                value: `loft`,
              },
            ],
          },
          {
            default: `warm_neutral`,
            id: `palette`,
            kind: `tabs_single`,
            label: i18n(`ui.field.palette.label`),
            options: [
              {
                label: i18n(`ui.field.palette.option.warm_neutral.label`),
                prompt: `Use warm neutrals: cream, beige, camel, greige, warm white walls.`,
                value: `warm_neutral`,
              },
              {
                label: i18n(`ui.field.palette.option.cool_gray.label`),
                prompt: `Use cool grays with crisp white; allow brushed nickel or chrome accents sparingly.`,
                value: `cool_gray`,
              },
              {
                label: i18n(`ui.field.palette.option.earth.label`),
                prompt: `Use earth tones: terracotta, clay, olive, walnut, stone, sand.`,
                value: `earth`,
              },
              {
                label: i18n(`ui.field.palette.option.monochrome.label`),
                prompt: `Use black, white, and gray only; strong planar contrast.`,
                value: `monochrome`,
              },
              {
                label: i18n(`ui.field.palette.option.pastel_pop.label`),
                prompt: `Use soft pastel base walls with one or two controlled accent colors in furniture or decor.`,
                value: `pastel_pop`,
              },
              {
                label: i18n(`ui.field.palette.option.dark_moody.label`),
                prompt: `Use dark walls or cabinetry with warm wood and amber light for depth—still readable detail.`,
                value: `dark_moody`,
              },
              {
                label: i18n(`ui.field.palette.option.white_air.label`),
                prompt: `Use predominantly white and pale tones; bright gallery-like airiness.`,
                value: `white_air`,
              },
            ],
          },
          {
            default: `full_staged`,
            id: `stage`,
            kind: `tabs_single`,
            label: i18n(`ui.field.stage.label`),
            options: [
              {
                label: i18n(`ui.field.stage.option.shell.label`),
                prompt: `Show near-empty architectural shell: finished surfaces, minimal or no furniture—planning clarity.`,
                value: `shell`,
              },
              {
                label: i18n(`ui.field.stage.option.light_furnished.label`),
                prompt: `Show only essential pieces defining function; no heavy styling props.`,
                value: `light_furnished`,
              },
              {
                label: i18n(`ui.field.stage.option.full_staged.label`),
                prompt: `Show magazine-complete staging: full furniture set, layered decor, styled surfaces.`,
                value: `full_staged`,
              },
              {
                label: i18n(`ui.field.stage.option.lived_in.label`),
                prompt: `Show warm lived-in cues: throws, books, slight asymmetry—still photogenic and tidy.`,
                value: `lived_in`,
              },
            ],
          },
          {
            default: `wood_light`,
            id: `floor`,
            kind: `tabs_single`,
            label: i18n(`ui.field.floor.label`),
            options: [
              {
                label: i18n(`ui.field.floor.option.wood_light.label`),
                prompt: `Specify wide-plank light oak or maple flooring with subtle grain.`,
                value: `wood_light`,
              },
              {
                label: i18n(`ui.field.floor.option.wood_dark.label`),
                prompt: `Specify dark-stained wide-plank wood flooring.`,
                value: `wood_dark`,
              },
              {
                label: i18n(`ui.field.floor.option.tile_light.label`),
                prompt: `Specify large-format light stone-look or porcelain tiles; minimal grout contrast.`,
                value: `tile_light`,
              },
              {
                label: i18n(`ui.field.floor.option.tile_dark.label`),
                prompt: `Specify large-format charcoal or slate-look tiles; matte or satin.`,
                value: `tile_dark`,
              },
              {
                label: i18n(`ui.field.floor.option.concrete.label`),
                prompt: `Specify polished concrete or microcement floor; subtle variation, no harsh stains.`,
                value: `concrete`,
              },
              {
                label: i18n(`ui.field.floor.option.carpet.label`),
                prompt: `Specify neutral low-pile wall-to-wall or large area rug; describe texture and edge clean.`,
                value: `carpet`,
              },
            ],
          },
          {
            default: `daylight`,
            id: `light`,
            kind: `tabs_single`,
            label: i18n(`ui.field.light.label`),
            options: [
              {
                label: i18n(`ui.field.light.option.daylight.label`),
                prompt: `Light with bright natural daylight through windows; soft realistic shadows; neutral white balance.`,
                value: `daylight`,
              },
              {
                label: i18n(`ui.field.light.option.golden.label`),
                prompt: `Light with warm low sun; golden beams and gentle bounce on walls.`,
                value: `golden`,
              },
              {
                label: i18n(`ui.field.light.option.soft_overcast.label`),
                prompt: `Light with soft even overcast daylight; low contrast; calm exposure.`,
                value: `soft_overcast`,
              },
              {
                label: i18n(`ui.field.light.option.evening_cozy.label`),
                prompt: `Light with warm ambient lamps, floor uplight, and subtle indirect strip—pools of cozy light.`,
                value: `evening_cozy`,
              },
              {
                label: i18n(`ui.field.light.option.accent_dramatic.label`),
                prompt: `Use directional accent spots on key pieces or art; higher contrast sculptural lighting.`,
                value: `accent_dramatic`,
              },
            ],
          },
          {
            default: `wide`,
            id: `camera`,
            kind: `tabs_single`,
            label: i18n(`ui.field.camera.label`),
            options: [
              {
                label: i18n(`ui.field.camera.option.wide.label`),
                prompt: `Frame wide-angle one-point perspective showing most of the room volume and ceiling line.`,
                value: `wide`,
              },
              {
                label: i18n(`ui.field.camera.option.corner.label`),
                prompt: `Frame from a corner looking diagonally across—maximize depth and both wall planes.`,
                value: `corner`,
              },
              {
                label: i18n(`ui.field.camera.option.straight_on.label`),
                prompt: `Frame straight-on to a hero wall or symmetrical composition—architectural elevation feel.`,
                value: `straight_on`,
              },
              {
                label: i18n(`ui.field.camera.option.focal_wall.label`),
                prompt: `Frame tighter on one feature wall with furniture in foreground—material and styling readable.`,
                value: `focal_wall`,
              },
            ],
          },
          {
            id: `extra`,
            kind: `text`,
            label: i18n(`ui.field.extra.label`),
            omitWhenEmpty: true,
            placeholder: i18n(`ui.field.extra.placeholder`),
            prompt: `Optional furniture, material, or layout note (one short line):`,
          },
        ],
      },
      prompt: `Build **one** image-generation prompt. Use every bullet below as hard constraints. Target: **single interior visualization** for renovation planning—photorealistic architectural photo or high-end interior 3D render. Exclude: floor plans, blueprints, top-down layouts, isometric dollhouse cutaways, exterior-only shots. Merge: room type, design style, **exact palette named in the tabs**, staging level, floor material, lighting recipe, camera framing. If optional detail names objects, materials, or colors, weave them in without contradicting the tabs. Forbid: people and pets unless optional detail explicitly requests them; watermarks; readable brand logos on products; posters or signs with legible words—use abstract art or texture only. Demand crisp materials, believable scale, clean composition. Reply with that string only—no other text.`,
      title: i18n(`meta.title`),
    }) as const,
);
/* jscpd:ignore-end */
