/* eslint-disable @typescript-eslint/naming-convention */
import type { PaymentProvider } from "./Types";

import { Robokassa, type RobokassaCredentials } from "./providers";

export type PaymentCredentialsByType = { "robo-kassa": RobokassaCredentials };

export type PaymentInit = {
  [K in PaymentProviderType]: { credentials: PaymentCredentialsByType[K]; type: K };
}[PaymentProviderType];

export type PaymentProviderType = keyof PaymentCredentialsByType;

export const Payment = (init: PaymentInit): PaymentProvider =>
  ({ "robo-kassa": Robokassa })[init.type](init.credentials);
