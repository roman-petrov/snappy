/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/strict-void-return */
import { Button, Card } from "@snappy/ui";

import type { useDashboardState } from "./Dashboard.state";

import { css } from "../../../styled-system/css";
import { flex } from "../../../styled-system/patterns";
import { type FeatureType, t } from "../core";

export type DashboardViewProps = ReturnType<typeof useDashboardState>;

export const DashboardView = ({
  copied,
  error: error_,
  feature,
  featureEmoji,
  featureKeys,
  loading,
  onCopyResult,
  onFeatureChange,
  onPremiumClick,
  onSubmit,
  onTextChange,
  remaining,
  result: resultText,
  text,
}: DashboardViewProps) => (
  <>
    <h1
      className={css({
        borderColor: "accent",
        borderInlineStartWidth: "3px",
        borderInlineStartStyle: "solid",
        color: "text.heading",
        fontSize: "2xl",
        fontWeight: "extrabold",
        letterSpacing: "tight",
        lineHeight: "tight",
        margin: "0 0 2rem",
        paddingInlineStart: "1rem",
      })}
    >
      {t("dashboard.title")}
    </h1>

    <section className={css({ _last: { marginBottom: 0 }, marginBottom: "2.5rem" })}>
      <h2
        className={css({
          color: "text.heading",
          fontSize: "lg",
          fontWeight: "bold",
          letterSpacing: "tight",
          margin: "0 0 0.5rem",
        })}
      >
        {t("dashboard.balance")}
      </h2>
      <Card>
        <div
          className={flex({
            "@media (width <= 640px)": { alignItems: "flex-start", flexDirection: "column" },
            "alignItems": "center",
            "flexWrap": "wrap",
            "gap": "1rem",
            "justifyContent": "space-between",
            "marginBottom": "1rem",
          })}
        >
          <p className={css({ color: "text.body", fontSize: "lg" })}>
            <span
              aria-hidden
              className={css({ fontSize: "1.25em", marginInlineEnd: "0.5rem", verticalAlign: "-0.2em" })}
            >
              🪙
            </span>
            {t("dashboard.freeRequests")}:{" "}
            <span className={css({ color: "accent", fontSize: "2xl", fontWeight: "extrabold" })}>
              {remaining ?? "—"}
            </span>
          </p>
          <Button onClick={onPremiumClick} primary>
            {t("dashboard.getPremium")}
          </Button>
        </div>
      </Card>
    </section>

    <section className={css({ _last: { marginBottom: 0 }, marginBottom: "2.5rem" })}>
      <h2
        className={css({
          color: "text.heading",
          fontSize: "lg",
          fontWeight: "bold",
          letterSpacing: "tight",
          margin: "0 0 0.5rem",
        })}
      >
        {t("dashboard.process")}
      </h2>
      <p className={css({ color: "text.muted", fontSize: "sm", lineHeight: "relaxed", margin: "0 0 1rem" })}>
        {t("dashboard.processDesc")}
      </p>
      <form onSubmit={onSubmit}>
        <Card>
          <div className={css({ _lastOfType: { marginBottom: 0 }, marginBottom: "1rem" })}>
            <label
              className={css({
                color: "text.muted",
                display: "block",
                fontSize: "sm",
                fontWeight: "medium",
                marginBottom: "0.5rem",
              })}
              htmlFor="dashboard-text"
            >
              {t("dashboard.text")}
            </label>
            <textarea
              className={css({
                _focus: { borderColor: "accent", boxShadow: "0 0 0 3px rgb(var(--rgb-accent) / 20%)", outline: "none" },
                _placeholder: { color: "text.muted" },
                bg: "bg",
                border: "1px solid border",
                borderRadius: "sm",
                boxSizing: "border-box",
                color: "text.body",
                fontFamily: "inherit",
                fontSize: "base",
                lineHeight: "relaxed",
                minHeight: "140px",
                padding: "1rem",
                resize: "vertical",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                width: "100%",
              })}
              disabled={loading}
              id="dashboard-text"
              onChange={event => {
                onTextChange(event.target.value);
              }}
              placeholder={t("dashboard.textPlaceholder")}
              value={text}
            />
          </div>
          <div className={css({ _lastOfType: { marginBottom: 0 }, marginBottom: "1rem" })}>
            <label
              className={css({
                color: "text.muted",
                display: "block",
                fontSize: "sm",
                fontWeight: "medium",
                marginBottom: "0.5rem",
              })}
              htmlFor="dashboard-feature"
            >
              {t("dashboard.action")}
            </label>
            <select
              className={css({
                _dark: {
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                },
                _focus: { borderColor: "accent", boxShadow: "0 0 0 3px rgb(var(--rgb-accent) / 20%)", outline: "none" },
                _hover: { borderColor: "text.muted" },
                _light: {
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                },
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 0.75rem center",
                backgroundRepeat: "no-repeat",
                bg: "bg",
                border: "1px solid border",
                borderRadius: "sm",
                boxSizing: "border-box",
                color: "text.body",
                cursor: "pointer",
                fontSize: "base",
                minHeight: "2.5rem",
                padding: "0.75rem 1rem",
                paddingInlineEnd: "2.5rem",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                width: "100%",
              })}
              disabled={loading}
              id="dashboard-feature"
              onChange={event => {
                onFeatureChange(event.target.value as FeatureType);
              }}
              value={feature}
            >
              {featureKeys.map(key => (
                <option key={key} value={key}>
                  {featureEmoji[key]} {t(`features.${key}`)}
                </option>
              ))}
            </select>
          </div>
          <Button cn={css({ marginTop: "1.25rem" })} disabled={loading} primary type="submit">
            {loading ? t("dashboard.submitting") : t("dashboard.submit")}
          </Button>
          {error_ !== "" && (
            <p
              className={css({
                bg: "rgb(var(--rgb-accent-red) / 10%)",
                borderRadius: "sm",
                color: "accentRed",
                fontSize: "sm",
                marginTop: "0.75rem",
                padding: "0.75rem",
              })}
            >
              {error_}
            </p>
          )}
          {resultText !== "" && (
            <div
              className={css({
                bg: "rgb(var(--rgb-accent) / 6%)",
                border: "1px solid rgb(var(--rgb-accent) / 20%)",
                borderRadius: "sm",
                marginTop: "1.25rem",
                overflow: "hidden",
              })}
            >
              <div
                className={flex({
                  alignItems: "center",
                  bg: "rgb(var(--rgb-accent) / 10%)",
                  borderBlockEnd: "1px solid rgb(var(--rgb-accent) / 20%)",
                  gap: "0.75rem",
                  justifyContent: "space-between",
                  padding: "0.5rem 1rem",
                })}
              >
                <span className={css({ color: "text.heading", fontSize: "sm", fontWeight: "semibold" })}>
                  {t("dashboard.result")}
                </span>
                <button
                  className={css({
                    _focus: { boxShadow: "0 0 0 2px rgb(var(--rgb-accent) / 30%)", outline: "none" },
                    _hover: { bg: "rgb(var(--rgb-accent) / 15%)", borderColor: "accent" },
                    bg: "transparent",
                    border: "1px solid rgb(var(--rgb-accent) / 40%)",
                    borderRadius: "sm",
                    color: "accent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "sm",
                    fontWeight: "medium",
                    padding: "0.25rem 0.75rem",
                    transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                  })}
                  onClick={onCopyResult}
                  type="button"
                >
                  {copied ? t("dashboard.copied") : t("dashboard.copy")}
                </button>
              </div>
              <div
                className={css({
                  color: "text.body",
                  fontSize: "md",
                  lineHeight: "relaxed",
                  overflowWrap: "break-word",
                  padding: "1rem",
                  whiteSpace: "pre-wrap",
                })}
              >
                {resultText}
              </div>
            </div>
          )}
        </Card>
      </form>
    </section>
  </>
);
