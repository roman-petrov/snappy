import { Stats } from "./Stats";

export type Vec2 = { x: number; y: number };

export type Vec2Axis = `horizontal` | `pending` | `vertical`;

export type Vec2Tie = `horizontal` | `vertical`;

const from = (x: number, y: number): Vec2 => ({ x, y });
const sub = (left: Vec2, right: Vec2): Vec2 => ({ x: left.x - right.x, y: left.y - right.y });
const delta = (origin: Vec2, x: number, y: number): Vec2 => sub(from(x, y), origin);
const abs = ({ x, y }: Vec2): Vec2 => ({ x: Math.abs(x), y: Math.abs(y) });
const max = (left: Vec2, right: Vec2): Vec2 => ({ x: Math.max(left.x, right.x), y: Math.max(left.y, right.y) });

const axis = (vector: Vec2, threshold: number, tie: Vec2Tie = `horizontal`): Vec2Axis => {
  const { x, y } = abs(vector);

  return x < threshold && y < threshold
    ? `pending`
    : tie === `horizontal`
      ? x >= y
        ? `horizontal`
        : `vertical`
      : x > y
        ? `horizontal`
        : `vertical`;
};

const horizontal = (vector: Vec2, slop: number, ratio: number) => {
  const { x, y } = abs(vector);

  return x >= slop && x >= ratio * y;
};

const vertical = (vector: Vec2, slop: number, ratio: number) => {
  const { x, y } = abs(vector);

  return y >= slop && ratio * y >= x;
};

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

export const Vector = { abs, axis, cosineSimilarity, delta, dot, from, horizontal, l2Norm, max, sub, vertical };
