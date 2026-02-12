import { createRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";

import "./styles.css";
import { Theme } from "../Theme";
import { getToken } from "./Auth";
import { Dashboard } from "./Dashboard";
import { ForgotPassword } from "./ForgotPassword";
import { Layout } from "./Layout";
import { Login } from "./Login";
import { Register } from "./Register";
import { ResetPassword } from "./ResetPassword";

Theme.restore();

createRoot(document.querySelector(`#app-root`)!).render(
  <RouterProvider
    router={createBrowserRouter(
      createRoutesFromElements(
        <Route element={<Layout />} path="/">
          <Route element={<Login />} path="login" />
          <Route element={<Register />} path="register" />
          <Route element={<ForgotPassword />} path="forgot-password" />
          <Route element={<ResetPassword />} path="reset-password" />
          <Route
            element={
              getToken() === undefined ? <Navigate replace to="/login" /> : <Dashboard />
            }
            index
          />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Route>,
      ),
      { basename: `/app` },
    )}
  />,
);
