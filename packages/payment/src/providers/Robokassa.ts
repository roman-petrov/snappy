// cspell:word asmx
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable init-declarations */
/* eslint-disable unicorn/prefer-includes-over-repeated-comparisons */
import { _, MimeType } from "@snappy/core";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";

import type { PaymentMetadataKind, PaymentProvider, PaymentStatus } from "../Types";

import { PaymentResponse } from "../PaymentResponse";

export type RobokassaCredentials = { isTest?: boolean; merchantLogin?: string; password1?: string; password2?: string };

export const Robokassa = ({
  isTest = false,
  merchantLogin = ``,
  password1 = ``,
  password2 = ``,
}: RobokassaCredentials): PaymentProvider => {
  type Stash = { metadataKind?: PaymentMetadataKind; outSum: string; userId?: string };

  const paymentUrl = _.https(`auth.robokassa.ru/Merchant/Index.aspx`);
  const opStateUrl = _.https(`auth.robokassa.ru/Merchant/WebService/Service.asmx/OpStateExt`);
  const stash = new Map<string, Stash>();
  const hash = (value: string) => createHash(`md5`).update(value).digest(`hex`);

  const statusByState: Partial<Record<number, PaymentStatus>> = {
    5: `pending`,
    10: `canceled`,
    20: `pending`,
    50: `pending`,
    60: `canceled`,
    80: `pending`,
    100: `succeeded`,
  };

  const sameSignature = (left: string, right: string) => {
    const a = Buffer.from(left.toLowerCase());
    const b = Buffer.from(right.toLowerCase());

    return a.length === b.length && timingSafeEqual(a, b);
  };

  const shpSuffix = (shp: Record<string, string>) =>
    _.keys(shp)
      .toSorted((a, b) => a.localeCompare(b))
      .map(key => `${key}=${shp[key]}`)
      .join(`:`);

  const sign = (base: string, shp: Record<string, string>) => {
    const suffix = shpSuffix(shp);

    return hash(suffix === `` ? base : `${base}:${suffix}`);
  };

  const metadataKind = (raw: string | undefined): PaymentMetadataKind | undefined =>
    raw === `topup` ? raw : undefined;

  const parseUserId = (raw: string | undefined) => {
    const userId = raw?.trim();

    return userId === undefined || userId === `` ? undefined : userId;
  };

  const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    value !== null && _.isObject(value) && !_.isArray(value);

  const field = (body: Record<string, unknown>, name: string) => {
    const value = body[name];

    return _.isString(value) ? value : undefined;
  };

  const xmlTag = (xml: string, tag: string) =>
    new RegExp(`<${tag}[^>]*>(?<value>[^<]*)</${tag}>`, `u`).exec(xml)?.groups?.[`value`];

  const xmlUserFields = (xml: string) =>
    _.fromEntries(
      [
        ...xml.matchAll(/<Field>\s*<Name>(?<name>[^<]*)<\/Name>\s*<Value>(?<value>[^<]*)<\/Value>\s*<\/Field>/gu),
      ].flatMap(({ groups }) => {
        const name = groups?.[`name`];
        const value = groups?.[`value`];

        return name === undefined || value === undefined ? [] : ([[name, value]] as const);
      }),
    );

  const shpFields = (body: Record<string, unknown>): Record<string, string> =>
    _.mapEntries(
      _.filterEntries(body, (key, value) => key.startsWith(`Shp_`) && _.isString(value)),
      (key, value): readonly [string, string] => [key, String(value)],
    );

  const createRedirectPayment: PaymentProvider[`createRedirectPayment`] = async ({
    amount,
    description,
    metadataKind: kind,
    options,
    userId,
  }) => {
    const invId = `${randomInt(1, 2_147_483_647)}`;
    const outSum = amount.toFixed(2);
    const shp = { Shp_type: kind, Shp_userId: userId };
    const successUrl = options?.returnUrl;
    const failUrl = options?.failUrl;

    const returnUrls =
      successUrl === undefined || failUrl === undefined
        ? undefined
        : { FailUrl2: failUrl, FailUrl2Method: `GET`, SuccessUrl2: successUrl, SuccessUrl2Method: `GET` };

    const signatureBase =
      returnUrls === undefined
        ? `${merchantLogin}:${outSum}:${invId}:${password1}`
        : `${merchantLogin}:${outSum}:${invId}:${successUrl}:GET:${failUrl}:GET:${password1}`;

    const parameters = new URLSearchParams({
      Description: description,
      InvId: invId,
      MerchantLogin: merchantLogin,
      OutSum: outSum,
      SignatureValue: sign(signatureBase, shp),
      ...shp,
      ...returnUrls,
      ...(isTest ? { IsTest: `1` } : {}),
    });

    return PaymentResponse.success({ paymentId: invId, redirectUrl: `${paymentUrl}?${parameters.toString()}` });
  };

  const paymentFromOpState: PaymentProvider[`payment`] = async paymentId => {
    const signature = hash(`${merchantLogin}:${paymentId}:${password2}`);
    const url = `${opStateUrl}?MerchantLogin=${encodeURIComponent(merchantLogin)}&InvoiceID=${encodeURIComponent(paymentId)}&Signature=${signature}`;
    let response: Response;

    try {
      response = await fetch(url, { headers: { Accept: MimeType.xml }, method: `GET` });
    } catch {
      return PaymentResponse.failure({ code: `network` });
    }

    const text = await response.text();
    if (!response.ok) {
      return PaymentResponse.failure({ code: `http-error`, externalMessage: text, httpStatus: response.status });
    }

    const resultCode = _.dec(xmlTag(text, `Code`) ?? ``);
    if (resultCode !== 0) {
      return PaymentResponse.failure({
        code: `provider-error`,
        externalMessage: xmlTag(text, `Description`) ?? `OpState code ${resultCode}`,
        httpStatus: response.status,
      });
    }

    const stateCode = _.dec(
      /<State>[\s\S]*?<Code>(?<code>[^<]*)<\/Code>[\s\S]*?<\/State>/u.exec(text)?.groups?.[`code`] ?? ``,
    );

    const status = stateCode === undefined ? `unknown` : (statusByState[stateCode] ?? `unknown`);
    const outSum = xmlTag(text, `OutSum`);
    const fields = xmlUserFields(text);

    return PaymentResponse.success({
      metadataKind: metadataKind(fields[`Shp_type`]),
      money: outSum === undefined ? undefined : { currency: `RUB`, value: outSum },
      paymentId,
      status,
      userId: parseUserId(fields[`Shp_userId`]),
    });
  };

  const payment: PaymentProvider[`payment`] = async paymentId => {
    const entry = stash.get(paymentId);

    return entry === undefined
      ? paymentFromOpState(paymentId)
      : PaymentResponse.success({
          metadataKind: entry.metadataKind,
          money: { currency: `RUB`, value: entry.outSum },
          paymentId,
          status: `succeeded`,
          userId: entry.userId,
        });
  };

  const parseWebhook: PaymentProvider[`parseWebhook`] = body => {
    if (!isPlainObject(body)) {
      return PaymentResponse.failure({ code: `invalid-webhook-payload` });
    }

    const outSum = field(body, `OutSum`);
    const invId = field(body, `InvId`);
    const signatureValue = field(body, `SignatureValue`);
    if (outSum === undefined || invId === undefined || signatureValue === undefined) {
      return PaymentResponse.failure({ code: `invalid-webhook-payload` });
    }

    const shp = shpFields(body);
    if (!sameSignature(sign(`${outSum}:${invId}:${password2}`, shp), signatureValue)) {
      return PaymentResponse.failure({ code: `invalid-webhook-payload` });
    }

    stash.set(invId, { metadataKind: metadataKind(shp[`Shp_type`]), outSum, userId: parseUserId(shp[`Shp_userId`]) });

    return PaymentResponse.success({ paymentId: invId });
  };

  return { createRedirectPayment, parseWebhook, payment };
};
