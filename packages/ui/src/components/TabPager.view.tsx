import { _ } from "@snappy/core";
import { type CSSProperties, memo } from "react";

import type { useTabPagerState } from "./TabPager.state";

import { $ } from "../$";
import { RouterPage } from "../router/components/RouterPage";
import { RouteScroll } from "../router/components/RouteScroll";
import { Icon } from "./Icon";
import { PageChrome } from "./PageChrome";
import styles from "./TabPager.module.scss";
import { Tap } from "./Tap";

export type TabPagerViewProps = ReturnType<typeof useTabPagerState>;

const tabCount = (count: number) => ({ [`--tab-count` as string]: count }) as CSSProperties;

type TintsProps = { items: TabPagerViewProps[`content`][`items`]; tints: CSSProperties[] };

const Tints = ({ items, tints }: TintsProps) =>
  tints.map((style, slot) => <div className={styles.tint} key={items[slot]?.id} style={style} />);

const TabPagerContent = ({
  contentDimmed,
  contentRef,
  idlePage,
  index,
  items,
  scrollPaddingBottom,
  settling,
  slides,
  trackRef,
}: TabPagerViewProps[`content`]) => (
  <RouteScroll dimmed={contentDimmed} ref={contentRef} scroll={!slides}>
    {slides ? (
      <div
        className={_.cn(styles.track, settling && styles.trackSettling)}
        ref={trackRef}
        style={tabCount(items.length)}
      >
        {items.map((item, slot) => (
          <div
            className={_.cn(styles.slide, slot === index && styles.slideActive)}
            key={item.path}
            style={{ paddingBottom: scrollPaddingBottom }}
          >
            <RouterPage path={item.path} />
          </div>
        ))}
      </div>
    ) : idlePage === undefined ? undefined : (
      <RouterPage {...idlePage} />
    )}
  </RouteScroll>
);

const TabPagerContentMemo = memo(TabPagerContent);

export const TabPagerView = ({
  animating,
  barIndex,
  content,
  indicatorTints,
  panelTints,
  select,
  track,
}: TabPagerViewProps) => (
  <>
    <TabPagerContentMemo {...content} />
    {track && (
      <PageChrome active role="shell">
        <div
          className={_.cn(styles.bar, animating && styles.barAnimating, $.elevation(`e2`))}
          style={{ ...tabCount(content.items.length), [`--tab-index` as string]: barIndex }}
        >
          <Tints items={content.items} tints={panelTints} />
          <div className={styles.indicator}>
            <Tints items={content.items} tints={indicatorTints} />
          </div>
          {content.items.map(item => (
            <Tap cn={styles.tab} key={item.id} onClick={() => select(item.id)}>
              <Icon icon={item.icon} size="md" />
              <span className={_.cn(styles.label, $.typography(`caption`))}>{item.label}</span>
            </Tap>
          ))}
        </div>
      </PageChrome>
    )}
  </>
);
