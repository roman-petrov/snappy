/* eslint-disable require-atomic-updates */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { _, Timer } from "@snappy/core";

export type CronJob = { run: (lastRunTime: number | undefined) => Promise<void> };

export const Cron = () => {
  const jobs: { job: CronJob; lastRunTime: number | undefined }[] = [];

  const tick = async () => {
    const now = _.now();
    await Promise.all(
      jobs.map(async entry => {
        await entry.job.run(entry.lastRunTime);
        entry.lastRunTime = now;
      }),
    );
  };

  Timer.interval(tick, _.minute);

  const addJob = (job: CronJob) => {
    jobs.push({ job, lastRunTime: undefined });
  };

  return { addJob };
};
