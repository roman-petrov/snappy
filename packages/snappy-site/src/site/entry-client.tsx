import "../../styles.css";
import { hydrateRoot } from "react-dom/client";

import { LocaleProvider } from "../shared/LocaleContext";
import { Fog } from "../Fog.js";
import { Theme } from "../Theme.js";
import { Landing } from "./Landing.js";

Theme.restore();

const fogRef = { current: undefined as Fog | undefined };

const syncFog = (): void => {
  if (fogRef.current !== undefined) {
    fogRef.current.stop();
    fogRef.current = undefined;
  }
  if (document.documentElement.dataset[`theme`] === `light`) {
    return;
  }
  const element = document.querySelector(`#fog-bg`);
  if (element === null || !(element instanceof HTMLElement)) {
    return;
  }
  fogRef.current = Fog(element, { blurFactor: 0.5, speed: 2, zoom: 2 });
  fogRef.current.start();
};

const root = document.querySelector(`#root`);
if (root !== null) {
  hydrateRoot(
    root,
    <LocaleProvider>
      <Landing onThemeToggle={() => requestAnimationFrame(syncFog)} />
    </LocaleProvider>,
  );
}

syncFog();
