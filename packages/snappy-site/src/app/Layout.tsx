import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { LocaleSwitcher } from "../shared/LocaleSwitcher";
import { useLocale } from "../shared/LocaleContext";
import { Theme } from "../Theme";
import { clearToken, getToken } from "./Auth";
import { t } from "./Locale";
import styles from "./Layout.module.css";

const APP_BASE = `/app`;

export const Layout = () => {
  const { locale } = useLocale();
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
            to={APP_BASE}
            title={t(locale, `themeToggle`)}
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
                {t(locale, `logout`)}
              </Button>
            ) : (
              <>
                {location.pathname !== `${APP_BASE}/login` && (
                  <Link className={styles[`navLink`]} to={`${APP_BASE}/login`}>
                    {t(locale, `login`)}
                  </Link>
                )}
                {location.pathname !== `${APP_BASE}/register` && (
                  <Link className={styles[`navLink`]} to={`${APP_BASE}/register`}>
                    {t(locale, `register`)}
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
