import { AgentTool } from "@snappy/agent";
import { AiConstants } from "@snappy/ai";
import { z } from "zod";

import type { SnappyToolFactory } from "../SnappyTypes";

const audioAccept = `audio/*,.mp3,.m4a,.wav,.webm,.ogg,.flac`;

export const TranscribeAudioTool: SnappyToolFactory = ({ ai, config, feed, isStopped, locale }) =>
  AgentTool({
    description: [
      [
        `when`,
        `Use when the user needs speech-to-text from an audio recording: meetings, voice notes, podcasts, or interviews.`,
      ],
      [`input`, `No arguments. The tool asks the user to pick one audio file, then transcribes it.`],
      [`output`, `Returns the full transcript as plain text for analysis, summarization, or rewriting.`],
    ],
    execute: async () => {
      if (isStopped()) {
        return ``;
      }

      const answers = await feed.ask({
        fields: [
          {
            accept: audioAccept,
            hint:
              locale === `ru`
                ? `До ${AiConstants.maxSpeechFileMegaBytes} МБ`
                : `Max ${AiConstants.maxSpeechFileMegaBytes} MB`,
            id: `audio`,
            kind: `file_input`,
            label: { emoji: `🎵`, text: locale === `ru` ? `Аудиофайл` : `Audio file` },
            pickLabel: locale === `ru` ? `Выбрать файл` : `Choose file`,
          },
        ],
        title: locale === `ru` ? `Аудиофайл для расшифровки` : `Audio file to transcribe`,
      });

      const file = answers[`audio`];
      if (!(file instanceof File)) {
        return { error: `No audio file selected.` };
      }

      const out = await ai.audio.transcriptions.create({ file, model: config.models.speech });

      return isStopped() ? `` : out.text;
    },
    formatCall: (_input, status, loc) =>
      status === `running` ? (loc === `ru` ? `Расшифровываю аудиофайл…` : `Transcribing audio file…`) : ``,
    inputSchema: z.object({}),
  });
