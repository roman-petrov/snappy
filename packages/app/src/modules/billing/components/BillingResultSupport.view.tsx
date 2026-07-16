import { Email } from "@snappy/core";
import { Button, FilledIcon, StatusPage } from "@snappy/ui";
import { Copy, Home, Mail, RefreshCw } from "lucide-react";

import type { useBillingResultSupportState } from "./BillingResultSupport.state";

import { t } from "../../../core";

export type BillingResultSupportViewProps = ReturnType<typeof useBillingResultSupportState>;

export const BillingResultSupportView = ({
  copyDetails,
  details,
  home,
  icon,
  iconColor,
  kind,
  paymentId,
  retry,
  start,
  supportEmail,
}: BillingResultSupportViewProps) => (
  <StatusPage
    icon={<FilledIcon color={iconColor} icon={icon} size="xxxl" />}
    lead={t(`billing.result.${kind}.lead`)}
    title={t(`billing.result.${kind}.title`)}
  >
    {kind === `canceled` ? (
      <>
        <Button onClick={retry} text={t(`billing.result.retry`)} type="primary" />
        <Button icon={Home} onClick={home} text={t(`billing.result.home`)} />
      </>
    ) : (
      <>
        <Button icon={RefreshCw} onClick={start} text={t(`billing.result.refresh`)} type="primary" />
        <Button icon={Copy} onClick={copyDetails} text={t(`billing.result.copy`)} />
        <Button
          icon={Mail}
          link={{
            href: Email.mailto(supportEmail, {
              body: t(`billing.result.${kind}.mail.body`, { details }),
              subject: t(`billing.result.${kind}.mail.subject`, { paymentId }),
            }),
          }}
          text={t(`billing.result.support`)}
        />
        <Button icon={Home} onClick={home} text={t(`billing.result.home`)} />
      </>
    )}
  </StatusPage>
);
