import type { Db } from "@snappy/db";

const normalizeProvider = (raw: string): `community` | `self` => (raw === `self` ? `self` : `community`);

export const UserSettings = ({ snappySettings }: { snappySettings: Db[`snappySettings`] }) => {
  const get = async (userId: number) => {
    const row = await snappySettings.findByUserId(userId);
    if (row === undefined) {
      return {
        communityImageModel: ``,
        communityTextModel: ``,
        llmProvider: `community` as const,
        ollamaRelayKey: ``,
        status: `ok` as const,
      };
    }

    return {
      communityImageModel: row.communityImageModel,
      communityTextModel: row.communityTextModel,
      llmProvider: normalizeProvider(row.llmProvider),
      ollamaRelayKey: row.ollamaRelayKey,
      status: `ok` as const,
    };
  };

  const patchRelay = async (
    userId: number,
    patch: { communityImageModel: string; communityTextModel: string; llmProvider: string; ollamaRelayKey: string },
  ) =>
    snappySettings
      .patchRelaySettings(userId, {
        communityImageModel: patch.communityImageModel.trim(),
        communityTextModel: patch.communityTextModel.trim(),
        llmProvider: normalizeProvider(patch.llmProvider),
        ollamaRelayKey: patch.ollamaRelayKey.trim(),
      })
      .then(() => ({ status: `ok` as const }));

  return { get, patchRelay };
};

export type UserSettings = ReturnType<typeof UserSettings>;
