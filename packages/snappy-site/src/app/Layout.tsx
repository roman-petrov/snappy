import { Link, Outlet, useLocation } from "react-router-dom";

import { Button } from "../shared/Button";
import { Theme } from "../Theme";
import { clearToken, getToken } from "./Auth";
import styles from "./Layout.module.css";

export const Layout = () => {
  const token = getToken();
  const location = useLocation();
  const isAuth = token !== undefined;

  return (
    <div className={styles[`wrap`]}>
      <header className={styles[`header`]}>
        <div className={styles[`inner`]}>
          <Link
            className={styles[`logo`]}
            to="/"
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
                  window.location.href = `/login`;
                }}
                type="button"
              >
                Выйти
              </Button>
            ) : (
              <>
                {location.pathname !== `/login` && (
                  <Link className={styles[`navLink`]} to="/login">
                    Вход
                  </Link>
                )}
                {location.pathname !== `/register` && (
                  <Link className={styles[`navLink`]} to="/register">
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
