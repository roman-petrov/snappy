import { useSelectState } from "./Select.state";
import { SelectView } from "./Select.view";

export type SelectOption = { label: string; value: string };

export type SelectProps = {
  disabled?: boolean;
  id: string;
  label: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  value: string;
};

export const Select = (props: SelectProps) => <SelectView {...useSelectState(props)} />;
