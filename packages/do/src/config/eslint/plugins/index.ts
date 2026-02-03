import pluginCheckFile from "./CheckFile.js";
import pluginCore from "./Core.js";
import pluginFunctional from "./Functional.js";
import pluginImport from "./Import.js";
import pluginPerfectionist from "./Perfectionist.js";
import pluginPromise from "./Promise.js";
import pluginRegExp from "./RegExp.js";
import pluginSonarJs from "./SonarJs.js";
import pluginStylistic from "./Stylistic.js";
import pluginTypeScriptESLint from "./TypeScriptESLint.js";
import pluginUnicorn from "./Unicorn.js";
import pluginUnusedImports from "./UnusedImports.js";

export default [
  ...pluginStylistic,
  ...pluginPerfectionist,
  ...pluginTypeScriptESLint,
  ...pluginCore,
  ...pluginUnicorn,
  ...pluginFunctional,
  ...pluginCheckFile,
  ...pluginImport,
  ...pluginUnusedImports,
  ...pluginPromise,
  ...pluginRegExp,
  ...pluginSonarJs,
];
