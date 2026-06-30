import type { StaticFormField } from "@snappy/snappy";

import { _ } from "@snappy/core";

const findOption = ({ field, value }: { field: StaticFormField; value: string }) =>
  value === `` ? undefined : (field.options ?? []).find(option => option.value === value);

const selectedOptions = ({ field, raw }: { field: StaticFormField; raw: unknown }) => {
  const selected = new Set(_.isArray(raw) ? raw.filter(_.isString) : []);

  return (field.options ?? []).filter(option => selected.has(option.value));
};

const singleValue = (raw: unknown) => (_.isString(raw) ? raw.trim() : ``);

export const StaticFormValues = { findOption, selectedOptions, singleValue };
