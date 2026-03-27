import { i } from "@snappy/intl";
import { SwitchDisplay } from "@snappy/ui";

import type { useSettingsState } from "./Settings.state";

import { Page } from "../../components";
import { t } from "../../core";
import { SettingsCard, SettingsCardRow, SettingsCards, SettingsCardSeparator } from "./components";

export type SettingsViewProps = ReturnType<typeof useSettingsState>;

export const SettingsView = ({ fog, locale, subscription, theme, toggleFog }: SettingsViewProps) => (
  <Page title={t(`settings.title`)}>
    <SettingsCards>
      <SettingsCard title={t(`settings.systemGroup`)}>
        <SettingsCardRow
          end={`${t(`settingsTheme.${theme}`)} ›`}
          icon="🎨"
          link="/settings/theme"
          text={t(`settings.appearance`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={<SwitchDisplay checked={fog} />}
          icon="🌫️"
          onClick={toggleFog}
          text={t(`settings.fogBackground`)}
        />
        <SettingsCardSeparator />
        <SettingsCardRow
          end={`${t(`settingsLanguage.${locale}`)} ›`}
          icon="🌐"
          link="/settings/language"
          text={t(`settings.language`)}
        />
      </SettingsCard>
      <SettingsCard>
        <SettingsCardRow
          end={`${
            subscription.premiumUntil === undefined
              ? t(`settings.subscriptionInactive`)
              : t(`settings.subscriptionActiveUntil`, {
                  autoRenew:
                    subscription.autoRenew === true
                      ? t(`settingsSubscription.autoRenewShortOn`)
                      : t(`settingsSubscription.autoRenewShortOff`),
                  date: i.date(subscription.premiumUntil),
                })
          } ›`}
          icon="💳"
          link="/settings/subscription"
          text={t(`settings.subscription`)}
        />
      </SettingsCard>
    </SettingsCards>
  </Page>
);
