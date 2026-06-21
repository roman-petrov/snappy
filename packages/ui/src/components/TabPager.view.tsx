import type { CSSProperties } from "react";

import { PageChrome } from "@snappy/app-router";
import { _ } from "@snappy/core";

import type { useTabPagerState } from "./TabPager.state";

import { $ } from "../$";
import { Icon } from "./Icon";
import styles from "./TabPager.module.scss";
import { Tap } from "./Tap";

export type TabPagerViewProps = ReturnType<typeof useTabPagerState>;

const tabCount = (count: number) => ({ [`--tab-count` as string]: count }) as CSSProperties;

type TintsProps = { items: TabPagerViewProps[`items`]; tints: CSSProperties[] };

const Tints = ({ items, tints }: TintsProps) =>
  tints.map((style, slot) => <div className={styles.tint} key={items[slot]?.id} style={style} />);

export const TabPagerView = ({ animating, indicatorTints, items, pageIndex, panelTints }: TabPagerViewProps) => (
  <PageChrome active shell>
    <div
      className={_.cn(styles.bar, animating && styles.barAnimating, $.elevation(`e2`))}
      style={{ ...tabCount(items.length), [`--tab-index` as string]: pageIndex }}
    >
      <Tints items={items} tints={panelTints} />
      <div className={styles.indicator}>
        <Tints items={items} tints={indicatorTints} />
      </div>
      {items.map(item => (
        <Tap cn={styles.tab} key={item.id} link={item.path}>
          <Icon icon={item.icon} size="md" />
          <span className={_.cn(styles.label, $.typography(`caption`))}>{item.label}</span>
        </Tap>
      ))}
    </div>
  </PageChrome>
);
