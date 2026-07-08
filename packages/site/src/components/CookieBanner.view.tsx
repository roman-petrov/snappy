import { _ } from "@snappy/core";
import { $, Button, Link, SafeArea, Text } from "@snappy/ui";

import type { useCookieBannerState } from "./CookieBanner.state";

import { AppTags } from "../AppTags";
import { t } from "../locales";
import styles from "./CookieBanner.module.scss";

export type CookieBannerViewProps = ReturnType<typeof useCookieBannerState>;

export const CookieBannerView = ({ accept, visible }: CookieBannerViewProps) =>
  visible ? (
    <SafeArea bottom cn={styles.root}>
      <div className={_.cn(styles.panel, $.surface(`surfaceGlass`), $.radius(`lg`))}>
        <div className={styles.message}>
          <Text as="p" cn={styles.text} text={t(`cookieBanner.text`)} typography="caption" />
          <Link cn={styles.more} link={{ href: `/privacy` }} text={t(`cookieBanner.more`)} />
        </div>
        <Button
          cn={styles.accept}
          onClick={accept}
          tag={AppTags.site.cookie.accept}
          text={t(`cookieBanner.accept`)}
          type="primary"
        />
      </div>
    </SafeArea>
  ) : undefined;
