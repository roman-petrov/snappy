import { useStoreValue } from "@snappy/store";

import { r } from "../data";

export const useHeaderContentState = () => {
  const signedIn = useStoreValue(r.auth);
  const signOut = async () => r.auth.signOut();

  return { signedIn, signOut };
};
