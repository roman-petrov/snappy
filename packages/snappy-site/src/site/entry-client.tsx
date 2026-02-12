import { hydrateRoot } from "react-dom/client";

import { Theme } from "../core/Theme.js";
import { Landing } from "./components/Landing.js";

Theme.restore();

const root = document.querySelector(`#root`);
if (root !== null) {
  hydrateRoot(root, <Landing />);
}
