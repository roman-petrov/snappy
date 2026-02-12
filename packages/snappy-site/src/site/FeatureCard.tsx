import styles from "./FeatureCard.module.css";

type Props = { icon: string; title: string; description: string };

export const FeatureCard = ({ icon, title, description }: Props) => (
  <div className={styles[`card`]}>
    <span className={styles[`cardIcon`]}>{icon}</span>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);
