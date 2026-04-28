import { Stats } from "./Stats";

const dot = (left: number[], right: number[]) => Stats.sum(left.map((value, index) => value * (right[index] ?? 0)));
const l2Norm = (values: number[]) => Math.sqrt(Stats.sum(values.map(value => value * value)) ?? 0);

const cosineSimilarity = (left: number[], right: number[]) => {
  if (left.length !== right.length || left.length === 0) {
    return 0;
  }
  const dotProduct = dot(left, right) ?? 0;
  const normsProduct = l2Norm(left) * l2Norm(right);

  return normsProduct === 0 ? 0 : dotProduct / normsProduct;
};

export const Vector = { cosineSimilarity, dot, l2Norm };
