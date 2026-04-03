import { FeedCard } from "./FeedCard";
import styles from "./ImageCard.module.scss";

export type ImageCardProps = { src: string };

export const ImageCard = ({ src }: ImageCardProps) => (
  <FeedCard>
    <img alt="" className={styles.image} src={src} />
  </FeedCard>
);
