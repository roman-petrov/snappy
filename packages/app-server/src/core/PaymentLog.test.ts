/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { describe, expect, it, vi } from "vitest";

import { PaymentLog } from "./PaymentLog";
import { Mock } from "./test/Mock";

describe(`paymentLog`, () => {
  describe(`topUpError / topUpPending`, () => {
    it(`topUpError calls create with error entry`, async () => {
      const db = Mock.createDb();
      const user = Mock.createDbUser(`10`);
      vi.mocked(db.user).mockReturnValue(user);
      (user.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const paymentLog = PaymentLog(db);

      await paymentLog.topUpError(user, `provider-error`);

      expect(user.paymentLog.create).toHaveBeenCalledWith({
        currency: `RUB`,
        errorMessage: `provider-error`,
        status: `error`,
        type: `topup`,
      });
    });

    it(`topUpPending calls create with pending entry`, async () => {
      const db = Mock.createDb();
      const user = Mock.createDbUser(`5`);
      vi.mocked(db.user).mockReturnValue(user);
      (user.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const paymentLog = PaymentLog(db);

      await paymentLog.topUpPending(user, `pay-id-1`, 199);

      expect(user.paymentLog.create).toHaveBeenCalledWith({
        amount: 199,
        currency: `RUB`,
        paymentId: `pay-id-1`,
        status: `pending`,
        type: `topup`,
      });
    });
  });

  describe(`succeeded`, () => {
    it(`returns false when no succeeded row for paymentId`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.succeeded as ReturnType<typeof vi.fn>).mockResolvedValue(false);
      const paymentLog = PaymentLog(db);

      await expect(paymentLog.succeeded(`pay-123`)).resolves.toBe(false);

      expect(db.paymentLog.succeeded).toHaveBeenCalledWith(`pay-123`);
    });

    it(`returns true when succeeded row exists`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.succeeded as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      const paymentLog = PaymentLog(db);

      await expect(paymentLog.succeeded(`pay-123`)).resolves.toBe(true);
    });
  });

  describe(`pendingAmount`, () => {
    it(`delegates to db.paymentLog.pendingAmount`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.pendingAmount as ReturnType<typeof vi.fn>).mockResolvedValue(199);
      const paymentLog = PaymentLog(db);

      await expect(paymentLog.pendingAmount(`pay-1`)).resolves.toBe(199);
      expect(db.paymentLog.pendingAmount).toHaveBeenCalledWith(`pay-1`);
    });
  });

  describe(`topUpSettleError`, () => {
    it(`writes error entry via createOnce`, async () => {
      const db = Mock.createDb();
      const user = Mock.createDbUser(`10`);
      (db.paymentLog.createOnce as ReturnType<typeof vi.fn>).mockResolvedValue(undefined);
      const paymentLog = PaymentLog(db);

      await paymentLog.topUpSettleError(user, `pay-1`, `amount-mismatch`);

      expect(db.paymentLog.createOnce).toHaveBeenCalledWith({
        currency: `RUB`,
        errorMessage: `amount-mismatch`,
        paymentId: `pay-1`,
        status: `error`,
        type: `topup`,
        userId: `10`,
      });
    });
  });
});
