import type { UiPlan } from "@snappy/domain";

import { useUiPlanFormState } from "./UiPlanForm.state";
import { UiPlanFormView } from "./UiPlanForm.view";

export type UiPlanFormProps = {
  disabled?: boolean;
  onSubmit: (answers: Record<string, boolean | number | string | string[] | undefined>) => void;
  plan: UiPlan;
};

export const UiPlanForm = (props: UiPlanFormProps) => <UiPlanFormView {...useUiPlanFormState(props)} />;
