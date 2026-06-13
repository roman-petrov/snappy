import * as chat from "./chat";
import * as embedder from "./embedder";
import * as image from "./image";
import * as speech from "./speech";

export const AiModelChatCatalog = Object.values(chat);

export const AiModelEmbedderCatalog = Object.values(embedder);

export const AiModelImageCatalog = Object.values(image);

export const AiModelSpeechCatalog = Object.values(speech);
