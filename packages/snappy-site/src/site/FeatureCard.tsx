import styles from "./FeatureCard.module.css";

interface Props { description: string; icon: string; title: string; }

export const FeatureCard = ({ description, icon, title }: Props) => (
  <div className={styles[`card`]}>
    <span className={styles[`cardIcon`]}>{icon}</span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
