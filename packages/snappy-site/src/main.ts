import AOS from "aos";
import "aos/dist/aos.css";

const applyTheme = (theme: string): void => {
  document.documentElement.dataset[`theme`] = theme;
};

applyTheme(`light`);

const loadAndInit = (): void => {
  import(`./Vanta`).then(m => {
    m.Vanta.init();
  });
};

if (document.documentElement.dataset[`theme`] === `dark`) {
  loadAndInit();
}

document.querySelector(`.logo`)?.addEventListener(`click`, e => {
  e.preventDefault();
  const next = document.documentElement.dataset[`theme`] === `dark` ? `light` : `dark`;
  applyTheme(next);
  setTimeout(loadAndInit, 0);
});

AOS.init({ duration: 400, easing: `ease-out-cubic`, offset: 60, once: true });
