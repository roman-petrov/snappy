import { _ } from "@snappy/core";
import { $, Button, SafeArea, Text } from "@snappy/ui";

import type { useCookieBannerState } from "./CookieBanner.state";

import { t } from "../locales";
import styles from "./CookieBanner.module.scss";

export type CookieBannerViewProps = ReturnType<typeof useCookieBannerState>;

export const CookieBannerView = ({ accept, visible }: CookieBannerViewProps) =>
  visible ? (
    <SafeArea bottom cn={styles.root}>
      <div className={_.cn(styles.panel, $.surface(`surfaceGlass`), $.radius(`lg`))}>
        <Text cn={styles.text} text={t(`cookieBanner.text`)} typography="caption" />
        <Button cn={styles.accept} onClick={accept} text={t(`cookieBanner.accept`)} type="primary" />
      </div>
    </SafeArea>
  ) : undefined;
