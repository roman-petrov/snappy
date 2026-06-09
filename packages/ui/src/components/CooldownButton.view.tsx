import type { useCooldownButtonState } from "./CooldownButton.state";

import { Button } from "./Button";

export type CooldownButtonViewProps = ReturnType<typeof useCooldownButtonState>;

export const CooldownButtonView = (props: CooldownButtonViewProps) => <Button {...props} />;
