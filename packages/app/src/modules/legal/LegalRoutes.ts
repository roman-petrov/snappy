import { LegalPrivacy, LegalTerms } from "./pages";

export const LegalRoutes = {
  privacy: { page: LegalPrivacy, path: `privacy` },
  terms: { page: LegalTerms, path: `terms` },
} as const;
