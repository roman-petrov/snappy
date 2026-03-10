import pluginCheckFile from "./CheckFile";
import pluginCore from "./Core";
import pluginFunctional from "./Functional";
import pluginImport from "./Import";
import pluginPerfectionist from "./Perfectionist";
import pluginPromise from "./Promise";
import pluginReact from "./React";
import pluginReactHooks from "./ReactHooks";
import pluginReactRefresh from "./ReactRefresh";
import pluginRegExp from "./RegExp";
import pluginStylistic from "./Stylistic";
import pluginTypeScriptESLint from "./TypeScriptESLint";
import pluginUnicorn from "./Unicorn";
import pluginUnusedImports from "./UnusedImports";
import pluginVitest from "./ViTest";

export default [
  ...pluginStylistic,
  ...pluginPerfectionist,
  ...pluginTypeScriptESLint,
  ...pluginVitest,
  ...pluginCore,
  ...pluginUnicorn,
  ...pluginFunctional,
  ...pluginCheckFile,
  ...pluginImport,
  ...pluginUnusedImports,
  ...pluginPromise,
  ...pluginRegExp,
  ...pluginReact,
  ...pluginReactHooks,
  ...pluginReactRefresh,
];
