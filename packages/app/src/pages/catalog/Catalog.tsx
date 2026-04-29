import { useCatalogState } from "./Catalog.state";
import { CatalogView } from "./Catalog.view";

export const Catalog = () => <CatalogView {...useCatalogState()} />;
