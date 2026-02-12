import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { LocaleSwitcher } from "../shared/LocaleSwitcher";
import { Theme } from "../Theme";
import { clearToken, getToken } from "./Auth";
import { t } from "./Locale";
import styles from "./Layout.module.css";

export const Layout = () => {
  const token = getToken();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuth = token !== undefined;

  return (
    <div className={styles[`wrap`]}>
      <header className={styles[`header`]}>
        <div className={styles[`inner`]}>
          <Link
            className={styles[`logo`]}
            to="/"
            title={t(`themeToggle`)}
            onClick={e => {
              e.preventDefault();
              Theme.toggle();
            }}
          >
            <img src="/favicon.svg" alt="" className={styles[`logoIcon`]} aria-hidden="true" />
            Snappy
          </Link>
          <nav className={styles[`nav`]}>
            {isAuth ? (
              <Button
                onClick={() => {
                  clearToken();
                  navigate(`/login`, { replace: true });
                }}
                type="button"
              >
                {t(`logout`)}
              </Button>
            ) : (
              <>
                {location.pathname !== `/login` && (
                  <Link className={styles[`navLink`]} to="/login">
                    {t(`login`)}
                  </Link>
                )}
                {location.pathname !== `/register` && (
                  <Link className={styles[`navLink`]} to="/register">
                    {t(`register`)}
                  </Link>
                )}
              </>
            )}
            <LocaleSwitcher />
          </nav>
        </div>
      </header>
      <main className={styles[`main`]}>
        <Outlet />
      </main>
    </div>
  );
};
