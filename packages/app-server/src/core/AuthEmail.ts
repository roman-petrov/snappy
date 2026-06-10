/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { Email } from "@snappy/email";

import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { APIError } from "better-auth/api";

import { Mail } from "./Mail";

export const AuthEmail = () => {
  const lastSentAt = new Map<string, number>();
  const normalized = (email: string) => email.trim().toLowerCase();

  const remainingSec = (email: string) => {
    const sentAt = lastSentAt.get(normalized(email));
    if (sentAt === undefined) {
      return 0;
    }

    const elapsedSec = Math.floor((_.now() - sentAt) / _.second);

    return Math.max(0, Config.authEmailCooldownSec - elapsedSec);
  };

  const canSend = (email: string) => remainingSec(email) === 0;

  const assertCanSend = (email: string) => {
    const waitSec = remainingSec(email);
    if (waitSec === 0) {
      return;
    }

    throw new APIError(`TOO_MANY_REQUESTS`, { message: `Email cooldown active`, retryAfter: waitSec });
  };

  const markSent = (email: string) => lastSentAt.set(normalized(email), _.now());

  const send = async (to: string, message: Email | Promise<Email>) => {
    assertCanSend(to);
    await Mail.send(to, await message);
    markSent(to);
  };

  return { canSend, send };
};

export type AuthEmail = ReturnType<typeof AuthEmail>;
