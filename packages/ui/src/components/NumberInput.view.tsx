import type { useNumberInputState } from "./NumberInput.state";

import { Input } from "./Input";

export type NumberInputViewProps = ReturnType<typeof useNumberInputState>;

export const NumberInputView = ({ input }: NumberInputViewProps) => <Input {...input} />;
