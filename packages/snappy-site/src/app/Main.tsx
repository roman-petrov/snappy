/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-expression-statements */

import { startApp } from "@snappy/ui";
import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";

import { ForgotPassword } from "./components/ForgotPassword";
import { Layout } from "./components/Layout";
import { Login } from "./components/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Register } from "./components/Register";
import { ResetPassword } from "./components/ResetPassword";
import { api } from "./core";
import { $loggedIn } from "./Store";

try {
  await api.checkAuth();
  $loggedIn.set(true);
} catch {
  $loggedIn.set(false);
}

const root = document.querySelector(`#app-root`);
if (root instanceof HTMLElement) {
  startApp(
    root,
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <Route element={<Layout />} path="/">
            <Route element={<Login />} path="login" />
            <Route element={<Register />} path="register" />
            <Route element={<ForgotPassword />} path="forgot-password" />
            <Route element={<ResetPassword />} path="reset-password" />
            <Route element={<ProtectedRoute />} index />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Route>,
        ),
        { basename: `/app` },
      )}
    />,
  );
}
