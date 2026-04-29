import { useEffect, useState } from "react";

import type { StreamingTextProps } from "./StreamingText";

export const useStreamingTextState = ({ color, stream, typography }: StreamingTextProps) => {
  const [parts, setParts] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(true);

  useEffect(() => {
    let alive = true;

    setParts([]);
    setStreaming(true);

    const run = async () => {
      try {
        for await (const text of stream) {
          if (!alive || text === ``) {
            continue;
          }
          setParts(previous => [...previous, text]);
        }
      } finally {
        if (alive) {
          setStreaming(false);
        }
      }
    };

    void run();

    return () => {
      alive = false;
    };
  }, [stream]);

  return { color, parts, streaming, typography };
};
