/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
import type { OpenAI } from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { SpeechRecognitionModel } from "./SpeechRecognitionModel";

export const Gpt_4_o_Transcribe = (client: OpenAI, calculator: ProxyApiCostCalculator) =>
  SpeechRecognitionModel(`gpt-4o-transcribe`, calculator)(client);
