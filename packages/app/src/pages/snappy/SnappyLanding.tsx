import { Button, Page } from "@snappy/ui";

import { HeaderContent } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";

export const SnappyLanding = () => (
  <Page trailing={<HeaderContent />}>
    <Button link={Routes.chat} text={t(`snappy.landing.start`)} type="primary" />
  </Page>
);
