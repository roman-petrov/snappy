import type { Locale } from "@snappy/intl";
import type { ReactElement } from "react";

import { render } from "react-email";

import type { en } from "./locales/en";

import { ForgotPasswordEmail, VerifyEmailEmail } from "./emails";
import { t } from "./locales";

export type Email = { html: string; subject: string; text: string };

type EmailKey = keyof typeof en;

type TemplateInput = { locale: Locale; title: string; url: string };

const template = async (
  key: EmailKey,
  view: (input: TemplateInput) => ReactElement,
  { locale, url }: Omit<TemplateInput, `title`>,
): Promise<Email> => {
  const subject = t(locale, `${key}.subject`);

  return {
    html: await render(view({ locale, title: subject, url })),
    subject,
    text: t(locale, `${key}.text`, { url }),
  };
};

const forgotPassword = async (input: Omit<TemplateInput, `title`>) =>
  template(`forgotPassword`, ForgotPasswordEmail, input);

const verifyEmail = async (input: Omit<TemplateInput, `title`>) => template(`verifyEmail`, VerifyEmailEmail, input);

export const Email = { forgotPassword, verifyEmail };
