const interval = (fn: () => void, ms: number) => {
  const id = setInterval(fn, ms);

  return () => clearInterval(id);
};

const timeout = (fn: () => void, ms: number) => {
  const id = setTimeout(fn, ms);

  return () => clearTimeout(id);
};

export const Timer = { interval, timeout };
