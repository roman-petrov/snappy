import { useNavigate } from "react-router-dom";

import type { PageProps } from "./Page";

export const usePageState = ({ back = false, ...props }: PageProps) => {
  const navigate = useNavigate();
  const goBack = async () => navigate(-1);

  return { ...props, back, goBack };
};
