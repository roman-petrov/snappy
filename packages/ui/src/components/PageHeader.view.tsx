import { ArrowLeft } from "lucide-react";

import type { usePageHeaderState } from "./PageHeader.state";

import { t } from "../locales";
import { IconButton } from "./IconButton";
import styles from "./PageHeader.module.scss";
import { SafeArea } from "./SafeArea";
import { Title } from "./Title";

export type PageHeaderViewProps = ReturnType<typeof usePageHeaderState>;

export const PageHeaderView = ({ back, backAction, title }: PageHeaderViewProps) => (
  <SafeArea top>
    <div className={styles.inner}>
      {back ? <IconButton icon={ArrowLeft} onClick={backAction} tip={t(`page.back`)} /> : undefined}
      {title === undefined ? undefined : <Title level={1} title={title} />}
    </div>
  </SafeArea>
);
