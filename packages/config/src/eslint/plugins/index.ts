import pluginCore from "./Core";
import pluginFunctional from "./Functional";
import pluginPerfectionist from "./Perfectionist";
import pluginStylistic from "./Stylistic";
import pluginTypeScriptESLint from "./TypeScriptESLint";
import pluginUnicorn from "./Unicorn";

export default [
  ...pluginStylistic,
  ...pluginPerfectionist,
  ...pluginTypeScriptESLint,
  ...pluginCore,
  ...pluginUnicorn,
  ...pluginFunctional,
];
