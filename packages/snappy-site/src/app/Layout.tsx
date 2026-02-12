import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../shared/Button";
import { Theme } from "../Theme";
import { clearToken, getToken } from "./Auth";
import styles from "./Layout.module.css";

const APP_BASE = `/app`;

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
            to={APP_BASE}
            title="Переключить тему"
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
                Выйти
              </Button>
            ) : (
              <>
                {location.pathname !== `${APP_BASE}/login` && (
                  <Link className={styles[`navLink`]} to={`${APP_BASE}/login`}>
                    Вход
                  </Link>
                )}
                {location.pathname !== `${APP_BASE}/register` && (
                  <Link className={styles[`navLink`]} to={`${APP_BASE}/register`}>
                    Регистрация
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>
      </header>
      <main className={styles[`main`]}>
        <Outlet />
      </main>
    </div>
  );
};
