/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable no-continue */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-try-statements */
import type parser from "tree-sitter";

import { type BuildChunk, Chunk, type ChunkPart } from "../Chunk";

type TreeSitterBuildConfig = { nodes: Set<string>; parser: parser | undefined };

export const TreeSitterBuild = ({ nodes, parser: treeParser }: TreeSitterBuildConfig): BuildChunk => {
  const build: BuildChunk = ({ path, source }) => {
    if (treeParser === undefined) {
      return [];
    }

    let tree: parser.Tree;
    try {
      tree = treeParser.parse(source);
    } catch {
      return [];
    }

    let chunks: ChunkPart[] = [];
    const stack: parser.SyntaxNode[] = [tree.rootNode];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node === undefined) {
        continue;
      }

      if (
        nodes.has(node.type) &&
        (() => {
          let current = node.parent;
          while (current !== null) {
            if (nodes.has(current.type)) {
              return false;
            }
            current = current.parent;
          }

          return true;
        })() &&
        node.endIndex > node.startIndex &&
        node.text.trim().length > 0
      ) {
        chunks = [
          ...chunks,
          {
            endLine: node.endPosition.row + 1,
            path,
            startLine: node.startPosition.row + 1,
            text: source.slice(node.startIndex, node.endIndex),
          },
        ];
      }

      for (let index = node.namedChildCount - 1; index >= 0; index -= 1) {
        const child = node.namedChild(index);
        if (child !== null) {
          stack.push(child);
        }
      }
    }

    return chunks;
  };

  return build;
};

export const TreeSitterChunk = ({
  extensions,
  nodes,
  parser: treeParser,
}: TreeSitterBuildConfig & { extensions: readonly string[] }) =>
  Chunk({ build: TreeSitterBuild({ nodes, parser: treeParser }), extensions });
