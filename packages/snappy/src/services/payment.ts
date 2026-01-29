/* jscpd:ignore-start */
import { config } from "../config";

interface YooKassaPaymentRequest {
  amount: { currency: string; value: string };
  capture: boolean;
  confirmation: { return_url?: string; type: string };
  description: string;
  metadata?: Record<string, string>;
}

interface YooKassaPaymentResponse {
  amount: { currency: string; value: string };
  confirmation: { confirmation_url: string; type: string };
  created_at: string;
  description: string;
  id: string;
  metadata?: Record<string, string>;
  paid: boolean;
  status: string;
}

const createPayment = async (userId: number, amount: number, description: string): Promise<string> => {
  const shopId = config.YOOKASSA_SHOP_ID;
  const secretKey = config.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
    throw new Error(`YooKassa credentials not configured`);
  }

  const idempotenceKey = `${userId}-${Date.now()}`;

  const requestBody: YooKassaPaymentRequest = {
    amount: { currency: `RUB`, value: amount.toFixed(2) },
    capture: true,
    confirmation: { return_url: `https://t.me/your_bot_username`, type: `redirect` },
    description,
    metadata: { user_id: userId.toString() },
  };

  const credentials = btoa(`${shopId}:${secretKey}`);

  const response = await fetch(`https://api.yookassa.ru/v3/payments`, {
    body: JSON.stringify(requestBody),
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

  const data = (await response.json()) as YooKassaPaymentResponse;

  return data.confirmation.confirmation_url;
};

export const createPremiumPayment = async (userId: number): Promise<string> => {
  return createPayment(userId, config.PREMIUM_PRICE, `Snappy Bot - Premium подписка (30 дней)`);
};

/* Примечание: для проверки статуса платежа используется webhook от YooKassa
   В stateless архитектуре мы не храним информацию о платежах
   Webhook должен быть настроен в личном кабинете YooKassa */
export const verifyPayment = async (paymentId: string): Promise<boolean> => {
  const shopId = config.YOOKASSA_SHOP_ID;
  const secretKey = config.YOOKASSA_SECRET_KEY;

  if (!shopId || !secretKey) {
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

  const data = (await response.json()) as YooKassaPaymentResponse;

  return data.status === `succeeded` && data.paid;
};
/* jscpd:ignore-end */
