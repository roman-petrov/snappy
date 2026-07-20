import { describe, expect, it, vi } from "vitest";

const paymentInfo = vi.hoisted(() => vi.fn());

vi.mock(`./FileLogger`, () => ({
  FileLogger: (name: string) => ({ error: vi.fn(), info: name === `payment` ? paymentInfo : vi.fn(), warn: vi.fn() }),
}));

import { Log } from "./Log";

const { ai, auth, payment, withFields } = Log;

describe(`Log`, () => {
  it(`exposes every domain channel`, () => {
    expect(ai).toBeDefined();
    expect(auth).toBeDefined();
    expect(payment).toBeDefined();
  });

  it(`withFields merges base fields into every domain`, () => {
    paymentInfo.mockClear();
    withFields({ email: `user@example.com` }).payment.info(`payment.url.created`, { amount: 10 });

    expect(paymentInfo).toHaveBeenCalledExactlyOnceWith(
      { amount: 10, email: `user@example.com` },
      `payment.url.created`,
    );
  });

  it(`withFields returns the same root when base fields are empty`, () => {
    expect(withFields()).toBe(withFields({}));
  });

  it(`lets call-site fields override base fields`, () => {
    paymentInfo.mockClear();
    withFields({ email: `context@example.com` }).payment.info(`event`, { email: `override@example.com` });

    expect(paymentInfo).toHaveBeenCalledExactlyOnceWith({ email: `override@example.com` }, `event`);
  });
});
