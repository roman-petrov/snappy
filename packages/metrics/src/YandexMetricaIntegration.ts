// cspell:word clickmap webvisor metrika metrica metri
import { _ } from "@snappy/core";

const frameAncestorsDomains = [
  `https://metrika.yandex.ru`,
  `https://metrika.yandex.by`,
  `https://metrica.yandex.com`,
  `https://metrica.yandex.com.tr`,
  `https://*.webvisor.com`,
] as const;

const frameAncestors = [`frame-ancestors 'self'`, ...frameAncestorsDomains].join(` `);

const preview = () =>
  !_.ssr &&
  window.self !== window.top &&
  /^https?:\/\/(?:[^/]+\.)?(?:webvisor\.com|metri[ck]a\.yandex\.(?:by|com|ru|com\.tr))\//u.test(document.referrer);

export const YandexMetricaIntegration = { frameAncestors, preview };
