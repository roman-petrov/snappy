import type { FileSelectOptions } from "@snappy/browser";

import { useFileSelectState } from "./FileSelect.state";
import { FileSelectView } from "./FileSelect.view";

export type FileSelectProps = FileSelectOptions & {
  disabled?: boolean;
  fileName?: string;
  hint?: string;
  onChange: (files: File[]) => void;
  pickLabel: string;
};

export const FileSelect = (props: FileSelectProps) => <FileSelectView {...useFileSelectState(props)} />;
