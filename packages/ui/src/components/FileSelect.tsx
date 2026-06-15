import type { ReactNode } from "react";

import { useFileSelectState } from "./FileSelect.state";
import { FileSelectView } from "./FileSelect.view";

export type FileSelectProps = {
  accept?: string[];
  children?: ReactNode;
  disabled?: boolean;
  fileName?: string;
  hint?: string;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  pickLabel: string;
};

export const FileSelect = (props: FileSelectProps) => <FileSelectView {...useFileSelectState(props)} />;
