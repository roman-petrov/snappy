/* eslint-disable unicorn/filename-case */
/* cspell:disable */
export const ru = {
  modelPrompt: {
    choiceOutOfRange: `Введите число от 1 до {max}.`,
    chooseChat: `Выберите модель чата (введите номер):`,
    chooseEmbedding: `Выберите embedding модель (введите номер):`,
    pickModelNumber: `Номер модели › `,
  },
  repl: {
    commands: `Команды: /exit /help`,
    helpExit: `выход`,
    helpIndexing: `Индексация запускается при старте coder.`,
    helpText: `эта справка`,
    indexHint: `Индекс кода обновляется инкрементально при запуске (manifest mtime/size).`,
    project: `проект`,
  },
  startup: {
    continueWithoutFreshIndex: `продолжаю без свежего индекса.`,
    indexingFailed: `Ошибка индексации`,
    indexingFile: `Файл индексации`,
    indexingStart: `Индекс`,
    indexingStatus: `Обновляю индекс кода`,
    ready: `Индекс готов`,
    unchanged: `без изменений`,
    updated: `обновлено`,
  },
  status: { thinking: `Думаю...`, thought: `Мысль` },
} as const;
