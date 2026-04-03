import { FilePicker } from "@snappy/browser";
import { useState } from "react";

import type { StaticFormAnswers } from "../Meta";
import type { StaticFormProps } from "./StaticForm";

export const useStaticFormState = ({ disabled = false, onChange, onSubmit, plan }: StaticFormProps) => {
  const [answers, setAnswers] = useState<StaticFormAnswers>(() => {
    const initial: StaticFormAnswers = {};
    for (const field of plan.fields) {
      switch (field.kind) {
        case `file`: {
          initial[field.id] = undefined;

          break;
        }
        case `tabs_multi`: {
          initial[field.id] = field.default ?? [];

          break;
        }
        case `tabs_single`: {
          initial[field.id] = field.default ?? field.options[0]?.value;

          break;
        }
        case `text`:
        case `toggle`: {
          initial[field.id] = field.default;

          break;
        }
        default: {
          break;
        }
      }
    }

    return initial;
  });

  const setField = (id: string, value: boolean | File | number | string | string[] | undefined) => {
    setAnswers(previous => {
      const next = { ...previous, [id]: value };
      onChange?.(next);

      return next;
    });
  };

  const submit = () => {
    onSubmit(answers);
  };

  const pickFile = async (id: string, accept: readonly string[]) => {
    const files = await FilePicker.select({ accept: [...accept], multiple: false });
    const [next] = files;
    setField(id, next);
  };

  return { answers, disabled, pickFile, plan, setField, submit };
};

export type StaticFormViewProps = ReturnType<typeof useStaticFormState>;
