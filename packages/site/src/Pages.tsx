import type { LegalVariant } from "@snappy/legal";

import { Landing, LegalPage } from "./components";

export type SitePath = `/` | `/privacy` | `/terms`;

const legalVariant: Record<Exclude<SitePath, `/`>, LegalVariant> = { "/privacy": `privacy`, "/terms": `terms` };
const view = (path: SitePath) => (path === `/` ? <Landing /> : <LegalPage variant={legalVariant[path]} />);

export const Pages = { paths: [`/`, `/privacy`, `/terms`] as const satisfies readonly SitePath[], view };
