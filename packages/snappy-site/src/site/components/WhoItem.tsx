import styles from "./WhoItem.module.css";

export type WhoItemProps = { description: string; icon: string; title: string };

export const WhoItem = ({ description, icon, title }: WhoItemProps) => (
  <div className={styles.item}>
    <span className={styles.icon}>{icon}</span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
