import { Tap, type TapLinkExternal, Text } from "@snappy/ui";

import styles from "./SiteHeaderMenuLink.module.scss";

export type SiteHeaderMenuLinkProps = { link: TapLinkExternal; text: string };

export const SiteHeaderMenuLink = ({ link, text }: SiteHeaderMenuLinkProps) => (
  <Tap cn={styles.root} link={link}>
    <Text color="primary" text={text} typography="caption" />
  </Tap>
);
