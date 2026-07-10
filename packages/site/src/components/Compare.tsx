import { _ } from "@snappy/core";
import { $, Icon, Text } from "@snappy/ui";
import { Check, Minus } from "lucide-react";

import { t } from "../locales";
import styles from "./Compare.module.scss";
import { Section } from "./Section";

const items = [`one`, `two`, `three`, `four`] as const;

export const Compare = () => (
  <Section id="compare" lead={t(`compare.lead`)} title={t(`compare.title`)}>
    <div className={styles.grid}>
      {(
        [
          { color: undefined, icon: Minus, path: `old`, win: false },
          { color: `accentIndigo`, icon: Check, path: `new`, win: true },
        ] as const
      ).map(({ color, icon: Mark, path, win }) => (
        <div
          className={_.cn(styles.col, win && styles.win, win && $.surface(`surface`), win && $.radius(`lg`))}
          key={path}
        >
          <Text as="h3" text={t(`compare.${path}.title`)} typography="h3" />
          <ul className={styles.list}>
            {items.map(key => (
              <li className={styles.item} key={key}>
                <Icon cn={win ? `` : styles.mute} color={color} icon={Mark} size="sm" />
                <Text text={t(`compare.${path}.${key}`)} typography="body" />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </Section>
);
