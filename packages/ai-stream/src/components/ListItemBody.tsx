import type { ReactNode } from "react";

export type ListItemBodyProps = { children: ReactNode };

export const ListItemBody = ({ children }: ListItemBodyProps) => <span children={children} />;
