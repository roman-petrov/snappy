// cspell:word gradlew
/* eslint-disable functional/no-expression-statements */
import { Process } from "@snappy/node";
import fs from "node:fs";
import { join } from "node:path";

import type { Command } from "../Command";

import { Android } from "../Android";

export const BuildAppAndroid: Command = {
  description: `Build Android app for production.`,
  label: `🤖 Android app`,
  name: `build:app-android`,
  run: async (root, { capture }) => {
    await Android.drawable(root);
    const result = await Android.spawnGradle(root, `assembleRelease`, capture);
    if (Process.exitCode(result) !== 0) {
      return result;
    }
    if (!fs.existsSync(Android.apkOutPath(root, `release`))) {
      return 1;
    }
    fs.mkdirSync(join(root, `dist`), { recursive: true });
    fs.copyFileSync(Android.apkOutPath(root, `release`), join(root, `dist`, `snappy.apk`));

    return 0;
  },
};
