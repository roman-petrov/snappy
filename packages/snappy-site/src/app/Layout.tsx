import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { Header } from "../shared/Header";
import { LocaleSwitcher } from "../shared/LocaleSwitcher";
import { MutedLink } from "../shared/MutedLink";
import { Theme } from "../Theme";
import { clearToken, getToken } from "./Auth";
import styles from "./Layout.module.css";
import { t } from "./Locale";

export const Layout = () => {
  const token = getToken();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = token !== undefined;

  return (
    <div className={styles[`wrap`]}>
      <Header
        logoOnClick={e => {
          e.preventDefault();
          Theme.toggle();
        }}
        logoTitle={t(`themeToggle`)}
        logoTo="/"
      >
        {isAuth ? (
          <Button
            onClick={() => {
              clearToken();
              navigate(`/login`, { replace: true, viewTransition: true });
            }}
            type="button"
          >
            {t(`logout`)}
          </Button>
        ) : (
          <>
            {location.pathname !== `/login` && <MutedLink to="/login">{t(`login`)}</MutedLink>}
            {location.pathname !== `/register` && <MutedLink to="/register">{t(`register`)}</MutedLink>}
          </>
        )}
        <LocaleSwitcher />
      </Header>
      <main className={styles[`main`]}>
        <Outlet />
      </main>
    </div>
  );
};
