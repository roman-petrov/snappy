import { useMediaQuery } from "./useMediaQuery";

export const useHasTouchInput = () => useMediaQuery(`(hover: none), (pointer: coarse)`);
