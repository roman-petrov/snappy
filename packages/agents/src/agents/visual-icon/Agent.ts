import { AgentDefinition } from "../../core";
import { useVisualChat } from "../../templates/simple-static/hooks";
import { SimpleStaticAgent } from "../../templates/simple-static/SimpleStaticAgent";
import { Data } from "./Meta";

export const Agent = AgentDefinition(Data, {}, SimpleStaticAgent(Data, {}, useVisualChat));
