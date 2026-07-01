import { $data } from "../data";

export const useBalanceTapState = () => ({ balance: $data.balance().balance });
