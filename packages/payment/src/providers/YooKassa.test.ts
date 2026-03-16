/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { _, Json } from "@snappy/core";
import { describe, expect, it, vi } from "vitest";

import { YooKassa } from "./YooKassa";

const response = (status: number, body: string) =>
  new Response(body, { headers: { "Content-Type": `application/json` }, status });

describe(`yooKassa`, () => {
  const btoaMock = vi.fn((value: string) => Buffer.from(value, `utf8`).toString(`base64`));
  const fetchMock = vi.fn();

  vi.stubGlobal(`btoa`, btoaMock);
  vi.stubGlobal(`fetch`, fetchMock);

  it(`returns network failure when fetch throws`, async () => {
    fetchMock.mockReset();
    fetchMock.mockRejectedValue(new Error(`offline`));
    const payment = YooKassa({ secretKey: `secret`, shopId: `shop` });

    await expect(payment.payment(`pay-1`)).resolves.toStrictEqual({ code: `network`, ok: false });
  });

  it(`maps provider description on http error`, async () => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(response(400, Json.stringify({ description: `denied by bank` })));
    const payment = YooKassa({ secretKey: `secret`, shopId: `shop` });

    await expect(payment.payment(`pay-1`)).resolves.toStrictEqual({
      code: `provider-error`,
      externalMessage: `denied by bank`,
      httpStatus: 400,
      ok: false,
    });
  });

  it(`returns invalid-response when success body is not json`, async () => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(response(200, `not-json`));
    const payment = YooKassa({ secretKey: `secret`, shopId: `shop` });

    await expect(payment.payment(`pay-1`)).resolves.toStrictEqual({ code: `invalid-response`, ok: false });
  });

  it(`creates redirect payment and sends expected payload`, async () => {
    fetchMock.mockReset();
    btoaMock.mockReset();
    vi.spyOn(_, `now`).mockReturnValue(1_111_111);
    fetchMock.mockResolvedValue(
      response(200, Json.stringify({ confirmation: { confirmation_url: `https://ok` }, id: `p-1` })),
    );
    const payment = YooKassa({ returnUrl: `https://fallback`, secretKey: `secret`, shopId: `shop` });

    const result = await payment.createRedirectPayment({
      amount: 199,
      currency: `RUB`,
      description: `Premium`,
      options: { savePaymentMethod: true },
      userId: 7,
    });

    expect(result).toStrictEqual({ ok: true, providerPaymentId: `p-1`, redirectUrl: `https://ok` });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.yookassa.ru/v3/payments`,
      expect.objectContaining({
        body: Json.stringify({
          amount: { currency: `RUB`, value: `199.00` },
          capture: true,
          confirmation: { return_url: `https://fallback`, type: `redirect` },
          description: `Premium`,
          metadata: { type: `initial`, userId: `7` },
          save_payment_method: true,
        }),
        headers: expect.objectContaining({
          "Authorization": `Basic ${Buffer.from(`shop:secret`, `utf8`).toString(`base64`)}`,
          "Idempotence-Key": `7-1111111`,
        }),
        method: `POST`,
      }),
    );
    expect(btoaMock).toHaveBeenCalledWith(`shop:secret`);
  });

  it(`maps recurring charge status and cancellation code`, async () => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(
      response(
        200,
        Json.stringify({
          cancellation_details: { reason: `insufficient_funds` },
          id: `p-2`,
          status: `waiting_for_capture`,
        }),
      ),
    );
    const payment = YooKassa({ secretKey: `secret`, shopId: `shop` });

    await expect(
      payment.chargeSavedMethod({
        amount: 200,
        currency: `RUB`,
        description: `Renewal`,
        idempotenceKey: `idem-1`,
        savedMethodId: `pm-1`,
        userId: 8,
      }),
    ).resolves.toStrictEqual({
      ok: true,
      providerCancellationCode: `insufficient_funds`,
      providerPaymentId: `p-2`,
      status: `waiting-capture`,
    });
  });

  it(`maps payment snapshot including metadata and unknown status`, async () => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(
      response(
        200,
        Json.stringify({
          amount: { currency: `RUB`, value: `10.00` },
          metadata: { type: `renewal`, userId: `42` },
          paid: true,
          payment_method: { id: `pm-7` },
          status: `unexpected_status`,
        }),
      ),
    );
    const payment = YooKassa({ secretKey: `secret`, shopId: `shop` });

    await expect(payment.payment(`fallback-id`)).resolves.toStrictEqual({
      metadataKind: `renewal`,
      money: { currency: `RUB`, value: `10.00` },
      ok: true,
      providerCancellationCode: undefined,
      providerPaid: true,
      providerPaymentId: `fallback-id`,
      savedMethodId: `pm-7`,
      status: `unknown`,
      userId: 42,
    });
  });

  it(`returns paid true only for succeeded and providerPaid=true`, async () => {
    fetchMock.mockReset();
    fetchMock.mockResolvedValue(response(200, Json.stringify({ paid: true, status: `succeeded` })));
    const payment = YooKassa({ secretKey: `secret`, shopId: `shop` });

    await expect(payment.paid(`p-3`)).resolves.toStrictEqual({ ok: true, paid: true });
  });

  it(`parses valid webhook and rejects invalid payload`, () => {
    const payment = YooKassa({ secretKey: `secret`, shopId: `shop` });

    expect(payment.parseWebhook({ event: `payment.succeeded`, object: { id: `pay-1` } })).toStrictEqual({
      kind: `payment-succeeded`,
      ok: true,
      providerPaymentId: `pay-1`,
    });
    expect(payment.parseWebhook({ event: `payment.succeeded`, object: { id: 1 } })).toStrictEqual({
      code: `invalid-webhook-payload`,
      ok: false,
    });
  });
});
