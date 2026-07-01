import type { TypeWriterSpeed } from "@snappy/domain";

import { $data } from "../../../data";

export const useSettingsTypeWriterSpeedState = () => {
  const { patch, settings } = $data.settings();
  const value = settings?.typeWriterSpeed;
  const select = async (speed: TypeWriterSpeed | undefined) => patch({ typeWriterSpeed: speed ?? false });

  return { select, value };
};
