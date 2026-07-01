import { useEffect, useRef, useState } from "react";

import type { InputProps } from "./Input";
import type { NumberInputProps } from "./NumberInput";

const fromText = (text: string): number | undefined => {
  if (text.trim() === ``) {
    return undefined;
  }
  const parsed = Number(text.replace(`,`, `.`));

  return Number.isFinite(parsed) ? parsed : undefined;
};

const toText = (value: number | undefined) => (value === undefined ? `` : String(value));

export const useNumberInputState = ({ onBlur, onChange, value, ...rest }: NumberInputProps) => {
  const editing = useRef(false);
  const [text, setText] = useState(() => toText(value));

  useEffect(() => {
    if (!editing.current) {
      setText(toText(value));
    }
  }, [value]);

  const input: InputProps = {
    ...rest,
    onBlur: () => {
      editing.current = false;
      setText(toText(value));
      onBlur?.();
    },
    onChange: raw => {
      editing.current = true;
      setText(raw);
      onChange(fromText(raw));
    },
    type: `text`,
    value: text,
  };

  return { input };
};
