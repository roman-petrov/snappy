/* eslint-disable react/forbid-component-props */
import { Text } from "react-email";

import { Colors, Layout } from "../core";

export const Brand = () => (
  <Text
    style={{
      color: Colors.accent,
      fontSize: Layout.fontSize.small,
      fontWeight: 600,
      letterSpacing: `0.04em`,
      margin: Layout.margin.bottom24,
    }}
  >
    SNAPPY
  </Text>
);
