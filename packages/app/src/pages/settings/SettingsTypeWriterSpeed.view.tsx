import type { useSettingsTypeWriterSpeedState } from "./SettingsTypeWriterSpeed.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsOptionList } from "./components";

export type SettingsTypeWriterSpeedViewProps = ReturnType<typeof useSettingsTypeWriterSpeedState>;

export const SettingsTypeWriterSpeedView = (props: SettingsTypeWriterSpeedViewProps) => (
  <Page back title={t(`settings.typeWriterSpeed.title`)}>
    <SettingsOptionList
      {...props}
      options={[
        { icon: `stream`, label: t(`settings.typeWriterSpeed.stream`), value: undefined },
        { icon: `keyboard_double_arrow_right`, label: t(`settings.typeWriterSpeed.fast`), value: `fast` },
        { icon: `keyboard`, label: t(`settings.typeWriterSpeed.medium`), value: `medium` },
        { icon: `keyboard_double_arrow_left`, label: t(`settings.typeWriterSpeed.slow`), value: `slow` },
      ]}
    />
  </Page>
);
