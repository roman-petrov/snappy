import type { ReactNode } from "react";

import { _ } from "@snappy/core";
import { Page } from "@snappy/ui";

import { CookieBanner } from "./CookieBanner";
import { Footer } from "./Footer";
import styles from "./SitePage.module.scss";

export type SitePageProps = { children: ReactNode; cn?: string; flush?: boolean };

export const SitePage = ({ children, cn, flush = false }: SitePageProps) => (
  <Page>
    <main className={_.cn(styles.main, flush && styles.flush, cn)} id="main">
      {children}
    </main>
    <Footer />
    <CookieBanner />
  </Page>
);
