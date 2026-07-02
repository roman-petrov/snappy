// cspell:disable
import { Flow, type Preset, Prompts } from "..";

const meta = {
  description: [`Chart from your data with rich styling options`, `Диаграмма по вашим данным с гибким оформлением`],
  emoji: `📊`,
  group: `visual`,
  title: [`Diagram`, `Диаграмма`],
} as const;

export const preset: Preset = {
  flows: [
    Flow.snappy(meta, {
      prompt: [`I need a flowchart or process diagram.`, `Нужна блок-схема или диаграмма процесса.`],
      skill: `visual-diagram-generation`,
      tools: [`ask`, `date-time`, `look-image`, `publish-image`],
    }),
    Flow.staticVisual(meta, {
      fields: ({ form, i18n }) =>
        form([
          {
            id: `data`,
            kind: `text_input`,
            label: { emoji: `📊`, text: i18n(`ui.field.data.label`) },
            placeholder: i18n(`ui.field.data.placeholder`),
            prompt: i18n(`ui.field.data.prompt`),
          },
          {
            default: `bar`,
            id: `chart_type`,
            kind: `single_choice`,
            label: { emoji: `📉`, text: i18n(`ui.field.chart_type.label`) },
            options: [
              {
                label: { emoji: `📊`, text: i18n(`ui.field.chart_type.option.bar.label`) },
                prompt: i18n(`ui.field.chart_type.option.bar.prompt`),
                value: `bar`,
              },
              {
                label: { emoji: `📈`, text: i18n(`ui.field.chart_type.option.line.label`) },
                prompt: i18n(`ui.field.chart_type.option.line.prompt`),
                value: `line`,
              },
              {
                label: { emoji: `🥧`, text: i18n(`ui.field.chart_type.option.pie.label`) },
                prompt: i18n(`ui.field.chart_type.option.pie.prompt`),
                value: `pie`,
              },
              {
                label: { emoji: `🍩`, text: i18n(`ui.field.chart_type.option.donut.label`) },
                prompt: i18n(`ui.field.chart_type.option.donut.prompt`),
                value: `donut`,
              },
              {
                label: { emoji: `📊`, text: i18n(`ui.field.chart_type.option.stacked.label`) },
                prompt: i18n(`ui.field.chart_type.option.stacked.prompt`),
                value: `stacked`,
              },
              {
                label: { emoji: `🕸️`, text: i18n(`ui.field.chart_type.option.radar.label`) },
                prompt: i18n(`ui.field.chart_type.option.radar.prompt`),
                value: `radar`,
              },
            ],
          },
          {
            default: `2d`,
            id: `look`,
            kind: `single_choice`,
            label: { emoji: `🔲`, text: i18n(`ui.field.look.label`) },
            options: [
              {
                label: { emoji: `2️⃣`, text: i18n(`ui.field.look.option.2d.label`) },
                prompt: i18n(`ui.field.look.option.2d.prompt`),
                value: `2d`,
              },
              {
                label: { emoji: `3️⃣`, text: i18n(`ui.field.look.option.3d.label`) },
                prompt: i18n(`ui.field.look.option.3d.prompt`),
                value: `3d`,
              },
            ],
          },
          {
            default: `corporate_blue`,
            id: `palette`,
            kind: `single_choice`,
            label: { emoji: `🎨`, text: i18n(`ui.field.palette.label`) },
            options: [
              {
                label: { emoji: `🔵`, text: i18n(`ui.field.palette.option.corporate_blue.label`) },
                prompt: i18n(`ui.field.palette.option.corporate_blue.prompt`),
                value: `corporate_blue`,
              },
              {
                label: { emoji: `🌈`, text: i18n(`ui.field.palette.option.multi_bright.label`) },
                prompt: i18n(`ui.field.palette.option.multi_bright.prompt`),
                value: `multi_bright`,
              },
              {
                label: { emoji: `🌿`, text: i18n(`ui.field.palette.option.green.label`) },
                prompt: i18n(`ui.field.palette.option.green.prompt`),
                value: `green`,
              },
              {
                label: { emoji: `🌅`, text: i18n(`ui.field.palette.option.sunset.label`) },
                prompt: i18n(`ui.field.palette.option.sunset.prompt`),
                value: `sunset`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.palette.option.mono.label`) },
                prompt: i18n(`ui.field.palette.option.mono.prompt`),
                value: `mono`,
              },
              {
                label: { emoji: `🍭`, text: i18n(`ui.field.palette.option.pastel.label`) },
                prompt: i18n(`ui.field.palette.option.pastel.prompt`),
                value: `pastel`,
              },
              {
                label: { emoji: `🌑`, text: i18n(`ui.field.palette.option.dark_ui.label`) },
                prompt: i18n(`ui.field.palette.option.dark_ui.prompt`),
                value: `dark_ui`,
              },
              {
                label: { emoji: `📰`, text: i18n(`ui.field.palette.option.print.label`) },
                prompt: i18n(`ui.field.palette.option.print.prompt`),
                value: `print`,
              },
            ],
          },
          {
            default: `clean`,
            id: `theme`,
            kind: `single_choice`,
            label: { emoji: `📐`, text: i18n(`ui.field.theme.label`) },
            options: [
              {
                label: { emoji: `✨`, text: i18n(`ui.field.theme.option.clean.label`) },
                prompt: i18n(`ui.field.theme.option.clean.prompt`),
                value: `clean`,
              },
              {
                label: { emoji: `💼`, text: i18n(`ui.field.theme.option.business.label`) },
                prompt: i18n(`ui.field.theme.option.business.prompt`),
                value: `business`,
              },
              {
                label: { emoji: `🎨`, text: i18n(`ui.field.theme.option.infographic.label`) },
                prompt: i18n(`ui.field.theme.option.infographic.prompt`),
                value: `infographic`,
              },
              {
                label: { emoji: `📱`, text: i18n(`ui.field.theme.option.app.label`) },
                prompt: i18n(`ui.field.theme.option.app.prompt`),
                value: `app`,
              },
              {
                label: { emoji: `📰`, text: i18n(`ui.field.theme.option.editorial.label`) },
                prompt: i18n(`ui.field.theme.option.editorial.prompt`),
                value: `editorial`,
              },
            ],
          },
          {
            default: `white`,
            id: `background`,
            kind: `single_choice`,
            label: { emoji: `🖼️`, text: i18n(`ui.field.background.label`) },
            options: [
              {
                label: { emoji: `⬜`, text: i18n(`ui.field.background.option.white.label`) },
                prompt: i18n(`ui.field.background.option.white.prompt`),
                value: `white`,
              },
              {
                label: { emoji: `📄`, text: i18n(`ui.field.background.option.light_gray.label`) },
                prompt: i18n(`ui.field.background.option.light_gray.prompt`),
                value: `light_gray`,
              },
              {
                label: { emoji: `⬛`, text: i18n(`ui.field.background.option.dark.label`) },
                prompt: i18n(`ui.field.background.option.dark.prompt`),
                value: `dark`,
              },
              {
                label: { emoji: `🔲`, text: i18n(`ui.field.background.option.grid.label`) },
                prompt: i18n(`ui.field.background.option.grid.prompt`),
                value: `grid`,
              },
            ],
          },
          {
            default: `bottom`,
            id: `legend`,
            kind: `single_choice`,
            label: { emoji: `📋`, text: i18n(`ui.field.legend.label`) },
            options: [
              {
                label: { emoji: `⬇️`, text: i18n(`ui.field.legend.option.bottom.label`) },
                prompt: i18n(`ui.field.legend.option.bottom.prompt`),
                value: `bottom`,
              },
              {
                label: { emoji: `➡️`, text: i18n(`ui.field.legend.option.right.label`) },
                prompt: i18n(`ui.field.legend.option.right.prompt`),
                value: `right`,
              },
              {
                label: { emoji: `⬆️`, text: i18n(`ui.field.legend.option.top.label`) },
                prompt: i18n(`ui.field.legend.option.top.prompt`),
                value: `top`,
              },
              {
                label: { emoji: `🏷️`, text: i18n(`ui.field.legend.option.inline.label`) },
                prompt: i18n(`ui.field.legend.option.inline.prompt`),
                value: `inline`,
              },
            ],
          },
          {
            default: `comfortable`,
            id: `density`,
            kind: `single_choice`,
            label: { emoji: `📏`, text: i18n(`ui.field.density.label`) },
            options: [
              {
                label: { emoji: `🌬️`, text: i18n(`ui.field.density.option.airy.label`) },
                prompt: i18n(`ui.field.density.option.airy.prompt`),
                value: `airy`,
              },
              {
                label: { emoji: `↔️`, text: i18n(`ui.field.density.option.comfortable.label`) },
                prompt: i18n(`ui.field.density.option.comfortable.prompt`),
                value: `comfortable`,
              },
              {
                label: { emoji: `🧱`, text: i18n(`ui.field.density.option.compact.label`) },
                prompt: i18n(`ui.field.density.option.compact.prompt`),
                value: `compact`,
              },
            ],
          },
        ]),
      format: `landscape`,
      localization: () => ({
        "prompt": Prompts.visual.joinMeta([
          `You build image-generation prompts. From the **data** text (required — numbers and labels) and every bullet below, write **one** detailed prompt **for image generation**—a single clear chart image (it will be sent to the image model). Encode chart type, 2D/3D, **palette by name from tabs**, theme, background, legend placement, grid style. Demand legible axis labels and honest numbers—only what the user typed.`,
          `Собери **один** промпт для генерации **одного** чёткого изображения диаграммы по полю **данные** (обязательно — числа и подписи) и каждому пункту ниже. Закодируй тип графика, 2D/3D, **палитру по названию вкладок**, стиль, фон, легенду, сетку. Требуй читаемые оси и честные числа — только то, что ввёл пользователь.`,
        ]),
        "ui.field.background.label": [`Background`, `Фон`],
        "ui.field.background.option.dark.label": [`Dark`, `Тёмный`],
        "ui.field.background.option.dark.prompt": [
          `Dark plot area matching dark UI palette choice.`,
          `Тёмная область графика в духе тёмной палитры UI.`,
        ],
        "ui.field.background.option.grid.label": [`Grid paper`, `Клетка`],
        "ui.field.background.option.grid.prompt": [
          `Subtle square grid behind data region only.`,
          `Лёгкая квадратная сетка только за областью данных.`,
        ],
        "ui.field.background.option.light_gray.label": [`Light gray`, `Светло-серый`],
        "ui.field.background.option.light_gray.prompt": [
          `Very light gray (#f5f5f5) plot area.`,
          `Очень светло-серая (#f5f5f5) область построения.`,
        ],
        "ui.field.background.option.white.label": [`White`, `Белый`],
        "ui.field.background.option.white.prompt": [
          `White or off-white chart background.`,
          `Белый или слегка кремовый фон диаграммы.`,
        ],
        "ui.field.chart_type.label": [`Chart type`, `Тип`],
        "ui.field.chart_type.option.bar.label": [`Bar`, `Столбцы`],
        "ui.field.chart_type.option.bar.prompt": [
          `Vertical or horizontal bar chart.`,
          `Вертикальная или горизонтальная столбчатая диаграмма.`,
        ],
        "ui.field.chart_type.option.donut.label": [`Donut`, `Кольцо`],
        "ui.field.chart_type.option.donut.prompt": [
          `Donut chart: ring with hollow center.`,
          `Кольцевая диаграмма с пустым центром.`,
        ],
        "ui.field.chart_type.option.line.label": [`Line`, `Линия`],
        "ui.field.chart_type.option.line.prompt": [
          `Line chart with markers for points.`,
          `Линейный график с маркерами точек.`,
        ],
        "ui.field.chart_type.option.pie.label": [`Pie`, `Круг`],
        "ui.field.chart_type.option.pie.prompt": [
          `Pie chart: slices for shares of 100%.`,
          `Круговая диаграмма: доли на 100%.`,
        ],
        "ui.field.chart_type.option.radar.label": [`Radar`, `Радар`],
        "ui.field.chart_type.option.radar.prompt": [
          `Radar/spider chart for multi-axis comparison.`,
          `Радар / паутина для сравнения по нескольким осям.`,
        ],
        "ui.field.chart_type.option.stacked.label": [`Stacked bar`, `Сложенные`],
        "ui.field.chart_type.option.stacked.prompt": [
          `Stacked bar chart for part-to-whole by category.`,
          `Сложенные столбцы: части целого по категориям.`,
        ],
        "ui.field.data.label": [`Data`, `Данные`],
        "ui.field.data.placeholder": [
          `Values, categories, units — paste here…`,
          `Числа, категории, единицы — вставьте…`,
        ],
        "ui.field.data.prompt": [
          `Data to visualize (numbers and labels):`,
          `Данные для визуализации (числа и подписи):`,
        ],
        "ui.field.density.label": [`Density`, `Плотность`],
        "ui.field.density.option.airy.label": [`Airy`, `Воздух`],
        "ui.field.density.option.airy.prompt": [
          `Generous margins; fewer tick marks.`,
          `Большие поля; меньше делений осей.`,
        ],
        "ui.field.density.option.comfortable.label": [`Standard`, `Обычная`],
        "ui.field.density.option.comfortable.prompt": [
          `Balanced density for slides.`,
          `Сбалансированная плотность для слайдов.`,
        ],
        "ui.field.density.option.compact.label": [`Compact`, `Плотная`],
        "ui.field.density.option.compact.prompt": [
          `Tighter layout; more data per inch.`,
          `Плотнее; больше данных на единицу площади.`,
        ],
        "ui.field.legend.label": [`Legend`, `Легенда`],
        "ui.field.legend.option.bottom.label": [`Bottom`, `Снизу`],
        "ui.field.legend.option.bottom.prompt": [`Legend below the chart.`, `Легенда под диаграммой.`],
        "ui.field.legend.option.inline.label": [`Inline labels`, `Подписи на данных`],
        "ui.field.legend.option.inline.prompt": [
          `Prefer direct labels on series; minimal or no legend box.`,
          `Подписи на рядах; легенда минимальна или без блока.`,
        ],
        "ui.field.legend.option.right.label": [`Right`, `Справа`],
        "ui.field.legend.option.right.prompt": [
          `Legend to the right of the plot.`,
          `Легенда справа от области графика.`,
        ],
        "ui.field.legend.option.top.label": [`Top`, `Сверху`],
        "ui.field.legend.option.top.prompt": [`Legend above the chart.`, `Легенда над диаграммой.`],
        "ui.field.look.label": [`Dimension`, `Измерение`],
        "ui.field.look.option.2d.label": [`2D`, `2D`],
        "ui.field.look.option.2d.prompt": [`Flat 2D chart; crisp axes.`, `Плоский 2D; чёткие оси.`],
        "ui.field.look.option.3d.label": [`3D`, `3D`],
        "ui.field.look.option.3d.prompt": [
          `3D-style bars or slices; must stay readable.`,
          `3D-стиль столбцов или долей; обязана читаться.`,
        ],
        "ui.field.palette.label": [`Palette`, `Палитра`],
        "ui.field.palette.option.corporate_blue.label": [`Corporate blue`, `Деловая синяя`],
        "ui.field.palette.option.corporate_blue.prompt": [
          `Blues and grays; corporate dashboard look.`,
          `Синие и серые; деловой дашборд.`,
        ],
        "ui.field.palette.option.dark_ui.label": [`Dark UI`, `Тёмный UI`],
        "ui.field.palette.option.dark_ui.prompt": [
          `Dark background (#1a1a1a–#2d2d2d); light lines and bright series colors.`,
          `Тёмный фон (#1a1a1a–#2d2d2d); светлые линии и яркие ряды.`,
        ],
        "ui.field.palette.option.green.label": [`Green growth`, `Зелёная`],
        "ui.field.palette.option.green.prompt": [
          `Greens and earth accents; growth / eco feel.`,
          `Зелёные и земляные акценты; рост / эко.`,
        ],
        "ui.field.palette.option.mono.label": [`Mono`, `Моно`],
        "ui.field.palette.option.mono.prompt": [
          `Single-hue gradients from light to dark gray/blue.`,
          `Градиенты в одном тоне от светлого к тёмному серому/синему.`,
        ],
        "ui.field.palette.option.multi_bright.label": [`Multi bright`, `Яркая мульти`],
        "ui.field.palette.option.multi_bright.prompt": [
          `Distinct saturated colors per series (red, green, blue, amber).`,
          `Разные насыщенные цвета по рядам (красный, зелёный, синий, янтарь).`,
        ],
        "ui.field.palette.option.pastel.label": [`Pastel`, `Пастель`],
        "ui.field.palette.option.pastel.prompt": [
          `Soft pastel fills; gentle contrast.`,
          `Мягкая пастель; деликатный контраст.`,
        ],
        "ui.field.palette.option.print.label": [`Print`, `Печать`],
        "ui.field.palette.option.print.prompt": [
          `Print-friendly: black axes, limited palette, high contrast.`,
          `Для печати: чёрные оси, ограниченная палитра, высокий контраст.`,
        ],
        "ui.field.palette.option.sunset.label": [`Sunset`, `Закат`],
        "ui.field.palette.option.sunset.prompt": [
          `Orange, magenta, purple gradient accents.`,
          `Оранжевый, пурпурный, фиолетовый в градиентах.`,
        ],
        "ui.field.theme.label": [`Style`, `Стиль`],
        "ui.field.theme.option.app.label": [`App UI`, `Виджет`],
        "ui.field.theme.option.app.prompt": [
          `App-widget style: rounded corners, soft card behind chart.`,
          `Стиль виджета: скругления, мягкая карточка за графиком.`,
        ],
        "ui.field.theme.option.business.label": [`Business`, `Бизнес`],
        "ui.field.theme.option.business.prompt": [
          `Business report style: subtle shadows, clear legend box.`,
          `Отчёт: лёгкие тени, чёткий блок легенды.`,
        ],
        "ui.field.theme.option.clean.label": [`Clean minimal`, `Минимализм`],
        "ui.field.theme.option.clean.prompt": [
          `Minimal grid; lots of whitespace; thin axes.`,
          `Минимальная сетка; много воздуха; тонкие оси.`,
        ],
        "ui.field.theme.option.editorial.label": [`Editorial`, `Газета`],
        "ui.field.theme.option.editorial.prompt": [
          `Editorial / newspaper chart: strong typography, simple color.`,
          `Газетный график: сильная типографика, простой цвет.`,
        ],
        "ui.field.theme.option.infographic.label": [`Infographic`, `Инфографика`],
        "ui.field.theme.option.infographic.prompt": [
          `Infographic: bold shapes, icons beside legend if space.`,
          `Инфографика: жирные формы, иконки у легенды при месте.`,
        ],
      }),
    }),
  ],
  meta,
};
