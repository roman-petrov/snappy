import type { ButtonProps } from "./Button";

export const useButtonState = ({
  cn = ``,
  disabled = false,
  href = ``,
  icon,
  large = false,
  onClick,
  submit = false,
  text,
  to = ``,
  type = `default`,
}: ButtonProps) => {
  const hasTo = to !== ``;
  const hasHref = href !== ``;

  return { cn, disabled, hasHref, hasTo, href, icon, large, onClick, submit, text, to, type };
};
