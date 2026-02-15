import pluginCheckFile from "./CheckFile";
import pluginCore from "./Core";
import pluginFunctional from "./Functional";
import pluginImport from "./Import";
import pluginPerfectionist from "./Perfectionist";
import pluginPromise from "./Promise";
import pluginReact from "./React";
import pluginReactHooks from "./ReactHooks";
import pluginRegExp from "./RegExp";
import pluginSonarJs from "./SonarJs";
import pluginStylistic from "./Stylistic";
import pluginTypeScriptESLint from "./TypeScriptESLint";
import pluginUnicorn from "./Unicorn";
import pluginUnusedImports from "./UnusedImports";

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
  ...pluginReact,
  ...pluginReactHooks,
];
