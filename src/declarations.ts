export enum Level {
  TRACE = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  CRITICAL = 4,
  OFF = 5,
}

export interface LogArgs {
  msg: string;
  src?: string;
  error?: Error;
  severity: Level;
}

export const MAX_PAD = 8;
export const TIME_LENGTH = 11;
