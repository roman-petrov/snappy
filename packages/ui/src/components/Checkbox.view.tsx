import { _ } from "@snappy/core";
import { Check } from "lucide-react";

import type { useCheckboxState } from "./Checkbox.state";

import { $ } from "../$";
import styles from "./Checkbox.module.scss";
import { Icon } from "./Icon";
import { Tap } from "./Tap";

export type CheckboxViewProps = ReturnType<typeof useCheckboxState>;

export const CheckboxView = ({ checked, children, cn, disabled, onActivate, tapProps }: CheckboxViewProps) => (
  <div className={_.cn(styles.root, cn)}>
    <Tap {...tapProps} cn={_.cn($.tap(`icon`), styles.control)} onClick={onActivate}>
      <span aria-hidden className={_.cn(styles.box, checked && styles.checked)} data-disabled={disabled || undefined}>
        {checked ? <Icon cn={styles.icon} color="surface" icon={Check} size="sm" /> : undefined}
      </span>
    </Tap>
    {children === undefined ? undefined : (
      <span className={_.cn($.typography(`caption`), styles.label)}>{children}</span>
    )}
  </div>
);
