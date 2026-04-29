import { useFeedState } from "./Feed.state";
import { FeedView } from "./Feed.view";

export const Feed = () => <FeedView {...useFeedState()} />;
