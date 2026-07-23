import type { StaticFormAnswers } from "@snappy/snappy";

import { type AiStreamTheme, AiStreamThemes } from "@snappy/ai-stream";
import { Copy } from "@snappy/platform";
import { StaticFormValues } from "@snappy/ui";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type FixtureId, FixtureIds, Fixtures, FixtureShapes } from "./Fixtures";
import { LabPlan } from "./LabPlan";
import { type Preset, type PresetId, PresetIds, Presets, SuitePresets } from "./Presets";
import { Probe, type StreamLabReport, type StreamLabRun, type StreamLabSpeed, StreamLabSpeeds } from "./Probe";
import { type ProfileId, ProfileIds, Profiles } from "./Profiles";
import { Stream } from "./Stream";

type LabConfig = { fixture: FixtureId; profile: ProfileId; speed: StreamLabSpeed; theme: AiStreamTheme };

type LabStatus = `done` | `error` | `idle` | `running`;

const defaultConfig = {
  fixture: `showcase`,
  profile: `token`,
  speed: `medium`,
  theme: `chat`,
} as const satisfies LabConfig;

const isOneOf =
  <Id extends string>(ids: readonly Id[]) =>
  (value: string | undefined): value is Id =>
    value !== undefined && (ids as readonly string[]).includes(value);

const isFixture = isOneOf(FixtureIds);
const isProfile = isOneOf(ProfileIds);
const isSpeed = isOneOf(StreamLabSpeeds);
const isTheme = isOneOf(AiStreamThemes);
const isPreset = isOneOf(PresetIds);

const parseConfig = (
  fixture: string | undefined,
  profile: string | undefined,
  speed: string | undefined,
  theme: string | undefined,
  fallback: LabConfig,
): LabConfig => ({
  fixture: isFixture(fixture) ? fixture : fallback.fixture,
  profile: isProfile(profile) ? profile : fallback.profile,
  speed: isSpeed(speed) ? speed : fallback.speed,
  theme: isTheme(theme) ? theme : fallback.theme,
});

const answerString = (answers: StaticFormAnswers, key: string): string | undefined => {
  const value = StaticFormValues.singleValue(answers[key]);

  return value === `` ? undefined : value;
};

const configFromAnswers = (
  answers: StaticFormAnswers,
  fallback: LabConfig,
): { config: LabConfig; preset?: PresetId } => {
  const presetRaw = answerString(answers, `preset`) ?? `custom`;

  if (isPreset(presetRaw)) {
    if (presetRaw === `all`) {
      return { config: SuitePresets[0], preset: `all` };
    }

    return { config: Presets[presetRaw], preset: presetRaw };
  }

  return {
    config: parseConfig(
      answerString(answers, `fixture`),
      answerString(answers, `profile`),
      answerString(answers, `speed`),
      answerString(answers, `theme`),
      fallback,
    ),
  };
};

const statusLine = (status: LabStatus, report: StreamLabReport | undefined) => {
  if ((status !== `done` && status !== `error`) || report === undefined) {
    return ``;
  }

  const base = status === `done` ? `Done` : `Error`;

  if (`runs` in report) {
    const okCount = report.runs.filter(item => item.ok).length;
    const total = report.runs.length;

    return report.ok
      ? `${base} · ${okCount}/${total} ok`
      : `${base} · ${report.reason ?? `suite failed`} · ${okCount}/${total}`;
  }

  const verdict = report.ok ? `ok` : (report.reason ?? `fail`);

  return `${base} · ${verdict} · markers ${report.rawMarkers} · regressions ${report.regressions}`;
};

