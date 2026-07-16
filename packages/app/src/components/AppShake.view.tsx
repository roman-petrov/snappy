import { ShakeHost } from "@snappy/ui";

import type { useAppShakeState } from "./AppShake.state";

export type AppShakeViewProps = ReturnType<typeof useAppShakeState>;

export const AppShakeView = ({ action, signedIn }: AppShakeViewProps) => (
  <ShakeHost action={action} signedIn={signedIn} />
);
