import pluginCore from "./Core";
import pluginPerfectionist from "./Perfectionist";
import pluginStylistic from "./Stylistic";
import pluginTypeScriptESLint from "./TypeScriptESLint";

export default [...pluginStylistic, ...pluginPerfectionist, ...pluginTypeScriptESLint, ...pluginCore];
