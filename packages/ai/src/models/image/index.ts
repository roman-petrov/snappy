import { AiModelFlux2Max } from "./AiModelFlux2Max";
import { AiModelFlux2Pro } from "./AiModelFlux2Pro";
import { AiModelGemini3ProImagePreview } from "./AiModelGemini3ProImagePreview";
import { AiModelGemini25FlashImage } from "./AiModelGemini25FlashImage";
import { AiModelGemini31FlashImagePreview } from "./AiModelGemini31FlashImagePreview";
import { AiModelGptImage1 } from "./AiModelGptImage1";
import { AiModelGptImage1Mini } from "./AiModelGptImage1Mini";
import { AiModelGptImage2 } from "./AiModelGptImage2";
import { AiModelGptImage15 } from "./AiModelGptImage15";

export * from "./AiModelFlux2Max";

export * from "./AiModelFlux2Pro";

export * from "./AiModelGemini3ProImagePreview";

export * from "./AiModelGemini25FlashImage";

export * from "./AiModelGemini31FlashImagePreview";

export * from "./AiModelGptImage1";

export * from "./AiModelGptImage1Mini";

export * from "./AiModelGptImage2";

export * from "./AiModelGptImage15";

export const AiModelImageCatalog = [
  AiModelFlux2Max,
  AiModelFlux2Pro,
  AiModelGemini25FlashImage,
  AiModelGemini31FlashImagePreview,
  AiModelGemini3ProImagePreview,
  AiModelGptImage1,
  AiModelGptImage15,
  AiModelGptImage1Mini,
  AiModelGptImage2,
] as const;
