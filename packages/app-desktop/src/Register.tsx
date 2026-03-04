import { RegisterForm, t } from "@snappy/app";
import { Panel } from "@snappy/ui";

export const Register = () => (
  <Panel title={t(`registerPage.title`)}>
    <RegisterForm />
  </Panel>
);
