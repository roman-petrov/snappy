import { Link, Panel } from "@snappy/ui";

import { FormActions } from "./FormErrorAndActions";

export type PanelWithLinkProps = { lead?: string; linkText: string; linkTo: string; title: string };

export const PanelWithLink = ({ lead, linkText, linkTo, title }: PanelWithLinkProps) => (
  <Panel lead={lead} title={title}>
    <FormActions>
      <Link text={linkText} to={linkTo} />
    </FormActions>
  </Panel>
);
