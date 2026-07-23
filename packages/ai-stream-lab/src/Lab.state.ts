import type { AiStreamTheme } from "@snappy/ai-stream";
import type { TypeWriterSpeed } from "@snappy/domain";
import type { StaticFormAnswers } from "@snappy/snappy";

import { Copy } from "@snappy/platform";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { type FixtureId, FixtureIds, Fixtures, FixtureShapes } from "./Fixtures";
import { LabPlan } from "./LabPlan";
import { type Preset, type PresetId, PresetIds, Presets, SuitePresets } from "./Presets";
import { Probe, type StreamLabReport, type StreamLabRun, type StreamLabSpeed } from "./Probe";
import { type ProfileId, ProfileIds, Profiles } from "./Profiles";
import { Stream } from "./Stream";

type LabConfig = { fixture: FixtureId; profile: ProfileId; speed: StreamLabSpeed; theme: AiStreamTheme };

const speeds = [`stream`, `fast`, `medium`, `slow`] as const;

const isFixture = (value: string | undefined): value is FixtureId =>
  value !== undefined && (FixtureIds as readonly string[]).includes(value);

const isProfile = (value: string | undefined): value is ProfileId =>
  value !== undefined && (ProfileIds as readonly string[]).includes(value);

const isSpeed = (value: string | undefined): value is StreamLabSpeed =>
  value !== undefined && (speeds as readonly string[]).includes(value);

const isTheme = (value: string | undefined): value is AiStreamTheme => value === `chat` || value === `reasoning`;

const isPreset = (value: string | undefined): value is PresetId =>
  value !== undefined && (PresetIds as readonly string[]).includes(value);

const queryFixture = (value: string | undefined): FixtureId => (isFixture(value) ? value : `showcase`);
const queryProfile = (value: string | undefined): ProfileId => (isProfile(value) ? value : `token`);
const querySpeed = (value: string | undefined): StreamLabSpeed => (isSpeed(value) ? value : `medium`);
const queryTheme = (value: string | undefined): AiStreamTheme => (isTheme(value) ? value : `chat`);

const fromQuery = (): { config: LabConfig; preset?: PresetId; run: boolean } => {
  const parameters = new URLSearchParams(window.location.search);
  const presetId = parameters.get(`preset`) ?? undefined;

  if (isPreset(presetId) && presetId !== `all`) {
    return { config: Presets[presetId], preset: presetId, run: parameters.get(`run`) === `1` };
  }

  return {
    config: {
      fixture: queryFixture(parameters.get(`fixture`) ?? undefined),
      profile: queryProfile(parameters.get(`profile`) ?? undefined),
      speed: querySpeed(parameters.get(`speed`) ?? undefined),
      theme: queryTheme(parameters.get(`theme`) ?? undefined),
    },
    preset: isPreset(presetId) ? presetId : undefined,
    run: parameters.get(`run`) === `1`,
  };
};

const syncQuery = (config: LabConfig, preset: PresetId | undefined) => {
  const parameters = new URLSearchParams();

  if (preset === undefined) {
    parameters.set(`fixture`, config.fixture);
    parameters.set(`profile`, config.profile);
    parameters.set(`speed`, config.speed);
    parameters.set(`theme`, config.theme);
  } else {
    parameters.set(`preset`, preset);
  }

  const next = `${window.location.pathname}?${parameters.toString()}`;

  if (next !== `${window.location.pathname}${window.location.search}`) {
    history.replaceState(undefined, ``, next);
  }
};

const pace = (speed: StreamLabSpeed): TypeWriterSpeed | undefined => (speed === `stream` ? undefined : speed);

const answerString = (answers: StaticFormAnswers, key: string): string | undefined => {
  const value = answers[key];

  return typeof value === `string` ? value : undefined;
};

const configFromAnswers = (answers: StaticFormAnswers): { config: LabConfig; preset?: PresetId } => {
  const presetRaw = answerString(answers, `preset`) ?? `custom`;

  if (isPreset(presetRaw)) {
    if (presetRaw === `all`) {
      return { config: SuitePresets[0], preset: `all` };
    }

    return { config: Presets[presetRaw], preset: presetRaw };
  }

  return {
    config: {
      fixture: queryFixture(answerString(answers, `fixture`)),
      profile: queryProfile(answerString(answers, `profile`)),
      speed: querySpeed(answerString(answers, `speed`)),
      theme: queryTheme(answerString(answers, `theme`)),
    },
  };
};

const statusLabel = { done: `Done`, error: `Error`, idle: `Idle`, running: `Running` } as const;

