import { ArrowLeft } from "lucide-react";

import type { usePageHeaderState } from "./PageHeader.state";

import { t } from "../locales";
import { Header } from "./Header";
import { IconButton } from "./IconButton";
import styles from "./PageHeader.module.scss";
import { Title } from "./Title";

export type PageHeaderViewProps = ReturnType<typeof usePageHeaderState>;

export const PageHeaderView = ({ back, backAction, title }: PageHeaderViewProps) => (
  <Header cn={styles.root}>
    {back ? <IconButton icon={ArrowLeft} onClick={backAction} tip={t(`page.back`)} /> : undefined}
    {title === undefined ? undefined : <Title level={2} title={title} />}
  </Header>
);
