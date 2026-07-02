import {
  AudioLines,
  ChartColumn,
  FileText,
  PartyPopper,
  ReceiptText,
  ScanLine,
  Scissors,
  Shapes,
  Sofa,
  Sparkles,
  SpellCheck,
  UserRound,
  Wand2,
} from "lucide-react";

import { t } from "../locales";
import { Pills } from "./Pills";
import { Section } from "./Section";

export const Presets = () => (
  <Section id="tasks" lead={t(`presets.lead`)} title={t(`presets.title`)}>
    <Pills
      items={[
        { color: `accentViolet`, icon: Sparkles, label: t(`presets.logo`) },
        { color: `accentIndigo`, icon: Shapes, label: t(`presets.icons`) },
        { color: `accentPink`, icon: UserRound, label: t(`presets.avatar`) },
        { color: `accentFuchsia`, icon: Scissors, label: t(`presets.removeBg`) },
        { color: `accentPurple`, icon: Wand2, label: t(`presets.restore`) },
        { color: `accentOrange`, icon: Sofa, label: t(`presets.interior`) },
        { color: `accentMagenta`, icon: PartyPopper, label: t(`presets.greeting`) },
        { color: `accentPlum`, icon: ReceiptText, label: t(`presets.receipt`) },
        { color: `accentIndigo`, icon: ScanLine, label: t(`presets.document`) },
        { color: `accentPink`, icon: AudioLines, label: t(`presets.meeting`) },
        { color: `accentViolet`, icon: ChartColumn, label: t(`presets.infographic`) },
        { color: `accentPurple`, icon: FileText, label: t(`presets.resume`) },
        { color: `accentMagenta`, icon: SpellCheck, label: t(`presets.improve`) },
      ]}
    />
  </Section>
);
