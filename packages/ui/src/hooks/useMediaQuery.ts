import { MediaQuery } from "@snappy/browser";
import { useEffect, useState } from "react";

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(MediaQuery.matches(query));

  useEffect(() => MediaQuery.subscribe(query, setMatches), [query]);

  return matches;
};
