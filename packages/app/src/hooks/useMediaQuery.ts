import { Dom } from "@snappy/browser";
import { useSignalState } from "@snappy/ui";
import { useEffect } from "preact/hooks";

const mobileBreakpoint = 768;

export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useSignalState(
    typeof window === `undefined` ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);

    setMatches(media.matches);

    return Dom.subscribe(media, `change`, event => setMatches(event.matches));
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps -- setMatches is stable

  return matches;
};

export const useIsMobile = () => useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);
