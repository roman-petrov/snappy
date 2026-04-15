/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
import type { OpenAI } from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { ChatModel } from "./ChatModel";

export const Gpt_5_4_Nano = (client: OpenAI, calculator: ProxyApiCostCalculator) =>
  ChatModel(`gpt-5.4-nano`, calculator)(client);
