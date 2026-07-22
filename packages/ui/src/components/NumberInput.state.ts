import { useEffect, useRef, useState } from "react";

import type { InputProps } from "./Input";
import type { NumberInputProps } from "./NumberInput";

const fromText = (text: string, integer: boolean): number | undefined => {
  if (text.trim() === ``) {
    return undefined;
  }
  const parsed = Number(integer ? text : text.replace(`,`, `.`));

  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return integer && !Number.isInteger(parsed) ? undefined : parsed;
};

const toText = (value: number | undefined) => (value === undefined ? `` : String(value));

export const useNumberInputState = ({ integer = false, onBlur, onChange, value, ...rest }: NumberInputProps) => {
  const editing = useRef(false);
  const [text, setText] = useState(() => toText(value));

  useEffect(() => {
    if (!editing.current) {
      setText(toText(value));
    }
  }, [value]);

  const input: InputProps = {
    ...rest,
    inputMode: integer ? `numeric` : `decimal`,
    onBlur: () => {
      editing.current = false;
      setText(toText(value));
      onBlur?.();
    },
    onChange: raw => {
      editing.current = true;
      setText(raw);
      onChange?.(fromText(raw, integer));
    },
    type: `text`,
    value: text,
  };

  return { input };
};
