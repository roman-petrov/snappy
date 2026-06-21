import { MediaQuery, ThemeVar } from "@snappy/browser";
import { _ } from "@snappy/core";

const query = () => `(max-width: ${_.px(ThemeVar.mobileBreakpoint())})`;
const mobile = () => MediaQuery.matches(query());

export const Viewport = { mobile, query };
