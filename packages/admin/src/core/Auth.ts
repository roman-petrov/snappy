/* eslint-disable functional/no-try-statements */
import { HttpStatus } from "@snappy/core";

const signInUrl = `/api/admin/auth/login`;
const signOutUrl = `/api/admin/auth/logout`;
const sessionUrl = `/api/admin/auth/session`;

const signIn = async (username: string, password: string) => {
  try {
    const response = await fetch(signInUrl, {
      body: JSON.stringify({ password, username }),
      credentials: `include`,
      headers: { "Content-Type": `application/json` },
      method: `POST`,
    });

    return response.status === HttpStatus.ok ? { status: `ok` as const } : { status: `invalidCredentials` as const };
  } catch {
    return { status: `unknownError` as const };
  }
};

const signOut = async () => fetch(signOutUrl, { credentials: `include`, method: `POST` });

const signedIn = async () => {
  try {
    const response = await fetch(sessionUrl, { credentials: `include` });

    return response.status === HttpStatus.ok;
  } catch {
    return false;
  }
};

export const Auth = { signedIn, signIn, signOut };
