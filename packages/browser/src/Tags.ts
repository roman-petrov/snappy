/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";

type Resolved<T, P extends string = ``> = {
  [K in keyof T & string]: T[K] extends readonly string[]
    ? { [L in T[K][number]]: `${Segment<P, K>}.${L}` }
    : Resolved<T[K], Segment<P, K>>;
};

type Segment<P extends string, K extends string> = P extends `` ? K : `${P}.${K}`;

type TagTree = { readonly [key: string]: readonly string[] | TagTree };

export const Tags = <T extends TagTree>(tree: T, prefix = ``): Resolved<T> =>
  _.fromEntries(
    Object.entries(tree).map(([key, value]) => [
      key,
      _.isArray(value)
        ? _.fromEntries(
            (value as readonly string[]).map(leaf => [leaf, `${prefix === `` ? key : `${prefix}.${key}`}.${leaf}`]),
          )
        : Tags(value as TagTree, prefix === `` ? key : `${prefix}.${key}`),
    ]),
  ) as Resolved<T>;
