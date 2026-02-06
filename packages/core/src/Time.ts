const secondsPerMinute = 60;
const minutesPerHour = 60;
const millisecondsPerSecond = 1000;
const hourInMs = secondsPerMinute * minutesPerHour * millisecondsPerSecond;
const dayInMs = 24 * hourInMs;

export const Time = { dayInMs, hourInMs, millisecondsPerSecond, minutesPerHour, secondsPerMinute };
