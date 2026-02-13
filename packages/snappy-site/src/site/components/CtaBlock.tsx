import { Button, TelegramIcon } from "@snappy/ui";
import { t } from "../core/Locale";
import styles from "./CtaBlock.module.css";

export const CtaBlock = () => (
  <section className={styles[`block`]}>
    <h2 className={styles[`title`]}>{t(`cta.title`)}</h2>
    <p className={styles[`lead`]}>{t(`cta.lead`)}</p>
    <Button className={styles[`cta`]} href="https://t.me/sn4ppy_bot" large primary>
      <TelegramIcon /> {t(`cta.button`)}
    </Button>
  </section>
);
