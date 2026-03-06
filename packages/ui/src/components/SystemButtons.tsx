import { IconButtonLocale } from "./IconButtonLocale";
import { IconButtonTheme } from "./IconButtonTheme";
import styles from "./SystemButtons.module.scss";

export const SystemButtons = () => (
  <div className={styles.root}>
    <IconButtonTheme />
    <IconButtonLocale />
  </div>
);
