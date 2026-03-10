import { Button, Title } from "@snappy/ui";

import { FormActions } from "./FormErrorAndActions";

export type MessageWithLinkProps = { lead?: string; linkText: string; linkTo: string; title: string };

export const MessageWithLink = ({ lead, linkText, linkTo, title }: MessageWithLinkProps) => (
  <>
    <Title as="h1" lead={lead} level={2} title={title} />
    <FormActions>
      <Button text={linkText} to={linkTo} type="link" />
    </FormActions>
  </>
);
