import { createBrowserRouter, Navigate } from "react-router-dom";

import { Layout } from "./Layout";
import {
  Chat,
  Dashboard,
  ForgotPassword,
  Login,
  Register,
  ResetPassword,
  Settings,
  SettingsLanguage,
  SettingsOllamaRelay,
  SettingsSubscription,
  SettingsTheme,
} from "./pages";

export const Router = (basename: string) =>
  createBrowserRouter(
    [
      {
        children: [
          { element: <Dashboard />, index: true },
          { element: <Navigate replace to="../preset/free" />, path: `chat` },
          { element: <Chat />, path: `preset/:presetId` },
          { element: <Login />, path: `login` },
          { element: <Register />, path: `register` },
          { element: <ForgotPassword />, path: `forgot-password` },
          { element: <ResetPassword />, path: `reset-password` },
          { element: <Settings />, path: `settings` },
          { element: <SettingsTheme />, path: `settings/theme` },
          { element: <SettingsLanguage />, path: `settings/language` },
          { element: <SettingsOllamaRelay />, path: `settings/ollama-relay` },
          { element: <SettingsSubscription />, path: `settings/subscription` },
          { element: <Navigate replace to="/" />, path: `*` },
        ],
        element: <Layout />,
        path: `/`,
      },
    ],
    { basename },
  );
