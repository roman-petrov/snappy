import { center } from "../../../styled-system/patterns";

export const cta = center({
  "@media (width <= 640px)": { fontSize: `sm`, padding: `0.75rem 1rem`, width: `100%` },
  "display": `inline-flex`,
  "fontSize": `lg`,
  "padding": `1rem 2rem`,
  "width": `auto`,
});
