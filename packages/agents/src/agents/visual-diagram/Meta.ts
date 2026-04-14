// cspell:disable
/* jscpd:ignore-start */
import { Meta } from "../../common/Meta";

export const Data = Meta(
  () =>
    ({
      "meta.description": [``, `Chart image from your numbers — rich styling`, `Диаграмма по числам — много настроек`],
      "meta.title": [``, `Diagram`, `Диаграмма`],
      "ui.field.background.label": [`🖼️`, `Background`, `Фон`],
      "ui.field.background.option.dark.label": [`⬛`, `Dark`, `Тёмный`],
      "ui.field.background.option.grid.label": [`🔲`, `Grid paper`, `Клетка`],
      "ui.field.background.option.light_gray.label": [`📄`, `Light gray`, `Светло-серый`],
      "ui.field.background.option.white.label": [`⬜`, `White`, `Белый`],
      "ui.field.chart_type.label": [`📉`, `Chart type`, `Тип`],
      "ui.field.chart_type.option.bar.label": [`📊`, `Bar`, `Столбцы`],
      "ui.field.chart_type.option.donut.label": [`🍩`, `Donut`, `Кольцо`],
      "ui.field.chart_type.option.line.label": [`📈`, `Line`, `Линия`],
      "ui.field.chart_type.option.pie.label": [`🥧`, `Pie`, `Круг`],
      "ui.field.chart_type.option.radar.label": [`🕸️`, `Radar`, `Радар`],
      "ui.field.chart_type.option.stacked.label": [`📊`, `Stacked bar`, `Сложенные`],
      "ui.field.data.label": [`📊`, `Data`, `Данные`],
      "ui.field.data.placeholder": [
        ``,
        `Values, categories, units — paste here…`,
        `Числа, категории, единицы — вставьте…`,
      ],
      "ui.field.density.label": [`📏`, `Density`, `Плотность`],
      "ui.field.density.option.airy.label": [`🌬️`, `Airy`, `Воздух`],
      "ui.field.density.option.comfortable.label": [`↔️`, `Standard`, `Обычная`],
      "ui.field.density.option.compact.label": [`🧱`, `Compact`, `Плотная`],
      "ui.field.legend.label": [`📋`, `Legend`, `Легенда`],
      "ui.field.legend.option.bottom.label": [`⬇️`, `Bottom`, `Снизу`],
      "ui.field.legend.option.inline.label": [`❌`, `Inline labels`, `Подписи на данных`],
      "ui.field.legend.option.right.label": [`➡️`, `Right`, `Справа`],
      "ui.field.legend.option.top.label": [`⬆️`, `Top`, `Сверху`],
      "ui.field.look.label": [`🔲`, `Dimension`, `Измерение`],
      "ui.field.look.option.2d.label": [`2️⃣`, `2D`, `2D`],
      "ui.field.look.option.3d.label": [`3️⃣`, `3D`, `3D`],
      "ui.field.palette.label": [`🎨`, `Palette`, `Палитра`],
      "ui.field.palette.option.corporate_blue.label": [`🔵`, `Corporate blue`, `Деловая синяя`],
      "ui.field.palette.option.dark_ui.label": [`🌑`, `Dark UI`, `Тёмный UI`],
      "ui.field.palette.option.green.label": [`🌿`, `Green growth`, `Зелёная`],
      "ui.field.palette.option.mono.label": [`⬛`, `Mono`, `Моно`],
      "ui.field.palette.option.multi_bright.label": [`🌈`, `Multi bright`, `Яркая мульти`],
      "ui.field.palette.option.pastel.label": [`🍭`, `Pastel`, `Пастель`],
      "ui.field.palette.option.print.label": [`📰`, `Print`, `Печать`],
      "ui.field.palette.option.sunset.label": [`🌅`, `Sunset`, `Закат`],
      "ui.field.theme.label": [`📐`, `Style`, `Стиль`],
      "ui.field.theme.option.app.label": [`📱`, `App UI`, `Виджет`],
      "ui.field.theme.option.business.label": [`💼`, `Business`, `Бизнес`],
      "ui.field.theme.option.clean.label": [`✨`, `Clean minimal`, `Минимализм`],
      "ui.field.theme.option.editorial.label": [`📰`, `Editorial`, `Газета`],
      "ui.field.theme.option.infographic.label": [`🎨`, `Infographic`, `Инфографика`],
    }) as const,
  ({ i18n }) =>
    ({
      description: i18n(`meta.description`),
      emoji: `📈`,
      group: `visual`,
      prompt: `You build image-generation prompts. From the **data** text (required — numbers and labels) and every bullet below, write **one** detailed prompt **for image generation**—a single clear chart image (it will be sent to the image model). Encode chart type, 2D/3D, **palette by name from tabs**, theme, background, legend placement, grid style. Demand legible axis labels and honest numbers—only what the user typed. End: no watermark. Reply with that string only—no other text.`,
      title: i18n(`meta.title`),
      uiPlan: {
        fields: [
          {
            id: `data`,
            kind: `text`,
            label: i18n(`ui.field.data.label`),
            placeholder: i18n(`ui.field.data.placeholder`),
            prompt: `Data to visualize (numbers and labels):`,
          },
          {
            default: `bar`,
            id: `chart_type`,
            kind: `tabs_single`,
            label: i18n(`ui.field.chart_type.label`),
            options: [
              {
                label: i18n(`ui.field.chart_type.option.bar.label`),
                prompt: `Vertical or horizontal bar chart.`,
                value: `bar`,
              },
              {
                label: i18n(`ui.field.chart_type.option.line.label`),
                prompt: `Line chart with markers for points.`,
                value: `line`,
              },
              {
                label: i18n(`ui.field.chart_type.option.pie.label`),
                prompt: `Pie chart: slices for shares of 100%.`,
                value: `pie`,
              },
              {
                label: i18n(`ui.field.chart_type.option.donut.label`),
                prompt: `Donut chart: ring with hollow center.`,
                value: `donut`,
              },
              {
                label: i18n(`ui.field.chart_type.option.stacked.label`),
                prompt: `Stacked bar chart for part-to-whole by category.`,
                value: `stacked`,
              },
              {
                label: i18n(`ui.field.chart_type.option.radar.label`),
                prompt: `Radar/spider chart for multi-axis comparison.`,
                value: `radar`,
              },
            ],
          },
          {
            default: `2d`,
            id: `look`,
            kind: `tabs_single`,
            label: i18n(`ui.field.look.label`),
            options: [
              { label: i18n(`ui.field.look.option.2d.label`), prompt: `Flat 2D chart; crisp axes.`, value: `2d` },
              {
                label: i18n(`ui.field.look.option.3d.label`),
                prompt: `3D-style bars or slices; must stay readable.`,
                value: `3d`,
              },
            ],
          },
          {
            default: `corporate_blue`,
            id: `palette`,
            kind: `tabs_single`,
            label: i18n(`ui.field.palette.label`),
            options: [
              {
                label: i18n(`ui.field.palette.option.corporate_blue.label`),
                prompt: `Blues and grays; corporate dashboard look.`,
                value: `corporate_blue`,
              },
              {
                label: i18n(`ui.field.palette.option.multi_bright.label`),
                prompt: `Distinct saturated colors per series (red, green, blue, amber).`,
                value: `multi_bright`,
              },
              {
                label: i18n(`ui.field.palette.option.green.label`),
                prompt: `Greens and earth accents; growth / eco feel.`,
                value: `green`,
              },
              {
                label: i18n(`ui.field.palette.option.sunset.label`),
                prompt: `Orange, magenta, purple gradient accents.`,
                value: `sunset`,
              },
              {
                label: i18n(`ui.field.palette.option.mono.label`),
                prompt: `Single-hue gradients from light to dark gray/blue.`,
                value: `mono`,
              },
              {
                label: i18n(`ui.field.palette.option.pastel.label`),
                prompt: `Soft pastel fills; gentle contrast.`,
                value: `pastel`,
              },
              {
                label: i18n(`ui.field.palette.option.dark_ui.label`),
                prompt: `Dark background (#1a1a1a–#2d2d2d); light lines and bright series colors.`,
                value: `dark_ui`,
              },
              {
                label: i18n(`ui.field.palette.option.print.label`),
                prompt: `Print-friendly: black axes, limited palette, high contrast.`,
                value: `print`,
              },
            ],
          },
          {
            default: `clean`,
            id: `theme`,
            kind: `tabs_single`,
            label: i18n(`ui.field.theme.label`),
            options: [
              {
                label: i18n(`ui.field.theme.option.clean.label`),
                prompt: `Minimal grid; lots of whitespace; thin axes.`,
                value: `clean`,
              },
              {
                label: i18n(`ui.field.theme.option.business.label`),
                prompt: `Business report style: subtle shadows, clear legend box.`,
                value: `business`,
              },
              {
                label: i18n(`ui.field.theme.option.infographic.label`),
                prompt: `Infographic: bold shapes, icons beside legend if space.`,
                value: `infographic`,
              },
              {
                label: i18n(`ui.field.theme.option.app.label`),
                prompt: `App-widget style: rounded corners, soft card behind chart.`,
                value: `app`,
              },
              {
                label: i18n(`ui.field.theme.option.editorial.label`),
                prompt: `Editorial / newspaper chart: strong typography, simple color.`,
                value: `editorial`,
              },
            ],
          },
          {
            default: `white`,
            id: `background`,
            kind: `tabs_single`,
            label: i18n(`ui.field.background.label`),
            options: [
              {
                label: i18n(`ui.field.background.option.white.label`),
                prompt: `White or off-white chart background.`,
                value: `white`,
              },
              {
                label: i18n(`ui.field.background.option.light_gray.label`),
                prompt: `Very light gray (#f5f5f5) plot area.`,
                value: `light_gray`,
              },
              {
                label: i18n(`ui.field.background.option.dark.label`),
                prompt: `Dark plot area matching dark UI palette choice.`,
                value: `dark`,
              },
              {
                label: i18n(`ui.field.background.option.grid.label`),
                prompt: `Subtle square grid behind data region only.`,
                value: `grid`,
              },
            ],
          },
          {
            default: `bottom`,
            id: `legend`,
            kind: `tabs_single`,
            label: i18n(`ui.field.legend.label`),
            options: [
              {
                label: i18n(`ui.field.legend.option.bottom.label`),
                prompt: `Legend below the chart.`,
                value: `bottom`,
              },
              {
                label: i18n(`ui.field.legend.option.right.label`),
                prompt: `Legend to the right of the plot.`,
                value: `right`,
              },
              { label: i18n(`ui.field.legend.option.top.label`), prompt: `Legend above the chart.`, value: `top` },
              {
                label: i18n(`ui.field.legend.option.inline.label`),
                prompt: `Prefer direct labels on series; minimal or no legend box.`,
                value: `inline`,
              },
            ],
          },
          {
            default: `comfortable`,
            id: `density`,
            kind: `tabs_single`,
            label: i18n(`ui.field.density.label`),
            options: [
              {
                label: i18n(`ui.field.density.option.airy.label`),
                prompt: `Generous margins; fewer tick marks.`,
                value: `airy`,
              },
              {
                label: i18n(`ui.field.density.option.comfortable.label`),
                prompt: `Balanced density for slides.`,
                value: `comfortable`,
              },
              {
                label: i18n(`ui.field.density.option.compact.label`),
                prompt: `Tighter layout; more data per inch.`,
                value: `compact`,
              },
            ],
          },
        ],
      },
    }) as const,
);
/* jscpd:ignore-end */
