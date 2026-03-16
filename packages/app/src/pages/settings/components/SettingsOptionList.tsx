import { Fragment } from "react";

import { SettingsCard } from "./SettingsCard";
import { SettingsCardRow } from "./SettingsCardRow";
import { SettingsCards } from "./SettingsCards";
import { SettingsCardSeparator } from "./SettingsCardSeparator";

export type SettingsOption<T extends string> = { icon: string; label: string; value: T };

export type SettingsOptionListProps<T extends string> = {
  onSelect: (value: T) => void;
  options: readonly SettingsOption<T>[];
  selectedValue: T;
};

export const SettingsOptionList = <T extends string>({
  onSelect,
  options,
  selectedValue,
}: SettingsOptionListProps<T>) => (
  <SettingsCards>
    <SettingsCard>
      {options.map((opt, index) => (
        <Fragment key={opt.value}>
          {index > 0 && <SettingsCardSeparator />}
          <SettingsCardRow
            ariaPressed={selectedValue === opt.value}
            end={selectedValue === opt.value ? `✓` : undefined}
            icon={opt.icon}
            onClick={() => onSelect(opt.value)}
            text={opt.label}
          />
        </Fragment>
      ))}
    </SettingsCard>
  </SettingsCards>
);
