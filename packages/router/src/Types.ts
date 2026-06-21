export type Go = (to: number | string, options?: GoOptions) => Promise<void>;

export type GoOptions = { instant?: boolean; replace?: boolean };

export type Page = (props?: PageProps) => unknown;

export type PageProps = Record<string, string>;

export type RedirectTarget = { redirectTo: string };

export type RouterContextValue = { go: Go; href: (path: string) => string; path: string; query: URLSearchParams };

export type RouterPageState = { page: Page; params: PageProps };
