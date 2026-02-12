import { Button } from "../../shared/Button";
import { TelegramIcon } from "../../shared/TelegramIcon";
import styles from "./CtaBlock.module.css";
import { t } from "../Locale";

export const CtaBlock = () => (
  <section className={styles[`block`]}>
    <h2 className={styles[`title`]}>{t(`cta.title`)}</h2>
    <p className={styles[`lead`]}>{t(`cta.lead`)}</p>
    <Button className={styles[`cta`]} href="https://t.me/sn4ppy_bot" large primary>
      <TelegramIcon /> {t(`cta.button`)}
    </Button>
  </section>
);
