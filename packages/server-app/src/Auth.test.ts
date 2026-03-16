/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/promise-function-async */

import { describe, expect, it, vi } from "vitest";

import { Auth } from "./Auth";
import { Mock } from "./test/Mock";

vi.mock(import(`./Jwt`), () => ({
  Jwt: { sign: vi.fn((userId: number) => `token-${userId}`), verify: vi.fn(() => ({ userId: 1 })) },
}));
vi.mock(import(`./Password`), () => ({
  Password: {
    hash: vi.fn((password: string) => Promise.resolve(`hash:${password}`)),
    verify: vi.fn(() => Promise.resolve(true)),
  },
}));

describe(`auth`, () => {
  describe(`register`, () => {
    it(`returns emailInvalidOrMissing when email is missing or invalid`, async () => {
      const db = Mock.createDb();
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.register({ email: ``, password: `Pass1234` })).resolves.toStrictEqual({
        status: `emailInvalidOrMissing`,
      });
      await expect(auth.register({ email: `  `, password: `Pass1234` })).resolves.toStrictEqual({
        status: `emailInvalidOrMissing`,
      });
      await expect(auth.register({ email: `a@b.co`, password: 1 as unknown as string })).resolves.toStrictEqual({
        status: `emailInvalidOrMissing`,
      });
    });

    it(`returns passwordInvalid when password too short or no letter/digit`, async () => {
      const db = Mock.createDb();
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.register({ email: `a@b.co`, password: `short` })).resolves.toStrictEqual({
        status: `passwordInvalid`,
      });
      await expect(auth.register({ email: `a@b.co`, password: `12345678` })).resolves.toStrictEqual({
        status: `passwordInvalid`,
      });
      await expect(auth.register({ email: `a@b.co`, password: `OnlyLettersNoDigit` })).resolves.toStrictEqual({
        status: `passwordInvalid`,
      });
    });

    it(`returns emailAlreadyRegistered when user exists`, async () => {
      const db = Mock.createDb();
      (db.user.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValue({ email: `a@b.co`, id: 1 });
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.register({ email: `a@b.co`, password: `Pass1234` })).resolves.toStrictEqual({
        status: `emailAlreadyRegistered`,
      });
    });

    it(`creates user and returns token when valid`, async () => {
      const db = Mock.createDb();
      (db.user.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      (db.user.createWithEmailPassword as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 42 });
      const auth = Auth({ jwtSecret: `secret`, user: db.user });
      const result = await auth.register({ email: `  User@Example.COM  `, password: `Pass1234` });

      expect(result).toStrictEqual({ token: `token-42` });
      expect(db.user.findByEmail).toHaveBeenCalledWith(`user@example.com`);
      expect(db.user.createWithEmailPassword).toHaveBeenCalledWith(`user@example.com`, `hash:Pass1234`);
    });

    it(`returns jwtUnavailable when jwtSecret is empty`, async () => {
      const db = Mock.createDb();
      const auth = Auth({ jwtSecret: ``, user: db.user });

      await expect(auth.register({ email: `a@b.co`, password: `Pass1234` })).resolves.toStrictEqual({
        status: `jwtUnavailable`,
      });
    });
  });

  describe(`login`, () => {
    it(`returns emailInvalidOrMissing when email or password invalid`, async () => {
      const db = Mock.createDb();
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.login({ email: ``, password: `x` })).resolves.toStrictEqual({
        status: `emailInvalidOrMissing`,
      });
      await expect(auth.login({ email: `a@b.co`, password: `` })).resolves.toStrictEqual({
        status: `emailInvalidOrMissing`,
      });
    });

    it(`returns invalidCredentials when user not found`, async () => {
      const db = Mock.createDb();
      (db.user.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.login({ email: `a@b.co`, password: `Pass1234` })).resolves.toStrictEqual({
        status: `invalidCredentials`,
      });
    });

    it(`returns invalidCredentials when user has no passwordHash`, async () => {
      const db = Mock.createDb();
      (db.user.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValue({
        email: `a@b.co`,
        id: 1,
        passwordHash: undefined,
      });
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.login({ email: `a@b.co`, password: `Pass1234` })).resolves.toStrictEqual({
        status: `invalidCredentials`,
      });
    });

    it(`returns invalidCredentials when password does not match`, async () => {
      const db = Mock.createDb();
      const passwordModule = await import(`./Password`);
      (db.user.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValue({
        email: `a@b.co`,
        id: 1,
        passwordHash: `hash`,
      });
      (passwordModule.Password.verify as ReturnType<typeof vi.fn>).mockResolvedValueOnce(false);
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.login({ email: `a@b.co`, password: `wrong` })).resolves.toStrictEqual({
        status: `invalidCredentials`,
      });
    });

    it(`returns token when credentials valid`, async () => {
      const db = Mock.createDb();
      (db.user.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValue({
        email: `a@b.co`,
        id: 7,
        passwordHash: `hash`,
      });
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.login({ email: `a@b.co`, password: `Pass1234` })).resolves.toStrictEqual({ token: `token-7` });
    });
  });

  describe(`forgotPassword`, () => {
    it(`returns emailRequired when email missing`, async () => {
      const db = Mock.createDb();
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.forgotPassword({ email: `` })).resolves.toStrictEqual({ status: `emailRequired` });
      await expect(auth.forgotPassword({ email: `   ` })).resolves.toStrictEqual({ status: `emailRequired` });
    });

    it(`returns ok and does not update when user not found`, async () => {
      const db = Mock.createDb();
      (db.user.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.forgotPassword({ email: `nobody@b.co` })).resolves.toStrictEqual({ status: `ok` });
      expect(db.user.setResetToken).not.toHaveBeenCalled();
    });

    it(`updates user with resetToken and returns ok when user exists`, async () => {
      const db = Mock.createDb();
      (db.user.findByEmail as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 1 });
      const auth = Auth({ jwtSecret: `secret`, user: db.user });
      const result = await auth.forgotPassword({ email: `user@b.co` });

      expect(result.status).toBe(`ok`);
      expect(result).toHaveProperty(`resetToken`);
      expect(db.user.setResetToken).toHaveBeenCalledWith(1, expect.any(String), expect.any(Number));
    });
  });

  describe(`resetPassword`, () => {
    it(`returns tokenAndPasswordRequired when token or password invalid`, async () => {
      const db = Mock.createDb();
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.resetPassword({ newPassword: `Pass1234`, token: `` })).resolves.toStrictEqual({
        status: `tokenAndPasswordRequired`,
      });
      await expect(auth.resetPassword({ newPassword: `short`, token: `t` })).resolves.toStrictEqual({
        status: `tokenAndPasswordRequired`,
      });
    });

    it(`returns invalidOrExpiredToken when no matching user`, async () => {
      const db = Mock.createDb();
      (db.user.findByResetToken as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.resetPassword({ newPassword: `Pass1234`, token: `bad` })).resolves.toStrictEqual({
        status: `invalidOrExpiredToken`,
      });
    });

    it(`updates password and clears reset token when valid`, async () => {
      const db = Mock.createDb();
      (db.user.findByResetToken as ReturnType<typeof vi.fn>).mockResolvedValue({ id: 1 });
      const auth = Auth({ jwtSecret: `secret`, user: db.user });

      await expect(auth.resetPassword({ newPassword: `NewPass99`, token: `valid-token` })).resolves.toStrictEqual({
        status: `ok`,
      });
      expect(db.user.clearResetAndSetPassword).toHaveBeenCalledWith(1, `hash:NewPass99`);
    });
  });
});
