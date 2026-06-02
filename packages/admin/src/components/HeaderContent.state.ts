import { useStoreValue } from "@snappy/store";

import { Auth } from "../core";
import { $signedIn } from "../Store";

export const useHeaderContentState = () => {
  const signedIn = useStoreValue($signedIn);

  const signOut = async () => {
    await Auth.signOut();
    $signedIn.set(false);
  };

  return { signedIn, signOut };
};
