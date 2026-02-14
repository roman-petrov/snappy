import styles from "./CardWithIcon.module.css";

export type CardWithIconProps = { description: string; icon: string; title: string; variant: `feature` | `who` };

export const CardWithIcon = ({ description, icon, title, variant }: CardWithIconProps) => {
  const variantStyles: { feature: { icon: string; wrapper: string }; who: { icon: string; wrapper: string } } = {
    feature: { icon: styles.featureIcon, wrapper: styles.feature },
    who: { icon: styles.whoIcon, wrapper: styles.who },
  };

  return (
    <div className={variantStyles[variant].wrapper}>
      <span className={variantStyles[variant].icon}>{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
