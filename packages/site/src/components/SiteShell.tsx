import type { ReactNode } from "react";

import { Page } from "@snappy/ui";

import { CookieBanner } from "./CookieBanner";
import { Footer } from "./Footer";

export type SiteShellProps = { view: () => ReactNode };

export const SiteShell = ({ view: View }: SiteShellProps) => (
  <Page>
    <main>
      <View />
    </main>
    <Footer />
    <CookieBanner />
  </Page>
);
