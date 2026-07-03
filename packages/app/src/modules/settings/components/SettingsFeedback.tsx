import { FilledIcon, Link, Text } from "@snappy/ui";
import { Mail } from "lucide-react";

import { t } from "../../../core";
import styles from "./SettingsFeedback.module.scss";

export const SettingsFeedback = () => (
  <div className={styles.root}>
    <FilledIcon color="accentViolet" icon={Mail} />
    <span className={styles.text}>
      <Text text={t(`settings.feedback.hint`)} typography="bodySm" />
      <Link link={{ href: `mailto:roman.petrov@snappy-ai.ru` }} text="roman.petrov@snappy-ai.ru" />
    </span>
  </div>
);
