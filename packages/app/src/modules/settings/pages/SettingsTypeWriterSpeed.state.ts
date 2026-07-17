import type { TypeWriterSpeed } from "@snappy/domain";

import { r } from "../../../data";

export const useSettingsTypeWriterSpeedState = () => {
  const [settings, patch] = r.settings();
  const value = settings?.typeWriterSpeed;
  const select = async (speed: TypeWriterSpeed | undefined) => patch({ typeWriterSpeed: speed ?? false });

  return { select, value };
};
