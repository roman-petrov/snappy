import { $loggedIn } from "../Store";

export const useProtectState = () => ({ isLoggedIn: $loggedIn.value });
