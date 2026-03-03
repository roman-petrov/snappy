import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from "react-router-dom";

import { Dashboard } from "./Dashboard";
import { ForgotPassword } from "./ForgotPassword";
import { Layout } from "./Layout";
import { Login } from "./Login";
import { Register } from "./Register";
import { ResetPassword } from "./ResetPassword";

/* jscpd:ignore-start */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />} path="/">
      <Route element={<Login />} path="login" />
      <Route element={<Register />} path="register" />
      <Route element={<ForgotPassword />} path="forgot-password" />
      <Route element={<ResetPassword />} path="reset-password" />
      <Route element={<Dashboard />} index />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Route>,
  ),
  { basename: `/app` },
);

export const DesktopApp = () => <RouterProvider router={router} />;
/* jscpd:ignore-end */
