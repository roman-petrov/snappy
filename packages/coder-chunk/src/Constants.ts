export const Constants = {
  /** Line-based fallback chunking configuration for plain text splitting. */
  genericChunk: {
    /** Number of overlapping lines between adjacent generic chunks. */
    overlapLines: 12,
    /** Target number of lines in one generic chunk window. */
    targetLines: 48,
  },
  /** Overlap in characters when splitting an oversized text part into multiple chunks. */
  intraTextOverlapChars: 128,
  /** Global hard limit for one chunk text payload, in characters. */
  maxLength: 2048,
};
