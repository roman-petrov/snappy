import { createContext, type ReactNode } from "react";

export type LayoutHeaderSet = (header: ReactNode | undefined) => void;

export const LayoutHeaderContext = createContext<LayoutHeaderSet | undefined>(undefined);
