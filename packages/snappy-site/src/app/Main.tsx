import { createRoot } from "react-dom/client";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";

import "./styles.css";
import { Theme } from "../core/Theme";
import { getToken } from "./Auth";
import { Dashboard } from "./components/Dashboard";
import { ForgotPassword } from "./components/ForgotPassword";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";

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
          <Route element={getToken() === undefined ? <Navigate replace to="/login" /> : <Dashboard />} index />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Route>,
      ),
      { basename: `/app` },
    )}
  />,
);
