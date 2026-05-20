/* eslint-disable unicorn/filename-case */
import { Tsx } from "./core/Tsx.js";

export default (await Tsx.import(() => import(`../stylelint/StyleLintConfig.ts`))).StyleLintConfig;
