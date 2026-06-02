import { IconButton, SystemButtons } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

import { t } from "../core";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ signedIn, signOut }: HeaderContentViewProps) => (
  <>
    <SystemButtons />
    {signedIn ? <IconButton icon="logout" onClick={signOut} tip={t(`layout.signOutTip`)} /> : undefined}
  </>
);
