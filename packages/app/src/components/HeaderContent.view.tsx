import { HeaderButtonGroup, IconButton, IconButtonTheme, SystemButtons } from "@snappy/ui";
import { Settings } from "lucide-react";

import type { useHeaderContentState } from "./HeaderContent.state";

import { t } from "../core";
import { Routes } from "../Routes";
import { BalanceTap } from "./BalanceTap";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ signedIn }: HeaderContentViewProps) =>
  signedIn ? (
    <HeaderButtonGroup>
      <IconButtonTheme />
      <IconButton icon={Settings} link={Routes.settings.root} tip={t(`settings.title`)} vibrate="none" />
      <BalanceTap />
    </HeaderButtonGroup>
  ) : (
    <SystemButtons />
  );
