import { ImageCard, type ImageCardProps } from "../ImageCard";
import styles from "./AgentFeedImageCard.module.scss";

export const AgentFeedImageCard = (props: ImageCardProps) => (
  <div className={styles.root}>
    <ImageCard {...props} />
  </div>
);
