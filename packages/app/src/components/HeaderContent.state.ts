import { useStoreValue } from "@snappy/store";

import { $signedIn } from "../Store";

export const useHeaderContentState = () => ({ signedIn: useStoreValue($signedIn) });
