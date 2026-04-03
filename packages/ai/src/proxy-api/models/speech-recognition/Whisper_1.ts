/* eslint-disable @typescript-eslint/naming-convention */
import type openai from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { SpeechRecognitionModel } from "./SpeechRecognitionModel";

export const Whisper_1 = (client: InstanceType<typeof openai>, calculator: ProxyApiCostCalculator) =>
  SpeechRecognitionModel(`whisper-1`, calculator)(client);
