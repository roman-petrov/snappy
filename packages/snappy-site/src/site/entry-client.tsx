import { hydrateRoot } from "react-dom/client";

import { Theme } from "../Theme.js";
import { Landing } from "./Landing.js";

Theme.restore();

const root = document.querySelector(`#root`);
if (root !== null) {
  hydrateRoot(root, <Landing />);
}
