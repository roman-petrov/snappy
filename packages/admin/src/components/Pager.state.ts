export type PagerStateInput = { page: number; pageSize: number; setPage: (page: number) => void; total: number };

export const usePagerState = ({ page, pageSize, setPage, total }: PagerStateInput) => {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const next = () => setPage(page + 1);
  const previous = () => setPage(page - 1);
  const nextDisabled = page >= pageCount;
  const previousDisabled = page <= 1;

  return { next, nextDisabled, page, pageCount, previous, previousDisabled };
};
