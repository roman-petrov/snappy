import { FilePicker } from "@snappy/browser";

import type { FileSelectProps } from "./FileSelect";

export const useFileSelectState = ({
  accept,
  disabled = false,
  multiple = false,
  onChange,
  ...rest
}: FileSelectProps) => {
  const pick = async () =>
    onChange(await FilePicker.select({ accept: accept === undefined ? undefined : [...accept], multiple }));

  return { ...rest, disabled, pick };
};
