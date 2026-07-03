import { Checkbox, Link } from "@snappy/ui";

import { t } from "../../../core";
import { Routes } from "../../../Routes";
import styles from "./SignUpConsent.module.scss";

export type SignUpConsentProps = { checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void };

export const SignUpConsent = ({ checked, disabled, onChange }: SignUpConsentProps) => (
  <Checkbox checked={checked} cn={styles.root} disabled={disabled} onChange={onChange}>
    {t(`auth.signUp.consent.prefix`)}
    {` `}
    <Link link={Routes.legal.terms} text={t(`auth.signUp.consent.terms`)} /> {t(`auth.signUp.consent.and`)}
    {` `}
    <Link link={Routes.legal.privacy} text={t(`auth.signUp.consent.privacy`)} />
  </Checkbox>
);
