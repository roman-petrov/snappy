/* eslint-disable unicorn/filename-case */
/* eslint-disable @typescript-eslint/naming-convention */
import type openai from "openai";

import type { ProxyApiCostCalculator } from "../../ProxyApiCostCalculator";

import { ChatModel } from "./ChatModel";

export const Gpt_5_4_Mini = (client: InstanceType<typeof openai>, calculator: ProxyApiCostCalculator) =>
  ChatModel(`gpt-5.4-mini`, calculator)(client);
