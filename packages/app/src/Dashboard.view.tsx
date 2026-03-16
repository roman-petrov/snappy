import { Snappy } from "@snappy/domain";
import { Alert, Tabs } from "@snappy/ui";

import type { useDashboardState } from "./Dashboard.state";

import { ProcessButton, SmallButton, TextCard, ToggleButton } from "./components";
import { t } from "./core";
import styles from "./Dashboard.module.scss";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

export const DashboardView = ({
  clear,
  copied,
  copyResult,
  error,
  loading,
  mobile,
  options,
  processText,
  result,
  setOption,
  setText,
  showResult,
  switchToEdit,
  text,
}: DashboardViewProps) => (
  <section className={`${styles.section} ${styles[mobile ? `sectionMobile` : `sectionDesktop`]}`} data-mobile={mobile}>
    <TextCard
      compact={mobile}
      loading={loading}
      onTextChange={setText}
      result={result}
      showResult={showResult}
      text={text}
    />
    <div className={styles.controls}>
      <div className={styles.toggleRow} role="group">
        <ToggleButton
          compact={mobile}
          disabled={loading}
          onClick={() => setOption(`addEmoji`, !options.addEmoji)}
          pressed={options.addEmoji}
          text={t(`options.addEmoji`)}
          variant="emoji"
        />
        <ToggleButton
          compact={mobile}
          disabled={loading}
          onClick={() => setOption(`addFormatting`, !options.addFormatting)}
          pressed={options.addFormatting}
          text={t(`options.addFormatting`)}
          variant="format"
        />
      </div>
      <Tabs
        ariaLabel={t(`options.length.label`)}
        cn={styles.tabsLength}
        disabled={loading}
        onChange={value => setOption(`length`, value)}
        options={Snappy.lengths.map(key => ({
          label: `${Snappy.lengthEmojis[key]}${mobile ? `` : ` ${t(`options.length.${key}`)}`}`,
          value: key,
        }))}
        value={options.length}
      />
      <Tabs
        ariaLabel={t(`options.style.label`)}
        cn={styles.tabsStyle}
        disabled={loading}
        onChange={value => setOption(`style`, value)}
        options={Snappy.styles.map(key => ({
          label: `${Snappy.styleEmojis[key]}${mobile ? `` : ` ${t(`options.style.${key}`)}`}`,
          value: key,
        }))}
        value={options.style}
      />
      <div className={styles.submitRow}>
        <ProcessButton
          compact={mobile}
          disabled={loading || text.trim() === ``}
          disabledEmpty={!loading && text.trim() === ``}
          loading={loading}
          onClick={processText}
          text={loading ? t(`dashboard.submitting`) : t(`dashboard.submit`)}
        />
        {showResult ? (
          <>
            <SmallButton
              compact={mobile}
              hideText={mobile}
              icon="✨"
              onClick={clear}
              text={t(`dashboard.actionNew`)}
              variant="neutral"
            />
            <SmallButton
              compact={mobile}
              hideText={mobile}
              icon="✎"
              onClick={switchToEdit}
              text={t(`dashboard.actionEdit`)}
              variant="neutral"
            />
            <SmallButton
              compact={mobile}
              full={!mobile}
              hideText={mobile}
              icon={copied ? `✓` : `📋`}
              onClick={copyResult}
              text={copied ? t(`dashboard.copied`) : t(`dashboard.copy`)}
              variant="copy"
            />
          </>
        ) : undefined}
      </div>
      {error === `` ? undefined : <Alert text={t(`dashboard.errors.${error}`)} variant="error" />}
    </div>
  </section>
);
