import { _ } from "@snappy/core";

export type TransformInput = {
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  scale?: number;
  translateX?: number;
  translateY?: number;
};

const css = ({ rotateX, rotateY, rotateZ, scale, translateX, translateY }: TransformInput) =>
  [
    translateX === undefined ? undefined : `translateX(${_.px(translateX)})`,
    translateY === undefined ? undefined : `translateY(${_.px(translateY)})`,
    rotateX === undefined ? undefined : `rotateX(${rotateX}deg)`,
    rotateY === undefined ? undefined : `rotateY(${rotateY}deg)`,
    rotateZ === undefined ? undefined : `rotateZ(${rotateZ}deg)`,
    scale === undefined ? undefined : `scale(${scale})`,
  ]
    .filter((part): part is string => part !== undefined)
    .join(` `);

export const Transform = { css };
