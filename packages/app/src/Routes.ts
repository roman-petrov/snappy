import { AppRoutes } from "@snappy/ui";

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
  SettingsProfile,
  SettingsProfilePassword,
  SettingsProfileTopUp,
  SettingsTheme,
  SettingsTypeWriterSpeed,
  SignIn,
  SignUp,
  Snappy,
} from "./pages";
export const Routes = AppRoutes(
  {
    agent: { page: Agent, path: `agent/:agentId` },
    feed: { page: Feed, path: `feed` },
    forgotPassword: { page: ForgotPassword, path: `forgot-password` },
    resetPassword: { page: ResetPassword, path: `reset-password` },
    settings: {
      aiTunnel: { page: SettingsAiTunnel, path: `settings/ai-tunnel` },
      language: { page: SettingsLanguage, path: `settings/language` },
      models: {
        chat: { page: SettingsModelsChat, path: `settings/models/chat` },
        image: { page: SettingsModelsImage, path: `settings/models/image` },
        speech: { page: SettingsModelsSpeech, path: `settings/models/speech` },
      },
      profile: {
        password: { page: SettingsProfilePassword, path: `settings/profile/password` },
        root: { page: SettingsProfile, path: `settings/profile` },
        topUp: { page: SettingsProfileTopUp, path: `settings/profile/top-up` },
      },
      root: { page: Settings, path: `settings` },
      theme: { page: SettingsTheme, path: `settings/theme` },
      typeWriterSpeed: { page: SettingsTypeWriterSpeed, path: `settings/type-writer-speed` },
    },
    signIn: { page: SignIn, path: `login` },
    signUp: { page: SignUp, path: `register` },
    snappy: { page: Snappy, path: `snappy` },
  },
  { index: Catalog, public: r => [r.forgotPassword, r.resetPassword, r.signIn, r.signUp], signIn: r => r.signIn },
);
