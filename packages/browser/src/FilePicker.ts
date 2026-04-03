/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { Dom } from "./Dom";

export type FileSelectOptions = { accept?: string[]; multiple?: boolean };

const select = async ({ accept, multiple = false }: FileSelectOptions) => {
  const inputElement = document.createElement(`input`);
  inputElement.type = `file`;
  inputElement.multiple = multiple;
  inputElement.accept = accept?.join(`,`) ?? `*`;
  inputElement.click();
  const { promise, resolve } = Promise.withResolvers();
  Dom.subscribeOnce(inputElement, `change`, () => resolve());
  Dom.subscribeOnce(inputElement, `cancel`, () => resolve());
  await promise;

  return [...(inputElement.files ?? [])];
};

export const FilePicker = { select };
