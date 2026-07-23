import { StaticFields } from "@snappy/snappy";

const option = (value: string, emoji: string, text: string) => ({ label: { emoji, text }, value });

export const LabPlan = {
  fields: StaticFields([
    {
      default: `custom`,
      id: `preset`,
      kind: `single_choice`,
      label: { emoji: `⚡`, text: `Preset` },
      options: [
        option(`custom`, `🎛️`, `Custom`),
        option(`flicker-emphasis`, `✨`, `Flicker emphasis`),
        option(`flicker-code`, `💻`, `Flicker code`),
        option(`flicker-table`, `📊`, `Flicker table`),
        option(`flicker-list`, `📋`, `Flicker list`),
        option(`table-hang`, `⏸️`, `Table hang`),
        option(`perf`, `🚀`, `Perf`),
        option(`modes`, `🎚️`, `Modes`),
        option(`all`, `📦`, `Full suite`),
      ],
    },
    {
      default: `showcase`,
      id: `fixture`,
      kind: `single_choice`,
      label: { emoji: `📄`, text: `Fixture` },
      options: [
        option(`showcase`, `✨`, `Showcase`),
        option(`list-table-code`, `📋`, `Lists & tables`),
        option(`emphasis-stress`, `💪`, `Emphasis stress`),
        option(`code-fence`, `💻`, `Code fences`),
      ],
    },
    {
      default: `token`,
      id: `profile`,
      kind: `single_choice`,
      label: { emoji: `⏱️`, text: `Chunk profile` },
      options: [
        option(`burst`, `⚡`, `Burst`),
        option(`token`, `🔤`, `Token`),
        option(`slow`, `🐢`, `Slow chunks`),
        option(`hang-mid`, `⏸️`, `Hang mid-stream`),
        option(`cut-emphasis`, `✂️`, `Cut at emphasis`),
        option(`cut-code`, `💻`, `Cut at code`),
        option(`cut-table`, `📊`, `Cut at table`),
        option(`cut-list`, `📋`, `Cut at list`),
      ],
    },
    {
      default: `medium`,
      id: `speed`,
      kind: `single_choice`,
      label: { emoji: `⌨️`, text: `Typing pace` },
      options: [
        option(`stream`, `📡`, `Raw stream`),
        option(`fast`, `🐇`, `Fast`),
        option(`medium`, `🚶`, `Medium`),
        option(`slow`, `🐌`, `Slow`),
      ],
    },
    {
      default: `chat`,
      id: `theme`,
      kind: `single_choice`,
      label: { emoji: `🎨`, text: `Theme` },
      options: [option(`chat`, `💬`, `Chat`), option(`reasoning`, `🧠`, `Reasoning`)],
    },
  ]),
} as const;
