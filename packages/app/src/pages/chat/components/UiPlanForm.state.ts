import { useCallback, useState } from "react";

import type { UiPlanFormProps } from "./UiPlanForm";

type Answers = Record<string, boolean | number | string | string[] | undefined>;

export const useUiPlanFormState = ({ disabled = false, onSubmit, plan }: UiPlanFormProps) => {
  const [answers, setAnswers] = useState(() => {
    const initial: Answers = {};
    for (const field of plan.fields) {
      initial[field.id] = field.default;
    }

    return initial;
  });

  const setField = useCallback((id: string, value: boolean | number | string | string[] | undefined) => {
    setAnswers(previous => ({ ...previous, [id]: value }));
  }, []);

  const submit = useCallback(() => {
    onSubmit(answers);
  }, [answers, onSubmit]);

  return { answers, disabled, plan, setField, submit };
};

export type UiPlanFormViewProps = ReturnType<typeof useUiPlanFormState>;
