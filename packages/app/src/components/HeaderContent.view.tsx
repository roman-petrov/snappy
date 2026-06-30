import { HeaderButtonGroup, IconButtonTheme, SystemButtons } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

import { BalanceTap } from "./BalanceTap";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ signedIn }: HeaderContentViewProps) =>
  signedIn ? (
    <HeaderButtonGroup>
      <IconButtonTheme />
      <BalanceTap />
    </HeaderButtonGroup>
  ) : (
    <SystemButtons />
  );
