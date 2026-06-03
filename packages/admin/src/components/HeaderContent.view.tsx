import { IconButton, SystemButtons } from "@snappy/ui";
import { LogOut } from "lucide-react";

import type { useHeaderContentState } from "./HeaderContent.state";

import { t } from "../core";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ signedIn, signOut }: HeaderContentViewProps) => (
  <>
    <SystemButtons />
    {signedIn ? <IconButton icon={LogOut} onClick={signOut} tip={t(`layout.signOutTip`)} /> : undefined}
  </>
);
