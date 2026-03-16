import type { PaymentFailure, PaymentResult } from "./Types";

const failure = (payload: Omit<PaymentFailure, `ok`>): PaymentFailure => ({ ...payload, ok: false });
const success = <T>(payload: T): PaymentResult<T> => ({ ...payload, ok: true });

export const PaymentResponse = { failure, success };
