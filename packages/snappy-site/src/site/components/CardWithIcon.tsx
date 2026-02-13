import styles from "./CardWithIcon.module.css";

export type CardWithIconProps = { description: string; icon: string; title: string; variant: `feature` | `who` };

const variantStyles: { feature: { icon: string; wrapper: string }; who: { icon: string; wrapper: string } } = {
  feature: { icon: styles.featureIcon, wrapper: styles.feature },
  who: { icon: styles.whoIcon, wrapper: styles.who },
};

export const CardWithIcon = ({ description, icon, title, variant }: CardWithIconProps) => {
  const s = variantStyles[variant];

  return (
    <div className={s.wrapper}>
      <span className={s.icon}>{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};
