// cspell:word gradlew
/* eslint-disable functional/no-expression-statements */
import { Process } from "@snappy/node";
import fs from "node:fs";
import { join } from "node:path";

import type { Command } from "../Command";

import { Android } from "../Android";

export const BuildAppAndroidDebug: Command = {
  description: `Build debug Android app for local testing.`,
  label: `🤖 Android debug`,
  name: `build:app-android-debug`,
  run: async (root, { capture }) => {
    await Android.drawable(root);
    const result = await Android.spawnGradle(root, `assembleDebug`, capture);
    if (Process.exitCode(result) !== 0) {
      return result;
    }
    if (!fs.existsSync(Android.apkOutPath(root, `debug`))) {
      return 1;
    }
    fs.mkdirSync(join(root, `dist`), { recursive: true });
    fs.copyFileSync(Android.apkOutPath(root, `debug`), join(root, `dist`, `snappy-debug.apk`));

    return 0;
  },
};
