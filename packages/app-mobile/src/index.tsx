/* eslint-disable functional/no-expression-statements */
import { effect } from "@preact/signals";
import { runApp } from "@snappy/app";
import { $theme } from "@snappy/ui";

import { App } from "./App";
import "./styles.scss";

const bridge = (window as Window & { SnappyAndroid?: { setBarStyle: (theme: string) => void } }).SnappyAndroid;
const syncBarStyle = (theme: string) => bridge?.setBarStyle(theme);
effect(() => syncBarStyle($theme.value));

void runApp(<App />);
