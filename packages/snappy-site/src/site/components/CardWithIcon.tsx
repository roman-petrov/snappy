import { css } from "../../../styled-system/css";
import { center } from "../../../styled-system/patterns";

export type CardWithIconProps = { description: string; icon: string; title: string; variant: "feature" | "who" };

const heading = css({
  color: "text.heading",
  fontSize: "lg",
  fontWeight: "bold",
  letterSpacing: "tight",
  margin: "0 0 0.5rem",
});
const desc = css({ color: "text.muted", fontSize: "md", lineHeight: "relaxed", margin: 0 });

export const CardWithIcon = ({ description, icon, title, variant }: CardWithIconProps) => {
  if (variant === "feature") {
    return (
      <div
        className={css({
          "@media (width <= 640px)": { "& h3": { fontSize: "md" }, "padding": "1.25rem" },
          "_hover": { bg: "bg.cardFeaturesHover", boxShadow: "cardHover", transform: "scale(1.02)" },
          "bg": "bg.cardFeatures",
          "border": "1px solid border",
          "borderRadius": "radius",
          "boxShadow": "card",
          "padding": "1.5rem",
          "transition": "transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
        })}
      >
        <span
          className={center({
            bg: "bg.icon",
            borderRadius: "sm",
            display: "inline-flex",
            fontSize: "2rem",
            marginBlockEnd: "1rem",
            minWidth: "3.5rem",
            padding: "0.75rem 1rem",
          })}
        >
          {icon}
        </span>
        <h3 className={heading}>{title}</h3>
        <p className={desc}>{description}</p>
      </div>
    );
  }

  return (
    <div
      className={css({
        "& h3, & p": { gridColumn: 2 },
        "&:not(:last-child)::after": {
          background:
            "linear-gradient(to right, transparent, rgb(var(--rgb-accent) / 60%) 30%, rgb(var(--rgb-accent) / 80%) 50%, rgb(var(--rgb-accent) / 60%) 70%, transparent)",
          bottom: 0,
          content: '""',
          height: "1px",
          insetInline: 0,
          position: "absolute",
        },
        "@media (width <= 640px)": { gap: "1rem" },
        "display": "grid",
        "gap": "1.25rem",
        "gridTemplateColumns": "auto 1fr",
        "padding": "1.25rem 0",
        "position": "relative",
      })}
    >
      <span className={css({ fontSize: "2rem", gridColumn: 1, gridRow: "1 / -1", lineHeight: 1 })}>{icon}</span>
      <h3 className={heading}>{title}</h3>
      <p className={desc}>{description}</p>
    </div>
  );
};
