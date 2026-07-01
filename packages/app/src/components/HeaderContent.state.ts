import { $data } from "../data";

export const useHeaderContentState = () => ({ signedIn: $data.auth.use() });
