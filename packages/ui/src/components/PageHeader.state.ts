import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import type { PageHeaderProps } from "./PageHeader";

export const usePageHeaderState = ({ back = false, ...props }: PageHeaderProps) => {
  const navigate = useNavigate();
  const backAction = useCallback(async () => navigate(-1), [navigate]);

  return { ...props, back, backAction };
};
