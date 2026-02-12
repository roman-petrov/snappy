import "../../styles.css";
import { hydrateRoot } from "react-dom/client";
import { Fog } from "../Fog.js";
import { Landing } from "./Landing.js";

const applyTheme = (theme: string) => {
  document.documentElement.dataset[`theme`] = theme;
};

applyTheme(`light`);

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

const root = document.getElementById(`root`);
if (root !== null) {
  hydrateRoot(root, <Landing />);
}

document.querySelector(`.logo`)?.addEventListener(`click`, clickEvent => {
  clickEvent.preventDefault();
  const next = document.documentElement.dataset[`theme`] === `dark` ? `light` : `dark`;
  applyTheme(next);
  requestAnimationFrame(syncFog);
});

syncFog();
