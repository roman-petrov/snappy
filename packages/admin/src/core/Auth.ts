import { trpc } from "./Api";

const signIn = async (username: string, password: string) => trpc.auth.signIn.mutate({ password, username });
const signOut = async () => trpc.auth.signOut.mutate();
const signedIn = async () => (await trpc.auth.session.query()).ok;

export const Auth = { signedIn, signIn, signOut };
