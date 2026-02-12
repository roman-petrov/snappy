import { Link, Outlet, useLocation } from "react-router-dom";

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
          <Link className={styles[`logo`]} to="/">
            Snappy
          </Link>
          <nav className={styles[`nav`]}>
            {isAuth ? (
              <button
                onClick={() => {
                  clearToken();
                  window.location.href = `/login`;
                }}
                type="button"
              >
                Выйти
              </button>
            ) : (
              <>
                {location.pathname !== `/login` && <Link to="/login">Вход</Link>}
                {location.pathname !== `/register` && <Link to="/register">Регистрация</Link>}
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
