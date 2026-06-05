import { useContext, useLayoutEffect } from "react";

import type { CustomHeaderPageProps } from "./CustomHeaderPage";

import { LayoutHeaderContext } from "./LayoutHeaderContext";

export const useCustomHeaderPageState = ({ header, ...props }: CustomHeaderPageProps) => {
  const setPageHeader = useContext(LayoutHeaderContext);

  useLayoutEffect(() => {
    if (header === undefined || setPageHeader === undefined) {
      return undefined;
    }
    setPageHeader(header);

    return () => setPageHeader(undefined);
  }, [header, setPageHeader]);

  return props;
};
