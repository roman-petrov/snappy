import { AppConfig } from "../../../AppConfig";
import { t } from "../../../core";

export const authError = (error: string | undefined, errorsKey: string, cooldownSec: number) =>
  error === undefined
    ? ``
    : error === `tooManyRequests`
      ? t(`auth.errors.tooManyRequests`, { seconds: cooldownSec > 0 ? cooldownSec : AppConfig.authEmailCooldownSec })
      : t(`${errorsKey}.${error}`);
