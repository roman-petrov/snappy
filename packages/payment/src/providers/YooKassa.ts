/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable init-declarations */
import { _, Json } from "@snappy/core";

import type {
  PaymentFailure,
  PaymentMetadataKind,
  PaymentMoney,
  PaymentProvider,
  PaymentResult as PaymentResultType,
  PaymentSnapshot,
  PaymentStatus,
} from "../Types";

import { PaymentResponse } from "../PaymentResponse";

export type YooKassaCredentials = { returnUrl?: string; secretKey?: string; shopId?: string };

type ApiInit = { body?: object; idempotenceKey?: string; method: `GET` | `POST` };

type RawPayment = {
  amount?: { currency: string; value: string };
  cancellation_details?: { reason?: string };
  confirmation?: { confirmation_url: string };
  id?: string;
  metadata?: Record<string, string>;
  paid?: boolean;
  payment_method?: { id?: string };
  status: string;
};

type YooKassaWebhookEventName = `payment.canceled` | `payment.succeeded`;

export const YooKassa = ({ returnUrl, secretKey, shopId }: YooKassaCredentials): PaymentProvider => {
  const paymentStatusMap: Record<string, PaymentStatus> = {
    canceled: `canceled`,
    pending: `pending`,
    succeeded: `succeeded`,
    waiting_for_capture: `waiting-capture`,
  };

  const mapStatus = (raw: string): PaymentStatus => paymentStatusMap[raw.trim().toLowerCase()] ?? `unknown`;

  const metadataKind = (raw: string | undefined): PaymentMetadataKind | undefined =>
    raw === `initial` || raw === `renewal` ? raw : undefined;

  const parseUserId = (raw: string | undefined) => {
    if (raw === undefined) {
      return undefined;
    }

    const parsed = _.dec(raw);

    return parsed !== undefined && Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
  };

  const snapshotFromRaw = (raw: RawPayment, fallbackPaymentId: string): PaymentSnapshot => {
    const {
      amount,
      cancellation_details: cancellationDetails,
      id,
      metadata,
      paid,
      payment_method: paymentMethod,
      status,
    } = raw;

    const money: PaymentMoney | undefined =
      amount === undefined ? undefined : { currency: amount.currency, value: amount.value };

    return {
      metadataKind: metadataKind(metadata?.[`type`]),
      money,
      providerCancellationCode: cancellationDetails?.reason,
      providerPaid: paid,
      providerPaymentId: id ?? fallbackPaymentId,
      savedMethodId: paymentMethod?.id,
      status: mapStatus(status),
      userId: parseUserId(metadata?.[`userId`]),
    };
  };

  const errorFromHttpBody = (text: string, httpStatus: number): PaymentFailure => {
    if (text === ``) {
      return { code: `http-error`, httpStatus, ok: false };
    }

    try {
      const parsed = Json.parse<{ description?: string }>(text);
      const { description } = parsed;

      return description === undefined || description === ``
        ? { code: `http-error`, externalMessage: text, httpStatus, ok: false }
        : { code: `provider-error`, externalMessage: description, httpStatus, ok: false };
    } catch {
      return { code: `provider-error`, externalMessage: text, httpStatus, ok: false };
    }
  };

  const api = async <T>(
    path: string,
    { body, idempotenceKey, method }: ApiInit,
    map: (raw: RawPayment) => T,
  ): Promise<PaymentResultType<T>> => {
    const authHeader = `Basic ${btoa(`${shopId}:${secretKey}`)}`;
    let response: Response;

    try {
      response = await fetch(`https://api.yookassa.ru/v3/payments${path}`, {
        ...(body === undefined ? {} : { body: Json.stringify(body) }),
        headers: {
          "Authorization": authHeader,
          "Content-Type": `application/json`,
          ...(idempotenceKey === undefined ? {} : { "Idempotence-Key": idempotenceKey }),
        },
        method,
      });
    } catch {
      return PaymentResponse.failure({ code: `network` });
    }

    const text = await response.text();

    if (!response.ok) {
      return errorFromHttpBody(text, response.status);
    }

    let raw: RawPayment;

    try {
      raw = Json.parse<RawPayment>(text);
    } catch {
      return PaymentResponse.failure({ code: `invalid-response` });
    }

    return PaymentResponse.success(map(raw));
  };

  const captureBody = (currency: string, amount: number) => ({
    amount: { currency, value: amount.toFixed(2) },
    capture: true,
  });

  const createRedirectPayment: PaymentProvider[`createRedirectPayment`] = async ({
    amount,
    currency,
    description,
    options,
    userId,
  }) =>
    api(
      ``,
      {
        body: {
          ...captureBody(currency, amount),
          confirmation: { return_url: options?.returnUrl ?? returnUrl, type: `redirect` },
          description,
          metadata: { type: `initial`, userId: userId.toString() },
          ...(options?.savePaymentMethod === true ? { save_payment_method: true } : {}),
        },
        idempotenceKey: `${userId}-${_.now()}`,
        method: `POST`,
      },
      ({ confirmation, id }) => ({ providerPaymentId: id ?? ``, redirectUrl: confirmation?.confirmation_url ?? `` }),
    );

  const chargeSavedMethod: PaymentProvider[`chargeSavedMethod`] = async ({
    amount,
    currency,
    description,
    idempotenceKey,
    savedMethodId,
    userId,
  }) =>
    api(
      ``,
      {
        body: {
          ...captureBody(currency, amount),
          description,
          metadata: { type: `renewal`, userId: userId.toString() },
          payment_method_id: savedMethodId,
        },
        idempotenceKey,
        method: `POST`,
      },
      ({ cancellation_details, id, status }) => ({
        providerCancellationCode: cancellation_details?.reason,
        providerPaymentId: id,
        status: mapStatus(status),
      }),
    );

  const payment: PaymentProvider[`payment`] = async providerPaymentId =>
    api(`/${providerPaymentId}`, { method: `GET` }, raw => snapshotFromRaw(raw, providerPaymentId));

  const paid: PaymentProvider[`paid`] = async providerPaymentId => {
    const result = await payment(providerPaymentId);

    if (!result.ok) {
      return result;
    }

    return PaymentResponse.success({ paid: result.status === `succeeded` && result.providerPaid === true });
  };

  const parseWebhook: PaymentProvider[`parseWebhook`] = body => {
    if (!_.isObject(body)) {
      return PaymentResponse.failure({ code: `invalid-webhook-payload` });
    }

    const record = body as { event?: unknown; object?: { id?: unknown } };
    const { event, object } = record;
    const id = object?.id;

    if (event !== `payment.succeeded` && event !== `payment.canceled`) {
      return PaymentResponse.failure({ code: `invalid-webhook-payload` });
    }

    if (!_.isString(id) || id === ``) {
      return PaymentResponse.failure({ code: `invalid-webhook-payload` });
    }

    const kind = (event as YooKassaWebhookEventName) === `payment.succeeded` ? `payment-succeeded` : `payment-canceled`;

    return PaymentResponse.success({ kind, providerPaymentId: id });
  };

  return { chargeSavedMethod, createRedirectPayment, paid, parseWebhook, payment };
};
