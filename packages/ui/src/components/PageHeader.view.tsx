import { ArrowLeft } from "lucide-react";

import type { usePageHeaderState } from "./PageHeader.state";

import { t } from "../locales";
import { IconButton } from "./IconButton";
import styles from "./PageHeader.module.scss";
import { Title } from "./Title";

export type PageHeaderViewProps = ReturnType<typeof usePageHeaderState>;

export const PageHeaderView = ({ back, backAction, title, trailing }: PageHeaderViewProps) => (
  <div className={styles.root}>
    {back ? (
      <div className={styles.leading}>
        <IconButton icon={ArrowLeft} onClick={backAction} tip={t(`page.back`)} />
      </div>
    ) : undefined}
    {title === undefined ? undefined : (
      <div className={styles.title}>{typeof title === `string` ? <Title level={2} title={title} /> : title}</div>
    )}
    {trailing === undefined ? undefined : <div className={styles.trailing}>{trailing}</div>}
  </div>
);
