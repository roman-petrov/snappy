import { i } from "@snappy/intl";
import { Button, type ButtonProps } from "@snappy/ui";

import { t } from "../core";

export type SubscribeButtonProps = Omit<ButtonProps, `icon` | `text` | `type`> & {
  loading?: boolean;
  premiumPrice: number;
  text?: string;
};

export const SubscribeButton = ({
  disabled = false,
  loading = false,
  premiumPrice,
  text,
  ...rest
}: SubscribeButtonProps) => (
  <Button
    {...rest}
    disabled={disabled || loading}
    icon={{ emoji: loading ? `⋯` : `💎` }}
    text={text ?? t(`subscribeButton`, { premiumPrice: i.price(premiumPrice) })}
  />
);
