import { FilePicker } from "@snappy/browser";

import type { FileSelectProps } from "./FileSelect";

export const useFileSelectState = ({
  accept,
  disabled = false,
  fileName,
  hint,
  multiple = false,
  onChange,
  pickLabel,
}: FileSelectProps) => {
  const pick = async () =>
    onChange(await FilePicker.select({ accept: accept === undefined ? undefined : [...accept], multiple }));

  return { disabled, fileName, hint, pick, pickLabel };
};
