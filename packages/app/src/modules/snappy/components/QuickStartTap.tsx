import { Platform } from "@snappy/platform";
import { CardButton, CardRow, Icon, Text } from "@snappy/ui";
import { Lightbulb } from "lucide-react";

import { AppTags } from "../../../AppTags";
import { t } from "../../../core";
import { Routes } from "../../../Routes";
import styles from "./QuickStartTap.module.scss";

export const QuickStartTap = () => (
  <CardButton cn={styles.root} link={Routes.snappy.chat} plain tag={AppTags.snappy.chat.start}>
    <CardRow emoji="✨">
      <Text text={t(`snappy.quickStartTap.title`)} typography="h3" />
      <Text text={t(`snappy.quickStartTap.lead`)} typography="caption" />
      {Platform() === `native` ? (
        <span className={styles.shake}>
          <Icon icon={Lightbulb} size="sm" />
          <Text text={t(`snappy.quickStartTap.shake`)} typography="captionSm" />
        </span>
      ) : undefined}
    </CardRow>
  </CardButton>
);