export const useLabState = () => {
  const initial = fromQuery();
  const [config, setConfig] = useState(initial.config);
  const [preset, setPreset] = useState<PresetId | undefined>(initial.preset);
  const [status, setStatus] = useState<`done` | `error` | `idle` | `running`>(`idle`);
  const [stream, setStream] = useState<AsyncIterable<string> | undefined>();
  const [generationKey, setGenerationKey] = useState(0);
  const [rawMarkers, setRawMarkers] = useState(0);
  const [runs, setRuns] = useState<StreamLabRun[] | undefined>();
  const [report, setReport] = useState<StreamLabReport>();
  const abortRef = useRef<AbortController | undefined>(undefined);
  const watchRef = useRef<ReturnType<typeof Probe.watch> | undefined>(undefined);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const rawMarkersRef = useRef(rawMarkers);
  const runsRef = useRef(runs);
  const suiteRef = useRef<Preset[] | undefined>(undefined);
  const suiteIndexRef = useRef(0);
  const configRef = useRef(config);
  const presetRef = useRef(preset);
  const autoRunRef = useRef(initial.run);
  const startWithRef = useRef<(next: LabConfig) => void>(() => undefined);

  rawMarkersRef.current = rawMarkers;
  runsRef.current = runs;
  configRef.current = config;
  presetRef.current = preset;

  const plan = useMemo(() => {
    const defaults = {
      fixture: config.fixture,
      preset: preset ?? `custom`,
      profile: config.profile,
      speed: config.speed,
      theme: config.theme,
    };

    return { ...LabPlan, fields: LabPlan.fields.map(field => ({ ...field, default: defaults[field.id] })) };
  }, [config, preset]);

  const stopWatch = useCallback(() => {
    watchRef.current?.stop();
    watchRef.current = undefined;
  }, []);

  const stop = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = undefined;
    stopWatch();
  }, [stopWatch]);

  const startWith = useCallback(
    (next: LabConfig) => {
      stop();
      const text = Fixtures[next.fixture];
      const controller = new AbortController();

      abortRef.current = controller;

      setConfig(next);
      configRef.current = next;
      setRawMarkers(0);
      rawMarkersRef.current = 0;
      setReport(undefined);
      setStatus(`running`);
      setGenerationKey(key => key + 1);
      setStream(Stream.from({ profile: Profiles[next.profile], signal: controller.signal, text }));
      syncQuery(next, presetRef.current);
    },
    [stop],
  );

  startWithRef.current = startWith;

  const applyPreset = useCallback(
    (id: PresetId) => {
      setPreset(id);
      presetRef.current = id;

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
      const parsed = configFromAnswers(answers);

      setPreset(parsed.preset);
      presetRef.current = parsed.preset;

      if (parsed.preset === `all`) {
        applyPreset(`all`);

        return;
      }

      suiteRef.current = undefined;
      setRuns(undefined);
      runsRef.current = undefined;
      startWith(parsed.config);
    },
    [applyPreset, startWith],
  );

  const replay = useCallback(() => {
    suiteRef.current = undefined;
    setRuns(undefined);
    runsRef.current = undefined;
    startWith(configRef.current);
  }, [startWith]);

  const complete = useCallback(
    (text: string) => {
      stopWatch();
      abortRef.current = undefined;

      const { fixture } = configRef.current;

      const entry = Probe.finish({
        expected: Fixtures[fixture],
        finalText: text,
        rawMarkers: rawMarkersRef.current,
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
        const ok = nextRuns.every(item => item.ok);
        const failed = nextRuns.find(item => !item.ok);

        setStatus(ok ? `done` : `error`);
        setReport(
          ok ? { ok: true, runs: nextRuns } : { ok: false, reason: failed?.reason ?? `suite failed`, runs: nextRuns },
        );

        return;
      }

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
      root,
    });

    return () => {
      stopWatch();
    };
  }, [generationKey, status, stopWatch, stream]);

  useEffect(() => {
    if (!autoRunRef.current) {
      return;
    }

    autoRunRef.current = false;

    if (initial.preset === `all`) {
      applyPreset(`all`);

      return;
    }

    if (initial.preset !== undefined) {
      applyPreset(initial.preset);

      return;
    }

    startWith(initial.config);
  }, [applyPreset, initial.config, initial.preset, startWith]);

  useEffect(
    () => () => {
      stop();
    },
    [stop],
  );

  const reportJson = Probe.toJson(report);
  const copyReport = async () => Copy.text(reportJson);
  const reportReady = report !== undefined;
  const running = status === `running`;
  const statusText = statusLabel[status];
  const { speed, theme } = config;
  const typeWriterSpeed = pace(speed);

  return {
    complete,
    copyReport,
    generationKey,
    plan,
    replay,
    reportJson,
    reportReady,
    rootRef,
    running,
    statusText,
    stop,
    stream,
    submit,
    theme,
    typeWriterSpeed,
  };
};
