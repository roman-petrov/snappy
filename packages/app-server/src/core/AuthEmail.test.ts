import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { APIError } from "better-auth/api";
import { describe, expect, it, vi } from "vitest";

import { AuthEmail } from "./AuthEmail";
import { Mail } from "./Mail";

vi.mock(`./Mail`, () => ({ Mail: { send: vi.fn().mockResolvedValue(undefined) } }));

const message = { html: `<p>Hi</p>`, subject: `Subject`, text: `Hi` };

describe(`canSend`, () => {
  it(`returns true when email was not sent yet`, () => {
    const email = AuthEmail();

    expect(email.canSend(`user@example.com`)).toBe(true);
  });

  it(`returns false after send during cooldown`, async () => {
    const email = AuthEmail();
    await email.send(`user@example.com`, message);

    expect(email.canSend(`user@example.com`)).toBe(false);
  });

  it(`treats email case and whitespace as the same address`, async () => {
    const email = AuthEmail();
    await email.send(`  User@Example.com  `, message);

    expect(email.canSend(`user@example.com`)).toBe(false);
  });

  it(`does not share cooldown with another instance`, async () => {
    const reset = AuthEmail();
    const verify = AuthEmail();
    await reset.send(`user@example.com`, message);

    expect(reset.canSend(`user@example.com`)).toBe(false);
    expect(verify.canSend(`user@example.com`)).toBe(true);
  });
});

describe(`send`, () => {
  it(`calls Mail.send with recipient and message`, async () => {
    vi.mocked(Mail.send).mockClear();
    const email = AuthEmail();
    await email.send(`user@example.com`, message);

    expect(Mail.send).toHaveBeenCalledWith(`user@example.com`, message);
  });

  it(`calls Mail.send with resolved async message`, async () => {
    vi.mocked(Mail.send).mockClear();
    const email = AuthEmail();
    await email.send(`user@example.com`, Promise.resolve(message));

    expect(Mail.send).toHaveBeenCalledWith(`user@example.com`, message);
  });

  it(`throws TOO_MANY_REQUESTS with retryAfter while cooldown is active`, async () => {
    const email = AuthEmail();
    await email.send(`user@example.com`, message);

    await expect(email.send(`user@example.com`, message)).rejects.toSatisfy((error: unknown) => {
      if (!(error instanceof APIError) || error.status !== `TOO_MANY_REQUESTS`) {
        return false;
      }

      const { body } = error;
      if (body === undefined || !(`retryAfter` in body)) {
        return false;
      }

      const { retryAfter } = body;

      return _.isNumber(retryAfter) && retryAfter > 0 && retryAfter <= Config.authEmailCooldownSec;
    });
  });

  it(`does not call Mail.send when cooldown is active`, async () => {
    const email = AuthEmail();
    await email.send(`user@example.com`, message);
    vi.mocked(Mail.send).mockClear();

    await expect(email.send(`user@example.com`, message)).rejects.toThrow(`Email cooldown active`);
    expect(Mail.send).not.toHaveBeenCalled();
  });
});
