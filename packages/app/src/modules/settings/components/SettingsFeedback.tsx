import { Email } from "@snappy/core";
import { FilledIcon, Link, Text } from "@snappy/ui";
import { Mail } from "lucide-react";

import { t } from "../../../core";
import styles from "./SettingsFeedback.module.scss";
import { SettingsRow } from "./SettingsRow";

export const SettingsFeedback = () => {
  const email = `roman.petrov@snappy-ai.ru`;

  return (
    <SettingsRow icon={<FilledIcon color="accentViolet" icon={Mail} />}>
      <span className={styles.text}>
        <Text text={t(`settings.feedback.hint`)} typography="bodySm" />
        <Link link={{ href: Email.mailto(email) }} text={email} />
      </span>
    </SettingsRow>
  );
};
