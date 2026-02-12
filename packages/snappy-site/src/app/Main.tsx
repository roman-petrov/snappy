import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { LocaleProvider } from "../shared/LocaleContext";
import { Theme } from "../Theme";
import { getToken } from "./Auth";
import { Dashboard } from "./Dashboard";
import { ForgotPassword } from "./ForgotPassword";
import { Layout } from "./Layout";
import { Login } from "./Login";
import { Register } from "./Register";
import { ResetPassword } from "./ResetPassword";

const Protected = ({ children }: { children: ReactNode }) =>
  getToken() !== undefined ? <>{children}</> : <Navigate to="/login" replace />;

Theme.restore();

createRoot(document.getElementById(`app-root`)!).render(
  <LocaleProvider>
    <BrowserRouter basename="/app">
      <Routes>
        <Route element={<Layout />} path="/">
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route
            index
            element={
              <Protected>
                <Dashboard />
              </Protected>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </LocaleProvider>,
);
