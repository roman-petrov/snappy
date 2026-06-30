import { Redirect } from "@snappy/app-router";
import { Page, RichCard, Text } from "@snappy/ui";
import { ClipboardList, Sparkles } from "lucide-react";

import type { usePresetPickerState } from "./PresetPicker.state";

import { BalanceTap } from "../../components";
import { t } from "../../core";
import { Routes } from "../../Routes";
import styles from "./PresetPicker.module.scss";

export type PresetPickerViewProps = ReturnType<typeof usePresetPickerState>;

export const PresetPickerView = ({ card, invalid, missingStatic, pageTitle }: PresetPickerViewProps) =>
  invalid || card === undefined ? (
    <Redirect to={Routes.$.home} />
  ) : missingStatic ? (
    <Redirect to={Routes.chat({ presetId: card.id })} />
  ) : (
    <Page back title={pageTitle} trailing={<BalanceTap />}>
      <div className={styles.root}>
        <Text text={t(`snappy.preset.modes.lead`)} typography="large" />
        <RichCard
          cn={styles.card}
          description={t(`snappy.preset.modes.snappy.description`)}
          icon={Sparkles}
          link={Routes.chat({ presetId: card.id })}
          title={t(`snappy.preset.modes.snappy.title`)}
        />
        <RichCard
          cn={styles.card}
          description={t(`snappy.preset.modes.static.description`)}
          icon={ClipboardList}
          link={Routes.static({ presetId: card.id })}
          title={t(`snappy.preset.modes.static.title`)}
        />
      </div>
    </Page>
  );
