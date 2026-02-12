import styles from "./FeatureCard.module.css";

export type FeatureCardProps = { description: string; icon: string; title: string };

export const FeatureCard = ({ description, icon, title }: FeatureCardProps) => (
  <div className={styles[`card`]}>
    <span className={styles[`cardIcon`]}>{icon}</span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
