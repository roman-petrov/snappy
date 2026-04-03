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
  SettingsModelsChat,
  SettingsModelsImage,
  SettingsModelsSpeech,
  SettingsTheme,
} from "./pages";
import { BalanceLow, TopUp } from "./pages/balance";
import { Routes } from "./Routes";

export const Router = (basename: string) =>
  createBrowserRouter(
    [
      {
        children: [
          { element: <Dashboard />, index: true },
          { element: <Navigate replace to={Routes.home} />, path: Routes.segment.chat },
          { element: <Chat />, path: Routes.segment.agent },
          { element: <BalanceLow />, path: Routes.segment.balance.low },
          { element: <TopUp />, path: Routes.segment.balance.topUp },
          { element: <Login />, path: Routes.segment.login },
          { element: <Register />, path: Routes.segment.register },
          { element: <ForgotPassword />, path: Routes.segment.forgotPassword },
          { element: <ResetPassword />, path: Routes.segment.resetPassword },
          { element: <Settings />, path: Routes.segment.settings.root },
          { element: <SettingsTheme />, path: Routes.segment.settings.theme },
          { element: <SettingsLanguage />, path: Routes.segment.settings.language },
          { element: <SettingsModelsChat />, path: Routes.segment.settings.models.chat },
          { element: <SettingsModelsImage />, path: Routes.segment.settings.models.image },
          { element: <SettingsModelsSpeech />, path: Routes.segment.settings.models.speech },
          { element: <Navigate replace to={Routes.home} />, path: Routes.segment.wildcard },
        ],
        element: <Layout />,
        path: Routes.home,
      },
    ],
    { basename },
  );
