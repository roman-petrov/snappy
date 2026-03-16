import { createBrowserRouter, Navigate } from "react-router-dom";

import { Dashboard } from "./Dashboard";
import { Layout } from "./Layout";
import { Limit } from "./Limit";
import { ForgotPassword, Login, Register, ResetPassword } from "./pages/auth";
import { Settings, SettingsLanguage, SettingsSubscription, SettingsTheme } from "./pages/settings";

export const Router = (basename: string) =>
  createBrowserRouter(
    [
      {
        children: [
          { element: <Dashboard />, index: true },
          { element: <Login />, path: `login` },
          { element: <Register />, path: `register` },
          { element: <ForgotPassword />, path: `forgot-password` },
          { element: <ResetPassword />, path: `reset-password` },
          { element: <Limit />, path: `limit` },
          { element: <Settings />, path: `settings` },
          { element: <SettingsTheme />, path: `settings/theme` },
          { element: <SettingsLanguage />, path: `settings/language` },
          { element: <SettingsSubscription />, path: `settings/subscription` },
          { element: <Navigate replace to="/" />, path: `*` },
        ],
        element: <Layout />,
        path: `/`,
      },
    ],
    { basename },
  );
