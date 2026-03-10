/* eslint-disable functional/no-expression-statements */
import { effect } from "@preact/signals";
import { runApp } from "@snappy/app";
import { $theme, AndroidBridge } from "@snappy/ui";

import { App } from "./App";
import "./styles.scss";

effect(() => AndroidBridge.setBarStyle($theme.value));

void runApp(<App />);
