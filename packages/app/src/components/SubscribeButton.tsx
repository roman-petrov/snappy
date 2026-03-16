import { i } from "@snappy/intl";

import { t } from "../core";
import { SmallButton, type SmallButtonProps } from "./SmallButton";

export type SubscribeButtonProps = Omit<SmallButtonProps, `full` | `icon` | `text` | `variant`> & {
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
  <SmallButton
    {...rest}
    disabled={disabled || loading}
    full
    icon={loading ? `⋯` : `💎`}
    text={text ?? t(`subscribeButton`, { premiumPrice: i.price(premiumPrice) })}
    variant="neutral"
  />
);
