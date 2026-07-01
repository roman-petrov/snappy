import { PageChrome } from "@snappy/app-router";
import { _ } from "@snappy/core";

import type { useTabPagerState } from "./TabPager.state";

import { $ } from "../$";
import { Icon } from "./Icon";
import styles from "./TabPager.module.scss";
import { Tap } from "./Tap";

export type TabPagerViewProps = ReturnType<typeof useTabPagerState>;

export const TabPagerView = ({ animating, items, pageIndex }: TabPagerViewProps) => (
  <PageChrome active shell>
    <div
      className={_.cn(styles.bar, animating && styles.barAnimating, $.elevation(`e2`))}
      style={{ [`--tab-count` as string]: items.length, [`--tab-index` as string]: pageIndex }}
    >
      <div className={styles.indicator} />
      {items.map(item => (
        <Tap cn={styles.tab} key={item.id} link={item.path}>
          <Icon icon={item.icon} size="md" />
          <span className={_.cn(styles.label, $.typography(`caption`))}>{item.label}</span>
        </Tap>
      ))}
    </div>
  </PageChrome>
);
