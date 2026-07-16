import { useAppExternalReturnState } from "./AppExternalReturn.state";
import { AppExternalReturnView } from "./AppExternalReturn.view";

export const AppExternalReturn = () => <AppExternalReturnView {...useAppExternalReturnState()} />;
