import type { Locale } from "@snappy/intl";

import { ForgotPasswordEmail, VerifyEmailEmail } from "../src/emails";

const url = `https://example.com/?token=demo`;
const forgotPassword = (locale: Locale) => () => ForgotPasswordEmail({ locale, url });
const verifyEmail = (locale: Locale) => () => VerifyEmailEmail({ locale, url });

export const EmailPreview = { forgotPassword, verifyEmail };
