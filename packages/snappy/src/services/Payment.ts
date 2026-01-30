/* jscpd:ignore-start */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-expression-statements */
import { Config } from "../Config";

type YooKassaPaymentRequest = {
  amount: { currency: string; value: string };
  capture: boolean;
  confirmation: { returnUrl?: string; type: string };
  description: string;
  metadata?: Record<string, string>;
};

const createPayment = async (userId: number, amount: number, description: string): Promise<string> => {
  const shopId = Config.YOOKASSA_SHOP_ID;
  const secretKey = Config.YOOKASSA_SECRET_KEY;

  if (shopId === undefined || shopId === `` || secretKey === undefined || secretKey === ``) {
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

  // Преобразуем camelCase в snake_case для API YooKassa
  const apiRequestBody = {
    amount: requestBody.amount,
    capture: requestBody.capture,
    confirmation: { return_url: requestBody.confirmation.returnUrl, type: requestBody.confirmation.type },
    description: requestBody.description,
    metadata: requestBody.metadata,
  };

  const credentials = btoa(`${shopId}:${secretKey}`);

  const response = await fetch(`https://api.yookassa.ru/v3/payments`, {
    body: JSON.stringify(apiRequestBody),
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type": `application/json`,
      "Idempotence-Key": idempotenceKey,
    },
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

export const createPremiumPayment = async (userId: number): Promise<string> => {
  const result = await createPayment(userId, Config.PREMIUM_PRICE, `Snappy Bot - Premium подписка (30 дней)`);

  return result;
};

/* Примечание: для проверки статуса платежа используется webhook от YooKassa
   В stateless архитектуре мы не храним информацию о платежах
   Webhook должен быть настроен в личном кабинете YooKassa */
export const verifyPayment = async (paymentId: string): Promise<boolean> => {
  const shopId = Config.YOOKASSA_SHOP_ID;
  const secretKey = Config.YOOKASSA_SECRET_KEY;

  if (shopId === undefined || shopId === `` || secretKey === undefined || secretKey === ``) {
    return false;
  }

  const credentials = btoa(`${shopId}:${secretKey}`);

  const response = await fetch(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
    headers: { "Authorization": `Basic ${credentials}`, "Content-Type": `application/json` },
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
/* jscpd:ignore-end */
