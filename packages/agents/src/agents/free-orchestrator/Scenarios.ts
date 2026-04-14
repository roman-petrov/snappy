import type { AgentLocale } from "../../Types";

const ru: string[] = [
  `Поздравление`,
  `Улучшение текста`,
  `Протокол встречи`,
  `Резюме аудио`,
  `Аватар`,
  `Диаграмма`,
  `Иконка`,
  `Интерьер`,
  `Логотип`,
  `Открытка`,
];

const en: string[] = [
  `Greeting`,
  `Improve text`,
  `Meeting notes`,
  `Audio summary`,
  `Avatar`,
  `Diagram`,
  `Icon`,
  `Interior`,
  `Logo`,
  `Postcard`,
];

export const scenarios = (locale: AgentLocale) => (locale === `ru` ? ru : en);
