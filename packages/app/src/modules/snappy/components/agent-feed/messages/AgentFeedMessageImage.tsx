import { ImageCard, type ImageCardProps } from "../../../../../components";
import styles from "./AgentFeedMessageImage.module.scss";

export type AgentFeedMessageImageProps = ImageCardProps;

export const AgentFeedMessageImage = (props: AgentFeedMessageImageProps) => (
  <div className={styles.root}>
    <ImageCard {...props} />
  </div>
);
