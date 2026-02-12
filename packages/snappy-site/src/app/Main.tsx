import type { ReactNode } from "react";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import "./styles.css";
import { Theme } from "../Theme";
import { getToken } from "./Auth";
import { Dashboard } from "./Dashboard";
import { ForgotPassword } from "./ForgotPassword";
import { Layout } from "./Layout";
import { Login } from "./Login";
import { Register } from "./Register";
import { ResetPassword } from "./ResetPassword";

const Protected = ({ children }: { children: ReactNode }) =>
  getToken() === undefined ? <Navigate replace to="/login" /> : <>{children}</>;

Theme.restore();

createRoot(document.querySelector(`#app-root`)!).render(
  <BrowserRouter basename="/app">
    <Routes>
      <Route element={<Layout />} path="/">
        <Route element={<Login />} path="login" />
        <Route element={<Register />} path="register" />
        <Route element={<ForgotPassword />} path="forgot-password" />
        <Route element={<ResetPassword />} path="reset-password" />
        <Route
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
          index
        />
      </Route>
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  </BrowserRouter>,
);
