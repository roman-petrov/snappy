/* eslint-disable unicorn/filename-case */
/* cspell:disable */
export const en = {
  modelPrompt: {
    choiceOutOfRange: `Enter a number from 1 to {max}.`,
    chooseChat: `Choose chat model (enter number):`,
    chooseEmbedding: `Choose embedding model (enter number):`,
    pickModelNumber: `Model number › `,
  },
  repl: {
    commands: `Commands: /exit /help`,
    helpExit: `quit`,
    helpIndexing: `Indexing runs when you launch coder.`,
    helpText: `this text`,
    indexHint: `Code index updates incrementally at startup (mtime/size manifest).`,
    project: `project`,
  },
  startup: {
    continueWithoutFreshIndex: `continuing without a fresh index.`,
    indexingFailed: `Indexing failed`,
    indexingFile: `Indexing file`,
    indexingStart: `Index`,
    indexingStatus: `Updating code index`,
    ready: `Index ready`,
    skippedFilesError: `Found files without chunks ({count}):`,
    unchanged: `unchanged`,
    updated: `updated`,
  },
} as const;
