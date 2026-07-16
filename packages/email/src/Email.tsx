import type { Locale } from "@snappy/intl";
import type { ReactElement } from "react";

import { render } from "react-email";

import type { en } from "./locales/en";

import { ForgotPasswordEmail, VerifyEmailEmail } from "./emails";
import { t } from "./locales";

export type Email = { html: string; subject: string; text: string };

type EmailKey = keyof typeof en;

type TemplateInput = { locale: Locale; url: string };

const template = async (
  key: EmailKey,
  view: (input: TemplateInput) => ReactElement,
  { locale, url }: TemplateInput,
): Promise<Email> => ({
  html: await render(view({ locale, url })),
  subject: t(locale, `${key}.subject`),
  text: t(locale, `${key}.text`, { url }),
});

const forgotPassword = async (input: TemplateInput) => template(`forgotPassword`, ForgotPasswordEmail, input);
const verifyEmail = async (input: TemplateInput) => template(`verifyEmail`, VerifyEmailEmail, input);

export const Email = { forgotPassword, verifyEmail };
