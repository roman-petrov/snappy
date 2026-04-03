import { AgentDefinition } from "../../core";
import { useAudioChat } from "../../templates/simple-static/hooks";
import { SimpleStaticAgent } from "../../templates/simple-static/SimpleStaticAgent";
import { Data } from "./Meta";

export const Agent = AgentDefinition(Data, { maxSpeechFileMegaBytes: 0 }, SimpleStaticAgent(Data, {}, useAudioChat));
