import styles from "./StageFade.module.scss";

export type StageFadeProps = { minHeight: string };

export const StageFade = ({ minHeight }: StageFadeProps) => <div className={styles.fade} style={{ minHeight }} />;
