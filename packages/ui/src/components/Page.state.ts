import { useContext, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";

import type { PageProps } from "./Page";

import { LayoutHeaderContext } from "./LayoutHeaderContext";

export const usePageState = ({ back = false, header, ...props }: PageProps) => {
  const navigate = useNavigate();
  const setPageHeader = useContext(LayoutHeaderContext);
  const goBack = async () => navigate(-1);

  useLayoutEffect(() => {
    if (header === undefined || setPageHeader === undefined) {
      return undefined;
    }
    setPageHeader(header);

    return () => setPageHeader(undefined);
  }, [header, setPageHeader]);

  return { ...props, back, goBack };
};
