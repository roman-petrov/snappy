export type SpeechEngine = (options: SpeechRecognizerOptions) => SpeechRecognizerStop;

export type SpeechRecognizer = (recognition: SpeechRecognition) => SpeechEngine;

export type SpeechRecognizerLang = `en` | `ru`;

export type SpeechRecognizerOptions = { lang: SpeechRecognizerLang; onText: (text: string) => void };

export type SpeechRecognizerStop = () => Promise<void>;
