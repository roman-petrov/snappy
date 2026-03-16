/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */

import { describe, expect, it, vi } from "vitest";

import { PaymentLog } from "./PaymentLog";
import { Mock } from "./test/Mock";

describe(`paymentLog`, () => {
  describe(`logInitialError / logInitialPending / logSubscriptionCancelled`, () => {
    it(`logInitialError calls create with error entry`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const paymentLog = PaymentLog(db.paymentLog);

      await paymentLog.logInitialError(10, `provider-error`);

      expect(db.paymentLog.create).toHaveBeenCalledWith({
        currency: `RUB`,
        errorMessage: `provider-error`,
        status: `error`,
        type: `initial`,
        userId: 10,
      });
    });

    it(`logInitialPending calls create with pending entry`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const paymentLog = PaymentLog(db.paymentLog);

      await paymentLog.logInitialPending(5, `pay-id-1`, 199);

      expect(db.paymentLog.create).toHaveBeenCalledWith({
        amount: 199,
        currency: `RUB`,
        status: `pending`,
        type: `initial`,
        userId: 5,
        yooKassaPaymentId: `pay-id-1`,
      });
    });

    it(`logSubscriptionCancelled calls create with ok entry`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const paymentLog = PaymentLog(db.paymentLog);

      await paymentLog.logSubscriptionCancelled(3);

      expect(db.paymentLog.create).toHaveBeenCalledWith({ status: `ok`, type: `subscription_cancelled`, userId: 3 });
    });
  });

  describe(`isSucceededAlready`, () => {
    it(`returns false when no succeeded row for paymentId`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.hasSucceededPayment as ReturnType<typeof vi.fn>).mockResolvedValue(false);
      const paymentLog = PaymentLog(db.paymentLog);

      await expect(paymentLog.isSucceededAlready(`pay-123`)).resolves.toBe(false);

      expect(db.paymentLog.hasSucceededPayment).toHaveBeenCalledWith(`pay-123`);
    });

    it(`returns true when succeeded row exists`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.hasSucceededPayment as ReturnType<typeof vi.fn>).mockResolvedValue(true);
      const paymentLog = PaymentLog(db.paymentLog);

      await expect(paymentLog.isSucceededAlready(`pay-123`)).resolves.toBe(true);
    });
  });

  describe(`logPaymentSucceeded`, () => {
    it(`calls create with succeeded entry and type from result`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const paymentLog = PaymentLog(db.paymentLog);

      const result = {
        metadataKind: `initial` as const,
        money: { currency: `RUB`, value: `199.00` },
        ok: true as const,
        providerPaid: true,
        providerPaymentId: `pay-1`,
        savedMethodId: `pm-1`,
        status: `succeeded` as const,
        userId: 7,
      };

      await paymentLog.logPaymentSucceeded(result, 7);

      expect(db.paymentLog.create).toHaveBeenCalledWith({
        amount: `199.00`,
        currency: `RUB`,
        paymentMethodId: `pm-1`,
        status: `succeeded`,
        type: `initial`,
        userId: 7,
        yooKassaPaymentId: `pay-1`,
      });
    });
  });

  describe(`logPaymentCanceled`, () => {
    it(`calls create with canceled status when result has data`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const paymentLog = PaymentLog(db.paymentLog);

      const result = {
        metadataKind: undefined,
        ok: true as const,
        providerCancellationCode: `user_cancelled`,
        providerPaymentId: `pay-id`,
        savedMethodId: `pm-x`,
        status: `canceled` as const,
        userId: 2,
      };

      await paymentLog.logPaymentCanceled(`pay-id`, result);

      expect(db.paymentLog.create).toHaveBeenCalledWith({
        errorMessage: `user_cancelled`,
        paymentMethodId: `pm-x`,
        status: `canceled`,
        type: `payment_canceled`,
        userId: 2,
        yooKassaPaymentId: `pay-id`,
      });
    });

    it(`calls create with error status when result has error`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const paymentLog = PaymentLog(db.paymentLog);
      const result = { code: `network` as const, ok: false as const };

      await paymentLog.logPaymentCanceled(`pay-id`, result);

      expect(db.paymentLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          errorMessage: `network`,
          status: `error`,
          type: `payment_canceled`,
          yooKassaPaymentId: `pay-id`,
        }),
      );
    });
  });

  describe(`logRenewal`, () => {
    it(`calls create with succeeded renewal when result has data`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const paymentLog = PaymentLog(db.paymentLog);
      const result = { ok: true as const, providerPaymentId: `pay-renew`, status: `succeeded` as const };

      await paymentLog.logRenewal(result, 1, 199, `idem-key-1`);

      expect(db.paymentLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 199,
          currency: `RUB`,
          idempotenceKey: `idem-key-1`,
          status: `succeeded`,
          type: `renewal`,
          userId: 1,
          yooKassaPaymentId: `pay-renew`,
        }),
      );
    });

    it(`calls create with failed status when result has data but not succeeded`, async () => {
      const db = Mock.createDb();
      (db.paymentLog.create as ReturnType<typeof vi.fn>).mockResolvedValue({});
      const paymentLog = PaymentLog(db.paymentLog);

      const result = {
        ok: true as const,
        providerCancellationCode: `insufficient_funds`,
        providerPaymentId: undefined,
        status: `canceled` as const,
      };

      await paymentLog.logRenewal(result, 2, 199, `idem-2`);

      expect(db.paymentLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 199,
          currency: `RUB`,
          errorMessage: `insufficient_funds`,
          idempotenceKey: `idem-2`,
          status: `canceled`,
          type: `renewal`,
          userId: 2,
        }),
      );
    });
  });
});
