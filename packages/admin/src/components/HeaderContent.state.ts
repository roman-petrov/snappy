import { $data } from "../data";

export const useHeaderContentState = () => {
  const signedIn = $data.auth.use();
  const signOut = async () => $data.auth.signOut();

  return { signedIn, signOut };
};
