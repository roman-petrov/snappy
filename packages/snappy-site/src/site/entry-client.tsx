import { ensureFogContainer, Theme } from "@snappy/ui";
import { hydrateRoot } from "react-dom/client";

import { Landing } from "./components/Landing.js";

ensureFogContainer();
Theme.restore();

const root = document.querySelector(`#root`);
if (root !== null) {
  hydrateRoot(root, <Landing />);
}
