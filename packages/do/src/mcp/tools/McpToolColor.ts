/* eslint-disable functional/no-expression-statements */
import { converter, displayable, formatCss, formatHex, interpolate, parse, wcagContrast, wcagLuminance } from "culori";
import { z } from "zod";

import type { McpTool } from "../Types";

export const McpToolColor: McpTool = server => {
  const toOklch = converter(`oklch`);
  const toRgb = converter(`rgb`);
  const wcagAaLarge = 3;
  const wcagAaNormal = 4.5;
  const wcagAaaLarge = 4.5;
  const wcagAaaNormal = 7;

  const parseSchema = z.object({
    action: z.literal(`parse`).describe(`Read a color.`),
    color: z.string().describe(`Input color (hex, rgb, oklch, …). Returns hex, css, channels, displayable.`),
  });

  const mixSchema = z.object({
    a: z.string().describe(`First color.`),
    action: z.literal(`mix`).describe(`Blend two colors.`),
    b: z.string().describe(`Second color.`),
    bRatio: z.number().min(0).max(1).describe(`Weight of b from 0 to 1 (0 = all a, 1 = all b).`),
    mode: z.enum([`oklch`, `rgb`, `lab`, `lch`]).optional().describe(`Interpolation space; default oklch.`),
  });

  const setSchema = z.object({
    action: z.literal(`set`).describe(`Change oklch channels on a color.`),
    alpha: z.number().min(0).max(1).optional().describe(`Alpha 0–1.`),
    c: z.number().optional().describe(`Chroma.`),
    color: z.string().describe(`Base color.`),
    h: z.number().optional().describe(`Hue.`),
    l: z.number().optional().describe(`Lightness.`),
  });

  const contrastSchema = z.object({
    action: z.literal(`contrast`).describe(`WCAG contrast between two colors.`),
    background: z.string().describe(`Background color.`),
    foreground: z.string().describe(`Foreground color.`),
  });

  const inputSchema = z.discriminatedUnion(`action`, [parseSchema, mixSchema, setSchema, contrastSchema]);
  const invalid = (error: string) => ({ error, ok: false as const });
  const formatted = (color: ReturnType<typeof parse>) => ({ css: formatCss(color), hex: formatHex(color) });

  const parseAction = ({ color: value }: z.infer<typeof parseSchema>) => {
    const color = parse(value);

    if (color === undefined) {
      return invalid(`Unrecognized color: ${value}`);
    }
    const oklch = toOklch(color);
    const rgb = toRgb(color);

    return {
      displayable: displayable(color),
      ok: true as const,
      oklch: { alpha: oklch.alpha, c: oklch.c, h: oklch.h, l: oklch.l },
      rgb: { alpha: rgb.alpha, b: rgb.b, g: rgb.g, r: rgb.r },
      ...formatted(color),
    };
  };

  const setAction = ({ alpha, c, color: value, h, l }: z.infer<typeof setSchema>) => {
    const base = parse(value);

    return base === undefined
      ? invalid(`Unrecognized color: ${value}`)
      : {
          ok: true as const,
          ...formatted({
            ...toOklch(base),
            ...(l === undefined ? {} : { l }),
            ...(c === undefined ? {} : { c }),
            ...(h === undefined ? {} : { h }),
            ...(alpha === undefined ? {} : { alpha }),
            mode: `oklch` as const,
          }),
        };
  };

  const contrastAction = ({ background, foreground }: z.infer<typeof contrastSchema>) => {
    const fg = parse(foreground);
    const bg = parse(background);

    if (fg === undefined) {
      return invalid(`Unrecognized color: ${foreground}`);
    }
    if (bg === undefined) {
      return invalid(`Unrecognized color: ${background}`);
    }
    const ratio = wcagContrast(fg, bg);

    return {
      luminance: { background: wcagLuminance(bg), foreground: wcagLuminance(fg) },
      ok: true as const,
      ratio,
      wcag: {
        aaaLarge: ratio >= wcagAaaLarge,
        aaaNormal: ratio >= wcagAaaNormal,
        aaLarge: ratio >= wcagAaLarge,
        aaNormal: ratio >= wcagAaNormal,
      },
    };
  };

  server.registerTool(
    `color`,
    {
      description: `Color calculations via action: parse, mix, set, or contrast. Parameters are per action — see each field.`,
      inputSchema,
    },
    (input: z.infer<typeof inputSchema>) => ({
      content: [
        {
          text: JSON.stringify(
            input.action === `parse`
              ? parseAction(input)
              : input.action === `mix`
                ? {
                    ok: true as const,
                    ...formatted(interpolate([input.a, input.b], input.mode ?? `oklch`)(input.bRatio)),
                  }
                : input.action === `set`
                  ? setAction(input)
                  : contrastAction(input),
            undefined,
            2,
          ),
          type: `text` as const,
        },
      ],
    }),
  );
};
