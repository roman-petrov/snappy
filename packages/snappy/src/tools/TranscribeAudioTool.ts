import { AgentTool } from "@snappy/agent";
import { Bilingual } from "@snappy/intl";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

export const TranscribeAudioTool: SnappyToolFactory = ({ config, files, isStopped }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when the user needs speech-to-text from an audio recording: meetings, voice notes, podcasts, or interviews.`,
      ],
      [`input`, `Pass the field id from an ask audio_input answer. Request the audio file via ask first.`],
      [`output`, `Returns the full transcript as plain text for analysis, summarization, or rewriting.`],
    ],
    execute: async ({ file: fieldId }) => {
      if (isStopped()) {
        return ``;
      }

      const file = files[fieldId];
      if (!(file instanceof File)) {
        return { error: `No audio file for field "${fieldId}". Run ask first.` };
      }

      const out = await config.models.speech.transcribe({ file });

      return isStopped() ? `` : out.text;
    },
    formatCall: (_input, status, locale) =>
      Bilingual.running(locale, status === `running`, [`Transcribing audio file…`, `Расшифровываю аудиофайл…`]),
    inputSchema: z.object({ file: z.string().min(1).describe(`Field id from ask audio_input answer.`) }),
  });
