/* eslint-disable react/no-danger */
import { cx, css, cva } from "../../styled-system/css";
import { Icons } from "../assets";

export type Icon = keyof typeof Icons;

export type IconVariantProps = { size?: "default" | "button" };

export type IconProps = IconVariantProps & { cn?: string; name: Icon };

export const Icon = ({ cn = "", name, size = "default" }: IconProps) => (
  <span
    aria-hidden
    className={cx(
      css({
        "& svg": { display: "block", height: "full", overflow: "visible", width: "full" },
        alignItems: "center",
        color: "inherit",
        display: "inline-flex",
        flexShrink: 0,
        height: "em",
        justifyContent: "center",
        minHeight: "em",
        minWidth: "em",
        overflow: "visible",
        verticalAlign: "middle",
        width: "em",
      }),
      cva({
        base: {},
        variants: {
          size: {
            button: { height: "emButton", minHeight: "emButton", minWidth: "emButton", width: "emButton" },
            default: {},
          },
        },
      })({ size }),
      cn,
    )}
    dangerouslySetInnerHTML={{ __html: Icons[name] }}
  />
);