export const useLabState = () => {
  const [config, setConfig] = useState<LabConfig>(defaultConfig);
  const [preset, setPreset] = useState<PresetId | undefined>();
  const [status, setStatus] = useState<LabStatus>(`idle`);
  const [stream, setStream] = useState<AsyncIterable<string> | undefined>();
  const [generationKey, setGenerationKey] = useState(0);
  const [rawMarkers, setRawMarkers] = useState(0);
  const [regressions, setRegressions] = useState(0);
  const [runs, setRuns] = useState<StreamLabRun[] | undefined>();
  const [report, setReport] = useState<StreamLabReport>();
  const abortRef = useRef<AbortController | undefined>(undefined);
  const watchRef = useRef<ReturnType<typeof Probe.watch> | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rawMarkersRef = useRef(rawMarkers);
  const regressionsRef = useRef(regressions);
  const runsRef = useRef(runs);
  const suiteRef = useRef<Preset[] | undefined>(undefined);
  const suiteIndexRef = useRef(0);
  const configRef = useRef(config);
  const activeRef = useRef(false);
  const startWithRef = useRef<(next: LabConfig) => void>(() => undefined);

  rawMarkersRef.current = rawMarkers;
  regressionsRef.current = regressions;
  runsRef.current = runs;
  configRef.current = config;

  const plan = useMemo(() => {
    const defaults = {
      fixture: config.fixture,
      preset: preset ?? `custom`,
      profile: config.profile,
      speed: config.speed,
      theme: config.theme,
    };

    const fields = preset === undefined ? LabPlan.fields : LabPlan.fields.filter(field => field.id === `preset`);

    return { ...LabPlan, fields: fields.map(field => ({ ...field, default: defaults[field.id] })) };
  }, [config, preset]);

  const stopWatch = useCallback(() => {
    watchRef.current?.stop();
    watchRef.current = undefined;
  }, []);

  const abort = useCallback(() => {
    activeRef.current = false;
    abortRef.current?.abort();
    abortRef.current = undefined;
    stopWatch();
  }, [stopWatch]);

  const stop = useCallback(() => {
    abort();
    suiteRef.current = undefined;
    setRuns(undefined);
    runsRef.current = undefined;
    setStream(undefined);
    setReport(undefined);
    setRawMarkers(0);
    rawMarkersRef.current = 0;
    setRegressions(0);
    regressionsRef.current = 0;
    setStatus(current => (current === `running` ? `idle` : current));
  }, [abort]);

  const startWith = useCallback(
    (next: LabConfig) => {
      abort();
      const text = Fixtures[next.fixture];
      const controller = new AbortController();

      activeRef.current = true;
      abortRef.current = controller;

      setConfig(next);
      configRef.current = next;
      setRawMarkers(0);
      rawMarkersRef.current = 0;
      setRegressions(0);
      regressionsRef.current = 0;
      setReport(undefined);
      setStatus(`running`);
      setGenerationKey(key => key + 1);
      setStream(Stream.from({ profile: Profiles[next.profile], signal: controller.signal, text }));
    },
    [abort],
  );

  startWithRef.current = startWith;

  const applyPreset = useCallback(
    (id: PresetId) => {
      setPreset(id);

      if (id === `all`) {
        const [first] = SuitePresets;

        suiteRef.current = [...SuitePresets];
        suiteIndexRef.current = 0;
        setRuns([]);
        runsRef.current = [];
        startWith(first);

        return;
      }

      suiteRef.current = undefined;
      setRuns(undefined);
      runsRef.current = undefined;
      startWith(Presets[id]);
    },
    [startWith],
  );

  const submit = useCallback(
    (answers: StaticFormAnswers) => {
      const parsed = configFromAnswers(answers, configRef.current);

      if (parsed.preset !== undefined) {
        applyPreset(parsed.preset);

        return;
      }

      setPreset(undefined);
      suiteRef.current = undefined;
      setRuns(undefined);
      runsRef.current = undefined;
      startWith(parsed.config);
    },
    [applyPreset, startWith],
  );

  const complete = useCallback(
    (text: string) => {
      if (!activeRef.current) {
        return;
      }

      stopWatch();
      abortRef.current = undefined;

      const { fixture } = configRef.current;

      const entry = Probe.finish({
        expected: Fixtures[fixture],
        finalText: text,
        rawMarkers: rawMarkersRef.current,
        regressions: regressionsRef.current,
        root: rootRef.current ?? undefined,
        shape: FixtureShapes[fixture],
      });

      const suite = suiteRef.current;

      if (suite !== undefined) {
        const nextRuns = [...(runsRef.current ?? []), entry];

        setRuns(nextRuns);
        runsRef.current = nextRuns;
        const index = suiteIndexRef.current + 1;

        suiteIndexRef.current = index;

        if (index < suite.length) {
          const following = suite[index];

          if (following !== undefined) {
            queueMicrotask(() => startWithRef.current(following));
          }

          return;
        }

        suiteRef.current = undefined;
        activeRef.current = false;
        const ok = nextRuns.every(item => item.ok);
        const failed = nextRuns.find(item => !item.ok);

        setStatus(ok ? `done` : `error`);
        setReport(
          ok ? { ok: true, runs: nextRuns } : { ok: false, reason: failed?.reason ?? `suite failed`, runs: nextRuns },
        );

        return;
      }

      activeRef.current = false;
      setStatus(entry.ok ? `done` : `error`);
      setReport(entry);
    },
    [stopWatch],
  );

  useEffect(() => {
    if (status !== `running` || stream === undefined) {
      return undefined;
    }

    const root = rootRef.current;

    if (root === null) {
      return undefined;
    }

    stopWatch();
    watchRef.current = Probe.watch({
      onMarkerHit: () => {
        setRawMarkers(current => {
          const next = current + 1;

          rawMarkersRef.current = next;

          return next;
        });
      },
      onRegression: () => {
        setRegressions(current => {
          const next = current + 1;

          regressionsRef.current = next;

          return next;
        });
      },
      root,
    });

    return () => {
      stopWatch();
    };
  }, [generationKey, status, stopWatch, stream]);

  useEffect(
    () => () => {
      stop();
    },
    [stop],
  );

  const reportJson = Probe.toJson(report);
  const copyReport = async () => Copy.text(reportJson);
  const reportReady = report !== undefined;
  const reportOk = report?.ok;
  const running = status === `running`;
  const statusText = statusLine(status, report);
  const statusOk = reportOk === undefined ? undefined : reportOk ? `true` : `false`;
  const { speed, theme } = config;
  const typeWriterSpeed = speed === `stream` ? undefined : speed;

  return {
    complete,
    copyReport,
    generationKey,
    plan,
    reportJson,
    reportReady,
    rootRef,
    running,
    status,
    statusOk,
    statusText,
    stop,
    stream,
    submit,
    theme,
    typeWriterSpeed,
  };
};
