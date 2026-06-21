import { useEffect, useState } from "react";

export const useObjectUrl = (file: File) => {
  const [url, setUrl] = useState(``);

  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  return url;
};
