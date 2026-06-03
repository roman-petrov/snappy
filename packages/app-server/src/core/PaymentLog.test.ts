/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { describe, expect, it, vi } from "vitest";

import { PaymentLog } from "./PaymentLog";
import { Mock } from "./test/Mock";

describe(`paymentLog`, () => {
  describe(`logTopUpError / logTopUpPending`, () => {
    it(`logTopUpError calls create with error entry`, async () => {
      const db = Mock.createDb();
      const user = Mock.createDbUser(`10`);
      vi.mocked(db.user).mockReturnValue(user);
      (user.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const paymentLog = PaymentLog(db);

      await paymentLog.logTopUpError(user, `provider-error`);

      expect(user.paymentLog.create).toHaveBeenCalledWith({
        currency: `RUB`,
        errorMessage: `provider-error`,
        status: `error`,
        type: `topup`,
      });
    });

    it(`logTopUpPending calls create with pending entry`, async () => {
      const db = Mock.createDb();
      const user = Mock.createDbUser(`5`);
      vi.mocked(db.user).mockReturnValue(user);
      (user.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const paymentLog = PaymentLog(db);

      await paymentLog.logTopUpPending(user, `pay-id-1`, 199);

      expect(user.paymentLog.create).toHaveBeenCalledWith({
        amount: 199,
        currency: `RUB`,
        status: `pending`,
        type: `topup`,
        yooKassaPaymentId: `pay-id-1`,
      });
    });
  });

  describe(`isSucceededAlready`, () => {
    it(`returns false when no succeeded row for paymentId`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.succeeded as ReturnType<typeof vi.fn>).mockResolvedValue(false);
      const paymentLog = PaymentLog(db);

      await expect(paymentLog.isSucceededAlready(`pay-123`)).resolves.toBe(false);

      expect(db.paymentLog.succeeded).toHaveBeenCalledWith(`pay-123`);
    });

    it(`returns true when succeeded row exists`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.succeeded as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      const paymentLog = PaymentLog(db);

      await expect(paymentLog.isSucceededAlready(`pay-123`)).resolves.toBe(true);
    });
  });

  describe(`logPaymentSucceeded`, () => {
    it(`calls create with succeeded entry and type from result`, async () => {
      const db = Mock.createDb();
      const user = Mock.createDbUser(`7`);
      vi.mocked(db.user).mockReturnValue(user);
      (user.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const paymentLog = PaymentLog(db);

      const result = {
        metadataKind: `topup` as const,
        money: { currency: `RUB`, value: `199.00` },
        ok: true as const,
        providerPaid: true,
        providerPaymentId: `pay-1`,
        savedMethodId: `pm-1`,
        status: `succeeded` as const,
        userId: `7`,
      };

      await paymentLog.logPaymentSucceeded(user, result);

      expect(user.paymentLog.create).toHaveBeenCalledWith({
        amount: `199.00`,
        currency: `RUB`,
        paymentMethodId: `pm-1`,
        status: `succeeded`,
        type: `topup`,
        yooKassaPaymentId: `pay-1`,
      });
    });
  });

  describe(`logPaymentCanceled`, () => {
    it(`calls create with canceled status when result has data`, async () => {
      const db = Mock.createDb();
      const user = Mock.createDbUser(`2`);
      (user.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const paymentLog = PaymentLog(db);

      const result = {
        metadataKind: undefined,
        ok: true as const,
        providerCancellationCode: `user_cancelled`,
        providerPaymentId: `pay-id`,
        savedMethodId: `pm-x`,
        status: `canceled` as const,
        userId: `2`,
      };

      await paymentLog.logPaymentCanceled(`pay-id`, result, user);

      expect(user.paymentLog.create).toHaveBeenCalledWith({
        errorMessage: `user_cancelled`,
        paymentMethodId: `pm-x`,
        status: `canceled`,
        type: `topup`,
        yooKassaPaymentId: `pay-id`,
      });
    });

    it(`calls create with error status when result has error`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const paymentLog = PaymentLog(db);
      const result = { code: `network` as const, ok: false as const };

      await paymentLog.logPaymentCanceled(`pay-id`, result);

      expect(db.paymentLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          errorMessage: `network`,
          status: `error`,
          type: `topup`,
          yooKassaPaymentId: `pay-id`,
        }),
      );
    });
  });
});
