/* eslint-disable init-declarations */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import type { Ai } from "@snappy/ai";
import type { AiModel, AiModelType } from "@snappy/domain";
import type {
  ApiLlmChatBody,
  ApiLlmChatResult,
  ApiLlmImageBody,
  ApiLlmImageResult,
  ApiLlmModelsResult,
  ApiLlmSpeechRecognitionBody,
  ApiLlmSpeechRecognitionResult,
} from "@snappy/server-api";

import { _ } from "@snappy/core";

import type { Balance } from "./Balance";

export const LlmProxy = ({ ai, balance }: { ai: Ai; balance: Balance }) => {
  const guard = async <TType extends AiModelType>(userId: number, modelName: string, modelType: TType) =>
    (await balance.isLlmBlocked(userId))
      ? ({ status: `balanceBlocked` } as const)
      : (ai.models.find(
          (entry): entry is Extract<AiModel, { type: TType }> => entry.name === modelName && entry.type === modelType,
        ) ?? ({ status: `badRequest` } as const));

  const chat = async (userId: number, body: ApiLlmChatBody): Promise<ApiLlmChatResult> => {
    const entry = await guard(userId, body.model, `chat`);
    if (`status` in entry) {
      return entry;
    }

    const reply = await entry.process(body.prompt);
    await balance.debitForLlm(userId, reply.cost, { call: `chat`, model: body.model });

    return { status: `ok`, text: reply.text };
  };

  const image = async (userId: number, body: ApiLlmImageBody): Promise<ApiLlmImageResult> => {
    const entry = await guard(userId, body.model, `image`);
    if (`status` in entry) {
      return entry;
    }

    const out = await entry.process(body.prompt, { quality: body.quality, size: body.size });
    await balance.debitForLlm(userId, out.cost, { call: `image`, model: body.model });

    return { bytes: out.bytes, status: `ok` };
  };

  const speechRecognition = async (
    userId: number,
    body: ApiLlmSpeechRecognitionBody,
  ): Promise<ApiLlmSpeechRecognitionResult> => {
    const entry = await guard(userId, body.model, `speech-recognition`);
    if (`status` in entry) {
      return entry;
    }

    let bytes: Uint8Array;
    try {
      bytes = new Uint8Array(Buffer.from(body.fileBase64, `base64`));
    } catch {
      return { status: `badRequest` };
    }
    if (bytes.length === 0 || bytes.length > _.mb(ai.maxSpeechFileMegaBytes)) {
      return { status: `badRequest` };
    }

    const fileName = body.fileName.trim() === `` ? `audio` : body.fileName.trim();
    const mimeType = body.mimeType.trim() === `` ? `application/octet-stream` : body.mimeType.trim();
    const out = await entry.process({ bytes, fileName, mimeType });
    await balance.debitForLlm(userId, out.cost, { call: `speechRecognition`, model: body.model });

    return { status: `ok`, text: out.text };
  };

  const models = (): ApiLlmModelsResult => ({ settings: ai, status: `ok` });

  return { chat, image, models, speechRecognition };
};

export type LlmProxy = ReturnType<typeof LlmProxy>;
