import { Icon, type Icon as UiIcon } from "@snappy/ui";
import { Fragment } from "react";

import { SettingsCard } from "./SettingsCard";
import { SettingsCardRow } from "./SettingsCardRow";
import { SettingsCards } from "./SettingsCards";
import { SettingsCardSeparator } from "./SettingsCardSeparator";

export type SettingsOption<T extends string | undefined> = { icon: UiIcon; label: string; value: T };

export type SettingsOptionListProps<T extends string | undefined> = {
  onSelect: (value: T) => void;
  options: readonly SettingsOption<T>[];
  value: T;
};

export const SettingsOptionList = <T extends string | undefined>({
  onSelect,
  options,
  value,
}: SettingsOptionListProps<T>) => (
  <SettingsCards>
    <SettingsCard>
      {options.map((opt, index) => (
        <Fragment key={opt.value ?? `none`}>
          {index > 0 && <SettingsCardSeparator />}
          <SettingsCardRow
            icon={opt.icon}
            onClick={() => onSelect(opt.value)}
            right={value === opt.value ? <Icon color="primary" name="check" /> : undefined}
            text={opt.label}
          />
        </Fragment>
      ))}
    </SettingsCard>
  </SettingsCards>
);
