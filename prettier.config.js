export default {
  arrowParens: `avoid`,
  endOfLine: `crlf`,
  overrides: [{ files: [`*.{ts,js,tsx}`], options: { objectWrap: `collapse` } }],
  printWidth: 120,
  proseWrap: `always`,
  quoteProps: `consistent`,
};
