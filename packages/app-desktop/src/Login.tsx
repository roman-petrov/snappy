import { LoginForm, t } from "@snappy/app";
import { Panel } from "@snappy/ui";

export const Login = () => (
  <Panel title={t(`loginPage.title`)}>
    <LoginForm />
  </Panel>
);
