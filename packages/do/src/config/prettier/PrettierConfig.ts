export const PrettierConfig = {
  arrowParens: `avoid`,
  endOfLine: `auto`,
  overrides: [{ files: [`*.{ts,js,tsx}`], options: { objectWrap: `collapse` } }],
  plugins: [`prettier-plugin-pkg`],
  printWidth: 120,
  proseWrap: `always`,
  quoteProps: `consistent`,
};
