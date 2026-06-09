/* eslint-disable react/forbid-component-props */
import type { Locale } from "@snappy/intl";

import { Text } from "react-email";

import { Brand, EmailLayout, PrimaryButton, Title, UrlFallback } from "../components";
import { Colors, Layout } from "../core";
import { t } from "../locales";

export type VerifyEmailInput = { locale: Locale; title: string; url: string };

export const VerifyEmailEmail = ({ locale, title, url }: VerifyEmailInput) => (
  <EmailLayout locale={locale} title={title}>
    <Brand />
    <Title>{t(locale, `verifyEmail.title`)}</Title>
    <Text
      style={{ color: Colors.muted, fontSize: Layout.fontSize.body, lineHeight: 1.5, margin: Layout.margin.bottom24 }}
    >
      {t(locale, `verifyEmail.lead`)}
    </Text>
    <PrimaryButton href={url} text={t(locale, `verifyEmail.button`)} />
    <UrlFallback href={url} label={t(locale, `verifyEmail.linkLabel`)} />
    <Text
      style={{ color: Colors.muted, fontSize: Layout.fontSize.small, lineHeight: 1.5, margin: Layout.margin.footer }}
    >
      {t(locale, `verifyEmail.footer`)}
    </Text>
  </EmailLayout>
);
