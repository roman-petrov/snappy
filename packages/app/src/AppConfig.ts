/* eslint-disable @typescript-eslint/no-magic-numbers */
import { _ } from "@snappy/core";

const authEmailCooldownSec = _.minute.seconds;
const billing = { pollEvery: 2 * _.second, pollFor: 30 * _.second };
const supportEmail = `hello@snappy-ai.ru`;

export const AppConfig = { authEmailCooldownSec, billing, supportEmail };
