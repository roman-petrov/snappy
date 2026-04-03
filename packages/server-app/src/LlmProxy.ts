/* eslint-disable init-declarations */
/* eslint-disable functional/no-try-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
import type { AiModel } from "@snappy/domain";
import type {
  ApiLlmChatBody,
  ApiLlmChatResult,
  ApiLlmImageBody,
  ApiLlmImageResult,
  ApiLlmSpeechRecognitionBody,
  ApiLlmSpeechRecognitionResult,
} from "@snappy/server-api";

import { _ } from "@snappy/core";

import type { Balance } from "./Balance";

export const LlmProxy = ({
  ai,
  balance,
}: {
  ai: { maxSpeechFileMegaBytes: number; models: AiModel[] };
  balance: Balance;
}) => {
  const chat = async (userId: number, body: ApiLlmChatBody): Promise<ApiLlmChatResult> => {
    if (await balance.isLlmBlocked(userId)) {
      return { status: `balanceBlocked` };
    }

    const entry = ai.models.find(model => model.name === body.model);
    if (entry?.type !== `chat`) {
      return { status: `badRequest` };
    }

    const reply = await entry.process(body.prompt);
    await balance.debitForLlm(userId, reply.cost, { call: `chat`, model: body.model });

    return { status: `ok`, text: reply.text };
  };

  const image = async (userId: number, body: ApiLlmImageBody): Promise<ApiLlmImageResult> => {
    if (await balance.isLlmBlocked(userId)) {
      return { status: `balanceBlocked` };
    }

    const entry = ai.models.find(model => model.name === body.model);
    if (entry?.type !== `image`) {
      return { status: `badRequest` };
    }

    const out = await entry.process(body.prompt, { size: body.size });
    await balance.debitForLlm(userId, out.cost, { call: `image`, model: body.model });

    return { bytes: out.bytes, status: `ok` };
  };

  const speechRecognition = async (
    userId: number,
    body: ApiLlmSpeechRecognitionBody,
  ): Promise<ApiLlmSpeechRecognitionResult> => {
    if (await balance.isLlmBlocked(userId)) {
      return { status: `balanceBlocked` };
    }

    const entry = ai.models.find(model => model.name === body.model);
    if (entry?.type !== `speech-recognition`) {
      return { status: `badRequest` };
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

  return { chat, image, speechRecognition };
};

export type LlmProxy = ReturnType<typeof LlmProxy>;
