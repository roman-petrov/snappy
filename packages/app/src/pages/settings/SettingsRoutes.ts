import { SettingsModelsChat, SettingsModelsImage, SettingsModelsSpeech, SettingsModelsVision } from "./models";
import { SettingsProfile, SettingsProfilePassword, SettingsProfileTopUp } from "./profile";
import { Settings } from "./Settings";
import { SettingsAiTunnel } from "./SettingsAiTunnel";
import { SettingsLanguage } from "./SettingsLanguage";
import { SettingsTheme } from "./SettingsTheme";
import { SettingsTypeWriterSpeed } from "./SettingsTypeWriterSpeed";

export const SettingsRoutes = {
  aiTunnel: { page: SettingsAiTunnel, path: `settings/ai-tunnel` },
  language: { page: SettingsLanguage, path: `settings/language` },
  models: {
    chat: { page: SettingsModelsChat, path: `settings/models/chat` },
    image: { page: SettingsModelsImage, path: `settings/models/image` },
    speech: { page: SettingsModelsSpeech, path: `settings/models/speech` },
    vision: { page: SettingsModelsVision, path: `settings/models/vision` },
  },
  profile: {
    password: { page: SettingsProfilePassword, path: `settings/profile/password` },
    root: { page: SettingsProfile, path: `settings/profile` },
    topUp: { page: SettingsProfileTopUp, path: `settings/profile/top-up` },
  },
  root: { page: Settings, path: `settings` },
  theme: { page: SettingsTheme, path: `settings/theme` },
  typeWriterSpeed: { page: SettingsTypeWriterSpeed, path: `settings/type-writer-speed` },
} as const;
