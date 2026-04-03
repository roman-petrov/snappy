/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
import type openai from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { SpeechRecognitionModel } from "./SpeechRecognitionModel";

export const Gpt_4_o_Transcribe = (client: InstanceType<typeof openai>, calculator: ProxyApiCostCalculator) =>
  SpeechRecognitionModel(`gpt-4o-transcribe`, calculator)(client);
