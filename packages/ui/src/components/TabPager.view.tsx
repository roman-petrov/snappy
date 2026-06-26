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

type TintsProps = { cn: string; items: TabPagerViewProps[`items`]; opacities: number[] };

const Tints = ({ cn, items, opacities }: TintsProps) =>
  opacities.map((opacity, slot) => <div className={cn} key={items[slot]?.id} style={{ opacity }} />);

export const TabPagerView = ({ animating, items, opacities, pageIndex }: TabPagerViewProps) => (
  <PageChrome active shell>
    <div
      className={_.cn(styles.bar, animating && styles.barAnimating, $.elevation(`e2`))}
      style={{ ...tabCount(items.length), [`--tab-index` as string]: pageIndex }}
    >
      <Tints cn={_.cn(styles.tint, styles.tintPanel)} items={items} opacities={opacities} />
      <div className={styles.indicator}>
        <Tints cn={_.cn(styles.tint, styles.tintIndicator)} items={items} opacities={opacities} />
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
