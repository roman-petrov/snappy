import type { ApiPreset } from "@snappy/server-api";

import type { usePresetCardState } from "./PresetCard.state";

import { t } from "../../../core";
import styles from "../Dashboard.module.scss";

export type PresetCardViewProps = ReturnType<typeof usePresetCardState>;

const CardFace = ({ preset }: { preset: ApiPreset }) => (
  <>
    <span className={styles.cardEmoji}>{preset.emoji}</span>
    <span className={styles.cardBody}>
      <span className={styles.cardTitle}>{preset.title}</span>
      <span className={styles.cardDesc}>{preset.description}</span>
    </span>
  </>
);

export const PresetCardView = (props: PresetCardViewProps) => {
  const { variant } = props;
  if (variant === `free`) {
    const { onPick, preset, selected } = props;

    return (
      <button
        className={`${styles.freeCard} ${selected ? styles.cardSelected : ``}`}
        onClick={() => onPick(preset.id)}
        type="button"
      >
        <CardFace preset={preset} />
      </button>
    );
  }

  const { copied, onPick, preset, requestCopy, selected } = props;

  return (
    <div className={`${styles.presetCard} ${selected ? styles.cardSelected : ``}`}>
      <button className={styles.cardMain} onClick={() => onPick(preset.id)} type="button">
        <CardFace preset={preset} />
      </button>
      {preset.prompt === `` ? undefined : (
        <button className={styles.copyPrompt} onClick={requestCopy} type="button">
          {copied ? t(`dashboard.copied`) : t(`dashboard.presets.copyPrompt`)}
        </button>
      )}
    </div>
  );
};
