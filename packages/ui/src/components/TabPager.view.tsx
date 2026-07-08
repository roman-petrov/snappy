import { PageChrome } from "@snappy/app-router";
import { _ } from "@snappy/core";

import type { useTabPagerState } from "./TabPager.state";

import { $ } from "../$";
import { Icon } from "./Icon";
import styles from "./TabPager.module.scss";
import { Tap } from "./Tap";

export type TabPagerViewProps = ReturnType<typeof useTabPagerState>;

export const TabPagerView = ({ bar, items }: TabPagerViewProps) => (
  <PageChrome active shell>
    <div className={_.cn(styles.bar, $.elevation(`e2`))} ref={bar} style={{ [`--tab-count` as string]: items.length }}>
      <div className={styles.indicator} />
      {items.map(item => (
        <Tap cn={styles.tab} key={item.id} link={item.path} tag={item.tag}>
          <Icon icon={item.icon} size="md" />
          <span className={_.cn(styles.label, $.typography(`caption`))}>{item.label}</span>
        </Tap>
      ))}
    </div>
  </PageChrome>
);
