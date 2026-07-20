import { Icon } from "@snappy/ui";
import { Check } from "lucide-react";
import { Fragment, type ReactNode } from "react";

import { SettingsCardRow } from "./SettingsCardRow";
import { SettingsCardSeparator } from "./SettingsCardSeparator";

export type SettingsOption<T extends string | undefined> = { icon?: ReactNode; label: string; value: T };

export type SettingsOptionRowsProps<T extends string | undefined> = {
  options: readonly SettingsOption<T>[];
  select: (value: T) => void;
  value: T;
};

export const SettingsOptionRows = <T extends string | undefined>({
  options,
  select,
  value,
}: SettingsOptionRowsProps<T>) =>
  options.map((opt, index) => (
    <Fragment key={opt.value ?? `none`}>
      {index > 0 && <SettingsCardSeparator />}
      <SettingsCardRow
        icon={opt.icon}
        onClick={() => select(opt.value)}
        right={value === opt.value ? <Icon color="primary" icon={Check} /> : undefined}
        selected={value === opt.value}
        text={opt.label}
      />
    </Fragment>
  ));
