import { useState } from "react";

import type { StartProps } from "./Start";

export const useStartState = ({
  disabled = false,
  onReject,
  onResolve,
  options,
  placeholder,
  selectedOptions: selectedOptionsProp,
}: StartProps) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedOptionsProp ?? options[0] ?? ``);
  const [customStarterInput, setCustomStarterInput] = useState(``);

  const submit = () => {
    const label = customStarterInput.trim() === `` ? selectedOptions : customStarterInput.trim();
    onResolve({ label });
  };

  return {
    customStarterInput,
    disabled,
    onReject,
    options,
    placeholder,
    selectedOptions,
    setCustomStarterInput,
    setSelectedOptions,
    submit,
  };
};

export type StartViewProps = ReturnType<typeof useStartState>;
