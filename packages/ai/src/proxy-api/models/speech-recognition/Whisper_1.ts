/* eslint-disable @typescript-eslint/naming-convention */
import type { OpenAI } from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { SpeechRecognitionModel } from "./SpeechRecognitionModel";

export const Whisper_1 = (client: OpenAI, calculator: ProxyApiCostCalculator) =>
  SpeechRecognitionModel(`whisper-1`, calculator)(client);
