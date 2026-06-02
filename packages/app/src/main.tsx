/* eslint-disable functional/no-expression-statements */
import { startApp } from "@snappy/ui";

import { HeaderContent } from "./components";
import {
  Agent,
  Catalog,
  Feed,
  ForgotPassword,
  ResetPassword,
  Settings,
  SettingsAiTunnel,
  SettingsLanguage,
  SettingsModelsChat,
  SettingsModelsImage,
  SettingsModelsSpeech,
  SettingsTheme,
  SettingsTypeWriterSpeed,
  SignIn,
  SignUp,
  Snappy,
} from "./pages";
import { TopUp } from "./pages/balance";
import { Routes } from "./Routes";
import { $signedIn } from "./Store";

startApp({
  base: `/app`,
  header: <HeaderContent />,
  index: <Catalog />,
  path: Routes.home,
  publicPaths: [Routes.forgotPassword, Routes.resetPassword, Routes.signIn, Routes.signUp],
  routes: {
    [Routes.$.agent]: <Agent />,
    [Routes.$.balance.topUp]: <TopUp />,
    [Routes.$.feed]: <Feed />,
    [Routes.$.forgotPassword]: <ForgotPassword />,
    [Routes.$.resetPassword]: <ResetPassword />,
    [Routes.$.settings.aiTunnel]: <SettingsAiTunnel />,
    [Routes.$.settings.language]: <SettingsLanguage />,
    [Routes.$.settings.models.chat]: <SettingsModelsChat />,
    [Routes.$.settings.models.image]: <SettingsModelsImage />,
    [Routes.$.settings.models.speech]: <SettingsModelsSpeech />,
    [Routes.$.settings.root]: <Settings />,
    [Routes.$.settings.theme]: <SettingsTheme />,
    [Routes.$.settings.typeWriterSpeed]: <SettingsTypeWriterSpeed />,
    [Routes.$.signIn]: <SignIn />,
    [Routes.$.signUp]: <SignUp />,
    [Routes.$.snappy]: <Snappy />,
  },
  signedIn: $signedIn,
  signInPath: Routes.signIn,
});
