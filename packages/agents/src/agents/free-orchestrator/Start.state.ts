import { useState } from "react";

import type { StartProps } from "./Start";

export const useStartState = ({
  disabled = false,
  onCancel,
  onStart,
  options,
  placeholder,
  selectedOptions: selectedOptionsProp,
}: StartProps) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedOptionsProp ?? options[0] ?? ``);
  const [customStarterInput, setCustomStarterInput] = useState(``);

  const submit = () => {
    const label = customStarterInput.trim() === `` ? selectedOptions : customStarterInput.trim();
    onStart(label);
  };

  return {
    customStarterInput,
    disabled,
    onCancel,
    options,
    placeholder,
    selectedOptions,
    setCustomStarterInput,
    setSelectedOptions,
    submit,
  };
};

export type StartViewProps = ReturnType<typeof useStartState>;
