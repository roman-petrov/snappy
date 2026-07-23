import { AiStream } from "@snappy/ai-stream";
import { Button, Card, Page, Spoiler, StaticForm } from "@snappy/ui";
import { Copy, RotateCcw, Square } from "lucide-react";

import type { useLabState } from "./Lab.state";

import styles from "./Lab.module.scss";

export type LabViewProps = ReturnType<typeof useLabState>;

export const LabView = ({
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
}: LabViewProps) => (
  <Page fill title="AiStream Lab">
    <div className={styles.root}>
      <StaticForm key={generationKey} onSubmit={submit} plan={plan} submitText="Start" />
      {stream === undefined ? undefined : (
        <>
          <div className={styles.actions}>
            <Button disabled={!running} icon={Square} onClick={stop} text="Stop" />
            <Button disabled={running} icon={RotateCcw} onClick={replay} text="Replay" />
          </div>
          <Card cn={styles.stream}>
            <div data-testid="stream-root" ref={rootRef}>
              <AiStream
                generationKey={generationKey}
                key={generationKey}
                onComplete={complete}
                stream={stream}
                theme={theme}
                typeWriterSpeed={typeWriterSpeed}
              />
            </div>
          </Card>
        </>
      )}
      <Spoiler summary={`Report · ${statusText}`}>
        <Card cn={styles.report}>
          <div className={styles.reportHeader}>
            <Button disabled={!reportReady} icon={Copy} onClick={copyReport} text="Copy" />
          </div>
          <pre className={styles.reportJson} data-testid="stream-lab-report">
            {reportJson}
          </pre>
        </Card>
      </Spoiler>
    </div>
  </Page>
);
