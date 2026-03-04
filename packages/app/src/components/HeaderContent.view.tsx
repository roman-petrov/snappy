/* eslint-disable @typescript-eslint/strict-void-return */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Button, Link, SwitchButtonLocale, SwitchButtonTheme } from "@snappy/ui";

import type { useHeaderContentState } from "./HeaderContent.state";

export type HeaderContentViewProps = ReturnType<typeof useHeaderContentState>;

export const HeaderContentView = ({ headerItems }: HeaderContentViewProps) => (
  <>
    {headerItems.map(item =>
      item.type === `button` ? (
        <Button key="logout" onClick={item.onClick} type="button">
          {item.label}
        </Button>
      ) : item.type === `link` ? (
        <Link key={item.to} muted text={item.label} to={item.to} />
      ) : item.type === `theme` ? (
        <SwitchButtonTheme key="theme" />
      ) : (
        <SwitchButtonLocale key="locale" />
      ),
    )}
  </>
);
