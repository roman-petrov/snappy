/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";
import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";

import type { PaymentCreateRedirectPaymentSuccessResult } from "../Types";

import { Robokassa } from "./Robokassa";

const md5 = (value: string) => createHash(`md5`).update(value).digest(`hex`);
const credentials = { merchantLogin: `demo`, password1: `pass1`, password2: `pass2` } as const;

const opStateXml = (stateCode: string, resultCode = `0`) =>
  `<OperationStateResponse>
    <Result><Code>${resultCode}</Code><Description>fail</Description></Result>
    <State><Code>${stateCode}</Code></State>
    <Info><OutSum>15.50</OutSum></Info>
    <UserField>
      <Field><Name>Shp_type</Name><Value>topup</Value></Field>
      <Field><Name>Shp_userId</Name><Value>9</Value></Field>
    </UserField>
  </OperationStateResponse>`;

describe(`Robokassa`, () => {
  describe(`createRedirectPayment`, () => {
    it(`builds payment url with signature and shp params`, async () => {
      const { createRedirectPayment } = Robokassa({ ...credentials, isTest: true });

      const result = await createRedirectPayment({
        amount: 10,
        description: `Top up`,
        metadataKind: `topup`,
        userId: `user-1`,
      });

      expect(result.ok).toBe(true);

      const { paymentId, redirectUrl } = result as PaymentCreateRedirectPaymentSuccessResult;
      const url = new URL(redirectUrl);

      expect(paymentId).toMatch(/^\d+$/u);
      expect(url.origin + url.pathname).toBe(_.https(`auth.robokassa.ru/Merchant/Index.aspx`));
      expect(url.searchParams.get(`MerchantLogin`)).toBe(`demo`);
      expect(url.searchParams.get(`OutSum`)).toBe(`10.00`);
      expect(url.searchParams.get(`InvId`)).toBe(paymentId);
      expect(url.searchParams.get(`Description`)).toBe(`Top up`);
      expect(url.searchParams.get(`Shp_type`)).toBe(`topup`);
      expect(url.searchParams.get(`Shp_userId`)).toBe(`user-1`);
      expect(url.searchParams.get(`IsTest`)).toBe(`1`);
      expect(url.searchParams.get(`SignatureValue`)).toBe(
        md5(`demo:10.00:${paymentId}:pass1:Shp_type=topup:Shp_userId=user-1`),
      );
    });

    it(`omits IsTest outside test mode`, async () => {
      const { createRedirectPayment } = Robokassa(credentials);

      const result = await createRedirectPayment({
        amount: 1,
        description: `Top up`,
        metadataKind: `topup`,
        userId: `user-1`,
      });

      expect(result.ok).toBe(true);

      const { redirectUrl } = result as PaymentCreateRedirectPaymentSuccessResult;

      expect(new URL(redirectUrl).searchParams.get(`IsTest`)).toBeNull();
    });

    it(`adds SuccessUrl2 and FailUrl2 to signature when return urls are set`, async () => {
      const { createRedirectPayment } = Robokassa({ ...credentials, isTest: true });
      const success = `https://home.local/billing/robokassa/success`;
      const fail = `https://home.local/billing/robokassa/fail`;

      const result = await createRedirectPayment({
        amount: 10,
        description: `Top up`,
        metadataKind: `topup`,
        options: { failUrl: fail, returnUrl: success },
        userId: `user-1`,
      });

      expect(result.ok).toBe(true);

      const { paymentId, redirectUrl } = result as PaymentCreateRedirectPaymentSuccessResult;
      const url = new URL(redirectUrl);

      expect(url.searchParams.get(`SuccessUrl2`)).toBe(success);
      expect(url.searchParams.get(`SuccessUrl2Method`)).toBe(`GET`);
      expect(url.searchParams.get(`FailUrl2`)).toBe(fail);
      expect(url.searchParams.get(`FailUrl2Method`)).toBe(`GET`);
      expect(url.searchParams.get(`SignatureValue`)).toBe(
        md5(`demo:10.00:${paymentId}:${success}:GET:${fail}:GET:pass1:Shp_type=topup:Shp_userId=user-1`),
      );
    });
  });

  describe(`parseWebhook`, () => {
    it(`accepts valid result signature and rejects invalid`, async () => {
      const { parseWebhook, payment } = Robokassa({ ...credentials, isTest: true });
      const signature = md5(`10.00:42:pass2:Shp_type=topup:Shp_userId=user-1`);

      expect(
        parseWebhook({
          InvId: `42`,
          OutSum: `10.00`,
          Shp_type: `topup`,
          Shp_userId: `user-1`,
          SignatureValue: signature,
        }),
      ).toStrictEqual({ ok: true, paymentId: `42` });

      expect(parseWebhook({ InvId: `42`, OutSum: `10.00`, SignatureValue: `bad` })).toStrictEqual({
        code: `invalid-webhook-payload`,
        ok: false,
      });

      await expect(payment(`42`)).resolves.toStrictEqual({
        metadataKind: `topup`,
        money: { currency: `RUB`, value: `10.00` },
        ok: true,
        paymentId: `42`,
        status: `succeeded`,
        userId: `user-1`,
      });
    });

    it(`rejects non-object and incomplete payload`, () => {
      const { parseWebhook } = Robokassa(credentials);

      expect(parseWebhook(undefined)).toStrictEqual({ code: `invalid-webhook-payload`, ok: false });
      expect(parseWebhook({ OutSum: `10.00`, SignatureValue: `x` })).toStrictEqual({
        code: `invalid-webhook-payload`,
        ok: false,
      });
    });

    it(`accepts case-insensitive signature`, () => {
      const { parseWebhook } = Robokassa(credentials);
      const signature = md5(`10.00:42:pass2:Shp_type=topup:Shp_userId=user-1`);

      expect(
        parseWebhook({
          InvId: `42`,
          OutSum: `10.00`,
          Shp_type: `topup`,
          Shp_userId: `user-1`,
          SignatureValue: signature.toUpperCase(),
        }),
      ).toStrictEqual({ ok: true, paymentId: `42` });
    });
  });

  describe(`payment`, () => {
    it(`maps OpStateExt succeeded response`, async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(opStateXml(`100`), { status: 200 }));
      vi.stubGlobal(`fetch`, fetchMock);

      const { payment } = Robokassa(credentials);

      await expect(payment(`100`)).resolves.toStrictEqual({
        metadataKind: `topup`,
        money: { currency: `RUB`, value: `15.50` },
        ok: true,
        paymentId: `100`,
        status: `succeeded`,
        userId: `9`,
      });

      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`InvoiceID=100`),
        expect.objectContaining({ method: `GET` }),
      );
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`Signature=${md5(`demo:100:pass2`)}`),
        expect.objectContaining({ method: `GET` }),
      );

      vi.unstubAllGlobals();
    });

    it(`maps canceled OpState`, async () => {
      vi.stubGlobal(`fetch`, vi.fn().mockResolvedValue(new Response(opStateXml(`10`), { status: 200 })));

      const { payment } = Robokassa(credentials);

      await expect(payment(`7`)).resolves.toMatchObject({ ok: true, status: `canceled` });

      vi.unstubAllGlobals();
    });

    it(`returns network failure`, async () => {
      vi.stubGlobal(`fetch`, vi.fn().mockRejectedValue(new Error(`offline`)));

      const { payment } = Robokassa(credentials);

      await expect(payment(`1`)).resolves.toStrictEqual({ code: `network`, ok: false });

      vi.unstubAllGlobals();
    });

    it(`returns http failure`, async () => {
      vi.stubGlobal(`fetch`, vi.fn().mockResolvedValue(new Response(`boom`, { status: 503 })));

      const { payment } = Robokassa(credentials);

      await expect(payment(`1`)).resolves.toStrictEqual({
        code: `http-error`,
        externalMessage: `boom`,
        httpStatus: 503,
        ok: false,
      });

      vi.unstubAllGlobals();
    });

    it(`returns provider failure`, async () => {
      vi.stubGlobal(`fetch`, vi.fn().mockResolvedValue(new Response(opStateXml(`100`, `3`), { status: 200 })));

      const { payment } = Robokassa(credentials);

      await expect(payment(`1`)).resolves.toStrictEqual({
        code: `provider-error`,
        externalMessage: `fail`,
        httpStatus: 200,
        ok: false,
      });

      vi.unstubAllGlobals();
    });

    it(`uses signed webhook stash instead of OpState`, async () => {
      const fetchMock = vi.fn().mockResolvedValue(new Response(opStateXml(`100`), { status: 200 }));
      vi.stubGlobal(`fetch`, fetchMock);

      const { parseWebhook, payment } = Robokassa(credentials);
      const signature = md5(`10.00:42:pass2:Shp_type=topup:Shp_userId=user-1`);

      expect(
        parseWebhook({
          InvId: `42`,
          OutSum: `10.00`,
          Shp_type: `topup`,
          Shp_userId: `user-1`,
          SignatureValue: signature,
        }).ok,
      ).toBe(true);

      await expect(payment(`42`)).resolves.toStrictEqual({
        metadataKind: `topup`,
        money: { currency: `RUB`, value: `10.00` },
        ok: true,
        paymentId: `42`,
        status: `succeeded`,
        userId: `user-1`,
      });

      expect(fetchMock).not.toHaveBeenCalled();

      vi.unstubAllGlobals();
    });
  });
});
