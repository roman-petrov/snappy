import { Button, Input } from "@snappy/ui";

import type { useSettingsOllamaRelayState } from "./SettingsOllamaRelay.state";

import { Page } from "../../components";
import { t } from "../../core";
import styles from "./SettingsOllamaRelay.view.module.scss";

export type SettingsOllamaRelayViewProps = ReturnType<typeof useSettingsOllamaRelayState>;

export const SettingsOllamaRelayView = ({
  communityChatOptions,
  communityImageModel,
  communityImageOptions,
  communityTextModel,
  llmProvider,
  loaded,
  onCommunityImageModelChange,
  onCommunityTextModelChange,
  onLlmProviderChange,
  onRelayKeyChange,
  refreshCommunityCatalog,
  relayKey,
  save,
  saving,
}: SettingsOllamaRelayViewProps) => (
  <Page back title={t(`settingsOllamaRelay.title`)}>
    <p>{t(`settingsOllamaRelay.lead`)}</p>
    {loaded ? (
      <>
        <label className={styles.label} htmlFor="llm-provider">
          {t(`settingsOllamaRelay.providerLabel`)}
        </label>
        <select
          className={styles.select}
          id="llm-provider"
          onChange={event => {
            onLlmProviderChange(event.target.value === `self` ? `self` : `community`);
          }}
          value={llmProvider}
        >
          <option value="community">{t(`settingsOllamaRelay.providerCommunity`)}</option>
          <option value="self">{t(`settingsOllamaRelay.providerSelf`)}</option>
        </select>
        {llmProvider === `self` ? (
          <Input label={t(`settingsOllamaRelay.label`)} onChange={onRelayKeyChange} type="text" value={relayKey} />
        ) : (
          <>
            <label className={styles.label} htmlFor="community-text-model">
              {t(`settingsOllamaRelay.textModelLabel`)}
            </label>
            <select
              className={styles.select}
              id="community-text-model"
              onChange={event => {
                onCommunityTextModelChange(event.target.value);
              }}
              value={communityTextModel}
            >
              <option value="">{t(`settingsOllamaRelay.modelAuto`)}</option>
              {communityTextModel !== `` && !communityChatOptions.includes(communityTextModel) ? (
                <option value={communityTextModel}>{communityTextModel}</option>
              ) : null}
              {communityChatOptions.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <label className={styles.label} htmlFor="community-image-model">
              {t(`settingsOllamaRelay.imageModelLabel`)}
            </label>
            <select
              className={styles.select}
              id="community-image-model"
              onChange={event => {
                onCommunityImageModelChange(event.target.value);
              }}
              value={communityImageModel}
            >
              <option value="">{t(`settingsOllamaRelay.modelAuto`)}</option>
              {communityImageModel !== `` && !communityImageOptions.includes(communityImageModel) ? (
                <option value={communityImageModel}>{communityImageModel}</option>
              ) : null}
              {communityImageOptions.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {communityChatOptions.length === 0 && communityImageOptions.length === 0 ? (
              <p className={styles.hint}>{t(`settingsOllamaRelay.communityCatalogEmpty`)}</p>
            ) : null}
            <Button
              onClick={() => void refreshCommunityCatalog()}
              text={t(`settingsOllamaRelay.refreshCommunityModels`)}
              type="default"
            />
          </>
        )}
        <Button
          disabled={saving}
          icon="process"
          large
          onClick={() => void save()}
          text={saving ? t(`settingsOllamaRelay.saving`) : t(`settingsOllamaRelay.save`)}
          type="primary"
        />
      </>
    ) : null}
  </Page>
);
