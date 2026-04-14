import { Button, Tabs, TextInput } from "@snappy/ui";

import type { StartViewProps } from "./Start.state";

import { t } from "../../locales";
import styles from "./Start.module.scss";

export const StartView = ({
  customStarterInput,
  disabled,
  onReject,
  options,
  placeholder,
  selectedOptions,
  setCustomStarterInput,
  setSelectedOptions,
  submit,
}: StartViewProps) => (
  <section className={styles.root}>
    <Tabs
      disabled={disabled}
      onChange={setSelectedOptions}
      options={options.map(item => ({ label: item, title: item, value: item }))}
      value={selectedOptions}
    />
    <TextInput
      disabled={disabled}
      onChange={setCustomStarterInput}
      placeholder={placeholder ?? t(`chat.customStarterPlaceholder`)}
      value={customStarterInput}
    />
    <Button disabled={disabled} onClick={submit} text={t(`chat.continue`)} type="primary" />
    <Button disabled={disabled} onClick={onReject} text={t(`chat.cancel`)} />
  </section>
);
