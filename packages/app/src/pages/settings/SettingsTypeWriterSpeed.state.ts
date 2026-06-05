import type { TypeWriterSpeed } from "@snappy/domain";

import { useAsyncEffect } from "@snappy/ui";
import { useState } from "react";

import { trpc } from "../../core";

export const useSettingsTypeWriterSpeedState = () => {
  const [value, setValue] = useState<TypeWriterSpeed | undefined>(undefined);

  useAsyncEffect(async () => {
    setValue((await trpc.user.settings.get.query()).typeWriterSpeed);
  }, []);

  const select = async (speed: TypeWriterSpeed | undefined) => {
    const { typeWriterSpeed } = await trpc.user.settings.set.mutate({ typeWriterSpeed: speed ?? false });
    setValue(typeWriterSpeed);
  };

  return { select, value };
};
