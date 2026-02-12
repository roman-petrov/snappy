import styles from "./WhoItem.module.css";

interface Props { description: string; icon: string; title: string; }

export const WhoItem = ({ description, icon, title }: Props) => (
  <div className={styles[`item`]}>
    <span className={styles[`icon`]}>{icon}</span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
