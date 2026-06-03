import { Page } from "@snappy/ui";
import { ChevronsLeft, ChevronsRight, Keyboard, Waves } from "lucide-react";

import type { useSettingsTypeWriterSpeedState } from "./SettingsTypeWriterSpeed.state";

import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsTypeWriterSpeedViewProps = ReturnType<typeof useSettingsTypeWriterSpeedState>;

export const SettingsTypeWriterSpeedView = (props: SettingsTypeWriterSpeedViewProps) => (
  <Page back title={t(`settings.typeWriterSpeed.title`)}>
    <SettingsOptionList
      {...props}
      options={[
        { icon: Waves, label: t(`settings.typeWriterSpeed.stream`), value: undefined },
        { icon: ChevronsRight, label: t(`settings.typeWriterSpeed.fast`), value: `fast` },
        { icon: Keyboard, label: t(`settings.typeWriterSpeed.medium`), value: `medium` },
        { icon: ChevronsLeft, label: t(`settings.typeWriterSpeed.slow`), value: `slow` },
      ]}
    />
  </Page>
);
