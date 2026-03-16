/* eslint-disable @typescript-eslint/naming-convention */
import type { PaymentProvider } from "./Types";

import { YooKassa, type YooKassaCredentials } from "./providers";

export type PaymentCredentialsByType = { "yoo-kassa": YooKassaCredentials };

export type PaymentInit = {
  [K in PaymentProviderType]: { credentials: PaymentCredentialsByType[K]; type: K };
}[PaymentProviderType];

export type PaymentProviderType = keyof PaymentCredentialsByType;

export const Payment = (init: PaymentInit): PaymentProvider => ({ "yoo-kassa": YooKassa })[init.type](init.credentials);
