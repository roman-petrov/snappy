const utc = Date.UTC;
const { now } = Date;

const date = (timestamp: number) => {
  const dateObject = new Date(timestamp);

  return utc(dateObject.getUTCFullYear(), dateObject.getUTCMonth(), dateObject.getUTCDate());
};

const time = (timestamp: number) => timestamp - date(timestamp);

export const DateTime = { date, now, time, utc };
