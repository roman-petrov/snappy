// cspell:disable
/* jscpd:ignore-start */
import type { Meta } from "../../common/Meta";

export const Data: Meta = () =>
  ({
    en: {
      emoji: `📈`,
      labels: { description: `Chart image from your numbers — rich styling`, title: `Diagram` },
      prompt: `You build image-generation prompts. From the **data** text (required — numbers and labels) and every bullet below, write **one** detailed prompt **for image generation**—a single clear chart image (it will be sent to the image model). Encode chart type, 2D/3D, **palette by name from tabs**, theme, background, legend placement, grid style. Demand legible axis labels and honest numbers—only what the user typed. End: no watermark. Reply with that string only—no other text.`,
      uiPlan: {
        fields: [
          {
            id: `data`,
            kind: `text`,
            label: `📊 Data`,
            placeholder: `Values, categories, units — paste here…`,
            prompt: `Data to visualize (numbers and labels):`,
          },
          {
            default: `bar`,
            id: `chart_type`,
            kind: `tabs_single`,
            label: `📉 Chart type`,
            options: [
              { label: `📊 Bar`, prompt: `Vertical or horizontal bar chart.`, value: `bar` },
              { label: `📈 Line`, prompt: `Line chart with markers for points.`, value: `line` },
              { label: `🥧 Pie`, prompt: `Pie chart: slices for shares of 100%.`, value: `pie` },
              { label: `🍩 Donut`, prompt: `Donut chart: ring with hollow center.`, value: `donut` },
              { label: `📊 Stacked bar`, prompt: `Stacked bar chart for part-to-whole by category.`, value: `stacked` },
              { label: `🕸️ Radar`, prompt: `Radar/spider chart for multi-axis comparison.`, value: `radar` },
            ],
          },
          {
            default: `2d`,
            id: `look`,
            kind: `tabs_single`,
            label: `🔲 Dimension`,
            options: [
              { label: `2️⃣ 2D`, prompt: `Flat 2D chart; crisp axes.`, value: `2d` },
              { label: `3️⃣ 3D`, prompt: `3D-style bars or slices; must stay readable.`, value: `3d` },
            ],
          },
          {
            default: `corporate_blue`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Palette`,
            options: [
              {
                label: `🔵 Corporate blue`,
                prompt: `Blues and grays; corporate dashboard look.`,
                value: `corporate_blue`,
              },
              {
                label: `🌈 Multi bright`,
                prompt: `Distinct saturated colors per series (red, green, blue, amber).`,
                value: `multi_bright`,
              },
              { label: `🌿 Green growth`, prompt: `Greens and earth accents; growth / eco feel.`, value: `green` },
              { label: `🌅 Sunset`, prompt: `Orange, magenta, purple gradient accents.`, value: `sunset` },
              { label: `⬛ Mono`, prompt: `Single-hue gradients from light to dark gray/blue.`, value: `mono` },
              { label: `🍭 Pastel`, prompt: `Soft pastel fills; gentle contrast.`, value: `pastel` },
              {
                label: `🌑 Dark UI`,
                prompt: `Dark background (#1a1a1a–#2d2d2d); light lines and bright series colors.`,
                value: `dark_ui`,
              },
              {
                label: `📰 Print`,
                prompt: `Print-friendly: black axes, limited palette, high contrast.`,
                value: `print`,
              },
            ],
          },
          {
            default: `clean`,
            id: `theme`,
            kind: `tabs_single`,
            label: `📐 Style`,
            options: [
              { label: `✨ Clean minimal`, prompt: `Minimal grid; lots of whitespace; thin axes.`, value: `clean` },
              {
                label: `💼 Business`,
                prompt: `Business report style: subtle shadows, clear legend box.`,
                value: `business`,
              },
              {
                label: `🎨 Infographic`,
                prompt: `Infographic: bold shapes, icons beside legend if space.`,
                value: `infographic`,
              },
              {
                label: `📱 App UI`,
                prompt: `App-widget style: rounded corners, soft card behind chart.`,
                value: `app`,
              },
              {
                label: `📰 Editorial`,
                prompt: `Editorial / newspaper chart: strong typography, simple color.`,
                value: `editorial`,
              },
            ],
          },
          {
            default: `white`,
            id: `background`,
            kind: `tabs_single`,
            label: `🖼️ Background`,
            options: [
              { label: `⬜ White`, prompt: `White or off-white chart background.`, value: `white` },
              { label: `📄 Light gray`, prompt: `Very light gray (#f5f5f5) plot area.`, value: `light_gray` },
              { label: `⬛ Dark`, prompt: `Dark plot area matching dark UI palette choice.`, value: `dark` },
              { label: `🔲 Grid paper`, prompt: `Subtle square grid behind data region only.`, value: `grid` },
            ],
          },
          {
            default: `bottom`,
            id: `legend`,
            kind: `tabs_single`,
            label: `📋 Legend`,
            options: [
              { label: `⬇️ Bottom`, prompt: `Legend below the chart.`, value: `bottom` },
              { label: `➡️ Right`, prompt: `Legend to the right of the plot.`, value: `right` },
              { label: `⬆️ Top`, prompt: `Legend above the chart.`, value: `top` },
              {
                label: `❌ Inline labels`,
                prompt: `Prefer direct labels on series; minimal or no legend box.`,
                value: `inline`,
              },
            ],
          },
          {
            default: `comfortable`,
            id: `density`,
            kind: `tabs_single`,
            label: `📏 Density`,
            options: [
              { label: `🌬️ Airy`, prompt: `Generous margins; fewer tick marks.`, value: `airy` },
              { label: `↔️ Standard`, prompt: `Balanced density for slides.`, value: `comfortable` },
              { label: `🧱 Compact`, prompt: `Tighter layout; more data per inch.`, value: `compact` },
            ],
          },
        ],
        title: `📈 Diagram`,
      },
    },
    group: `visual`,
    ru: {
      emoji: `📊`,
      labels: { description: `Диаграмма по числам — много настроек`, title: `Диаграмма` },
      prompt: `Ты составляешь промпты **для генерации изображения**: одна картинка с диаграммой (промпт получит модель картинки). Возьми **данные** из текста (обязательно) и каждый пункт табов: тип графика, 2D/3D, **палитру по названию из вкладок**, стиль, фон, легенду, плотность. Цифры только из ввода пользователя. Читаемые оси. В конце: без водяных знаков. Верни только эту строку — без другого текста.`,
      uiPlan: {
        fields: [
          {
            id: `data`,
            kind: `text`,
            label: `📊 Данные`,
            placeholder: `Числа, категории, единицы — вставьте…`,
            prompt: `Данные для графика (числа и подписи):`,
          },
          {
            default: `bar`,
            id: `chart_type`,
            kind: `tabs_single`,
            label: `📉 Тип`,
            options: [
              { label: `📊 Столбцы`, prompt: `Столбчатая диаграмма, вертикальная или горизонтальная.`, value: `bar` },
              { label: `📈 Линия`, prompt: `Линейный график с точками.`, value: `line` },
              { label: `🥧 Круг`, prompt: `Круговая: доли от 100%.`, value: `pie` },
              { label: `🍩 Кольцо`, prompt: `Кольцевая диаграмма.`, value: `donut` },
              { label: `📊 Сложенные`, prompt: `Сложенные столбцы по категориям.`, value: `stacked` },
              { label: `🕸️ Радар`, prompt: `Лепестковая / радар для многих осей.`, value: `radar` },
            ],
          },
          {
            default: `2d`,
            id: `look`,
            kind: `tabs_single`,
            label: `🔲 Измерение`,
            options: [
              { label: `2️⃣ 2D`, prompt: `Плоская 2D-диаграмма.`, value: `2d` },
              { label: `3️⃣ 3D`, prompt: `3D-подача; обязана оставаться читаемой.`, value: `3d` },
            ],
          },
          {
            default: `corporate_blue`,
            id: `palette`,
            kind: `tabs_single`,
            label: `🎨 Палитра`,
            options: [
              { label: `🔵 Деловая синяя`, prompt: `Синие и серые тона; дашборд.`, value: `corporate_blue` },
              { label: `🌈 Яркая мульти`, prompt: `Разные насыщенные цвета по рядам.`, value: `multi_bright` },
              { label: `🌿 Зелёная`, prompt: `Зелёные и земляные акценты.`, value: `green` },
              { label: `🌅 Закат`, prompt: `Оранж, пурпур, градиенты.`, value: `sunset` },
              { label: `⬛ Моно`, prompt: `Один оттенок от светлого к тёмному.`, value: `mono` },
              { label: `🍭 Пастель`, prompt: `Пастельные заливки.`, value: `pastel` },
              { label: `🌑 Тёмный UI`, prompt: `Тёмный фон; светлые линии и яркие серии.`, value: `dark_ui` },
              { label: `📰 Печать`, prompt: `Для печати: чёрные оси, мало цветов, контраст.`, value: `print` },
            ],
          },
          {
            default: `clean`,
            id: `theme`,
            kind: `tabs_single`,
            label: `📐 Стиль`,
            options: [
              { label: `✨ Минимализм`, prompt: `Минимум сетки и шума; тонкие оси.`, value: `clean` },
              { label: `💼 Бизнес`, prompt: `Отчётный стиль: лёгкая тень, рамка легенды.`, value: `business` },
              {
                label: `🎨 Инфографика`,
                prompt: `Инфографика: крупные формы, при желании иконки у легенды.`,
                value: `infographic`,
              },
              { label: `📱 Виджет`, prompt: `Как виджет приложения: скругления, карточка.`, value: `app` },
              { label: `📰 Газета`, prompt: `Редакционный график: сильная типографика.`, value: `editorial` },
            ],
          },
          {
            default: `white`,
            id: `background`,
            kind: `tabs_single`,
            label: `🖼️ Фон`,
            options: [
              { label: `⬜ Белый`, prompt: `Белый или почти белый фон.`, value: `white` },
              { label: `📄 Светло-серый`, prompt: `Светло-серая область графика.`, value: `light_gray` },
              { label: `⬛ Тёмный`, prompt: `Тёмная область под тёмный UI.`, value: `dark` },
              { label: `🔲 Клетка`, prompt: `Лёгкая клетка только в области данных.`, value: `grid` },
            ],
          },
          {
            default: `bottom`,
            id: `legend`,
            kind: `tabs_single`,
            label: `📋 Легенда`,
            options: [
              { label: `⬇️ Снизу`, prompt: `Легенда под графиком.`, value: `bottom` },
              { label: `➡️ Справа`, prompt: `Легенда справа от поля.`, value: `right` },
              { label: `⬆️ Сверху`, prompt: `Легенда над графиком.`, value: `top` },
              {
                label: `❌ Подписи на данных`,
                prompt: `Подписи на рядах; легенда минимальна или не нужна.`,
                value: `inline`,
              },
            ],
          },
          {
            default: `comfortable`,
            id: `density`,
            kind: `tabs_single`,
            label: `📏 Плотность`,
            options: [
              { label: `🌬️ Воздух`, prompt: `Большие поля; реже деления.`, value: `airy` },
              { label: `↔️ Обычная`, prompt: `Баланс для слайда.`, value: `comfortable` },
              { label: `🧱 Плотная`, prompt: `Плотнее; больше данных на кадр.`, value: `compact` },
            ],
          },
        ],
        title: `📊 Диаграмма`,
      },
    },
  }) as const;
/* jscpd:ignore-end */
