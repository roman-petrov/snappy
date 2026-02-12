import styles from "./WhoItem.module.css";

type Props = { icon: string; title: string; description: string };

export const WhoItem = ({ icon, title, description }: Props) => (
  <div className={styles[`item`]}>
    <span className={styles[`icon`]}>{icon}</span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
