import { Icon } from "@snappy/ui";
import { Check } from "lucide-react";
import { Fragment } from "react";

import { SettingsCardRow } from "./SettingsCardRow";
import { SettingsCardSeparator } from "./SettingsCardSeparator";

export type SettingsOption<T extends string | undefined> = { icon: Icon; label: string; value: T };

export type SettingsOptionRowsProps<T extends string | undefined> = {
  onSelect: (value: T) => void;
  options: readonly SettingsOption<T>[];
  value: T;
};

export const SettingsOptionRows = <T extends string | undefined>({
  onSelect,
  options,
  value,
}: SettingsOptionRowsProps<T>) =>
  options.map((opt, index) => (
    <Fragment key={opt.value ?? `none`}>
      {index > 0 && <SettingsCardSeparator />}
      <SettingsCardRow
        icon={opt.icon}
        onClick={() => onSelect(opt.value)}
        right={value === opt.value ? <Icon color="primary" icon={Check} /> : undefined}
        text={opt.label}
      />
    </Fragment>
  ));
