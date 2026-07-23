import { AiStream } from "@snappy/ai-stream";
import { Button, Card, IconButton, Page, StaticForm, Text } from "@snappy/ui";
import { Copy, Square } from "lucide-react";

import type { useLabState } from "./Lab.state";

import styles from "./Lab.module.scss";

export type LabViewProps = ReturnType<typeof useLabState>;

export const LabView = ({
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
}: LabViewProps) => (
  <Page fill title="AiStream Lab">
    <div className={styles.root}>
      {statusText === `` ? (
        <div aria-hidden data-ok={statusOk} data-status={status} data-testid="stream-lab-status" hidden />
      ) : (
        <Text
          as="div"
          cn={styles.status}
          data-ok={statusOk}
          data-status={status}
          data-testid="stream-lab-status"
          text={statusText}
          typography="captionSm"
        />
      )}
      {running ? <Button icon={Square} onClick={stop} tag="stream-lab-stop" text="Stop" /> : undefined}
      {running ? undefined : (
        <StaticForm key={generationKey} onSubmit={submit} plan={plan} submitTag="stream-lab-start" submitText="Start" />
      )}
      {stream === undefined ? (
        <div aria-hidden data-testid="stream-root" hidden ref={rootRef} />
      ) : (
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
      )}
      {reportReady ? (
        <Card cn={styles.report}>
          <div className={styles.reportHeader}>
            <IconButton icon={Copy} onClick={copyReport} tag="stream-lab-copy" tip="Copy" />
          </div>
          <pre className={styles.reportJson} data-testid="stream-lab-report">
            {reportJson}
          </pre>
        </Card>
      ) : (
        <pre aria-hidden data-testid="stream-lab-report" hidden />
      )}
    </div>
  </Page>
);
