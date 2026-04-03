export type UiAnswers = Record<string, boolean | number | string | string[] | undefined>;

const fieldKinds = [`text`, `toggle`, `tabs_single`, `tabs_multi`] as const;

export type UiField = UiFieldTabsMulti | UiFieldTabsSingle | UiFieldText | UiFieldToggle;

export type UiFieldKind = (typeof fieldKinds)[number];

export type UiFieldTabsMulti = {
  default?: string[];
  id: string;
  kind: `tabs_multi`;
  label: string;
  options: UiTabOption[];
};

export type UiFieldTabsSingle = {
  default?: string;
  id: string;
  kind: `tabs_single`;
  label: string;
  options: UiTabOption[];
};

export type UiFieldText = {
  default?: string;
  id: string;
  kind: `text`;
  label: string;
  placeholder?: string;
  prompt?: string;
};

export type UiFieldToggle = {
  default?: boolean;
  id: string;
  kind: `toggle`;
  label: string;
  promptOff?: string;
  promptOn?: string;
};

export type UiPlan = { fields: UiField[]; title: string };

export type UiTabOption = { label: string; prompt?: string; value: string };

export const UiPlan = { fieldKinds };
