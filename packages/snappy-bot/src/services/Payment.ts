/* jscpd:ignore-start */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-expression-statements */
import type { SnappyBotConfig } from "../SnappyBot";

type YooKassaPaymentRequest = {
  amount: { currency: string; value: string };
  capture: boolean;
  confirmation: { returnUrl?: string; type: string };
  description: string;
  metadata?: Record<string, string>;
};

const yooKassaAuth = (config: SnappyBotConfig): string | undefined => {
  const shopId = config.yooKassaShopId;
  const secretKey = config.yooKassaSecretKey;

  if (shopId === undefined || shopId === `` || secretKey === undefined || secretKey === ``) {
    return undefined;
  }

  return `Basic ${btoa(`${shopId}:${secretKey}`)}`;
};

const paymentUrl = async (userId: number, amount: number, description: string, config: SnappyBotConfig) => {
  const auth = yooKassaAuth(config);
  if (auth === undefined) {
    throw new Error(`YooKassa credentials not configured`);
  }

  const idempotenceKey = `${userId}-${Date.now()}`;

  const requestBody: YooKassaPaymentRequest = {
    amount: { currency: `RUB`, value: amount.toFixed(2) },
    capture: true,
    confirmation: { returnUrl: `https://t.me/your_bot_username`, type: `redirect` },
    description,
    metadata: { userId: userId.toString() },
  };

  const apiRequestBody = {
    amount: requestBody.amount,
    capture: requestBody.capture,
    confirmation: { return_url: requestBody.confirmation.returnUrl, type: requestBody.confirmation.type },
    description: requestBody.description,
    metadata: requestBody.metadata,
  };

  const response = await fetch(`https://api.yookassa.ru/v3/payments`, {
    body: JSON.stringify(apiRequestBody),
    headers: { "Authorization": auth, "Content-Type": `application/json`, "Idempotence-Key": idempotenceKey },
    method: `POST`,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`YooKassa payment error:`, error);
    throw new Error(`Failed to create payment`);
  }

  type ApiResponse = { confirmation: { confirmationUrl: string; type: string } };

  const jsonData: unknown = await response.json();
  if (typeof jsonData !== `object` || jsonData === null || !(`confirmation` in jsonData)) {
    throw new Error(`Invalid response from YooKassa`);
  }

  const apiResponse = jsonData as ApiResponse;

  return apiResponse.confirmation.confirmationUrl;
};

const premiumPaymentUrl = async (userId: number, config: SnappyBotConfig) =>
  paymentUrl(userId, config.premiumPrice, `Snappy Bot - Premium подписка (30 дней)`, config);

const verifyPayment = async (paymentId: string, config: SnappyBotConfig) => {
  const auth = yooKassaAuth(config);
  if (auth === undefined) {
    return false;
  }

  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
    headers: { "Authorization": auth, "Content-Type": `application/json` },
    method: `GET`,
  });

  if (!response.ok) {
    return false;
  }

  const jsonData: unknown = await response.json();
  if (typeof jsonData !== `object` || jsonData === null || !(`status` in jsonData) || !(`paid` in jsonData)) {
    return false;
  }
  const apiResponse = jsonData as { paid: boolean; status: string };

  return apiResponse.status === `succeeded` && apiResponse.paid;
};

export const Payment = { premiumPaymentUrl, verifyPayment };
/* jscpd:ignore-end */
