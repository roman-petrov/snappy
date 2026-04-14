export type BuildChunk = (input: ChunkInput) => ChunkPart[];

export type Chunk = { build: BuildChunk; extensions: readonly string[] };

export type ChunkInput = { path: string; source: string };

export type ChunkPart = { endLine: number; path: string; startLine: number; text: string };

export const Chunk = ({ build, extensions }: Chunk): Chunk => ({ build, extensions });
