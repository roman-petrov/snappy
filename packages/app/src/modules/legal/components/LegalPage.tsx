import type { LegalVariant } from "@snappy/legal";

import { useLegalPageState } from "./LegalPage.state";
import { LegalPageView } from "./LegalPage.view";

export type LegalPageProps = { variant: LegalVariant };

export const LegalPage = ({ variant }: LegalPageProps) => <LegalPageView {...useLegalPageState(variant)} />;
