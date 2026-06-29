/* eslint-disable react/forbid-component-props */
import type { Locale } from "@snappy/intl";

import { Text } from "react-email";

import { Brand, EmailLayout, PrimaryButton, Title } from "../components";
import { Colors, Layout } from "../core";
import { t } from "../locales";

export type ForgotPasswordInput = { locale: Locale; title: string; url: string };

export const ForgotPasswordEmail = ({ locale, title, url }: ForgotPasswordInput) => (
  <EmailLayout locale={locale} title={title}>
    <Brand />
    <Title>{t(locale, `forgotPassword.title`)}</Title>
    <Text
      style={{ color: Colors.muted, fontSize: Layout.fontSize.body, lineHeight: 1.5, margin: Layout.margin.bottom24 }}
    >
      {t(locale, `forgotPassword.lead`)}
    </Text>
    <PrimaryButton href={url} text={t(locale, `forgotPassword.button`)} />
    <Text
      style={{ color: Colors.muted, fontSize: Layout.fontSize.small, lineHeight: 1.5, margin: Layout.margin.footer }}
    >
      {t(locale, `forgotPassword.footer`)}
    </Text>
  </EmailLayout>
);
