import chalk from "chalk";
import figlet from "figlet";
import { Level, LogArgs, TIME_LENGTH, MAX_PAD } from "./declarations";

export default class Log {
  private static severity = Level.TRACE;

  static level(level: Level) {
    this.severity = level;
  }

  static dynamicLog(msg: string, severity: Level) {
    this.log({ msg, severity });
  }

  static trace(msg: string): void {
    if (!this.requireLevel(Level.TRACE)) return;

    this.log({ msg, severity: Level.TRACE });
  }
  static info(msg: string): void {
    if (!this.requireLevel(Level.INFO)) return;

    this.log({ msg, severity: Level.INFO });
  }
  static warn(msg: string): void {
    if (!this.requireLevel(Level.WARN)) return;

    this.log({ msg, severity: Level.WARN });
  }
  static error(msg: string): void {
    if (!this.requireLevel(Level.ERROR)) return;

    this.log({ msg, severity: Level.ERROR });

    console.log(chalk.red(Error().stack?.replace(/Error:\s*\n/, "")));
  }
  static critical(msg: string): void {
    if (!this.requireLevel(Level.CRITICAL)) return;

    this.log({ msg, severity: Level.CRITICAL });
    this.log({
      msg: "This is a fatal error. Terminating Process.",
      severity: Level.CRITICAL,
    });

    console.log(
      chalk.whiteBright.bgRed(Error().stack?.replace(/Error:\s*\n/, ""))
    );

    process.exit(1);
  }

  static block(text: string, color: chalk.Chalk = chalk.whiteBright) {
    console.log(color(figlet.textSync(text)));
  }

  static requireLevel(level: Level) {
    return level >= this.severity;
  }

  private static log({ msg, severity = Level.TRACE, src = "" }: LogArgs): void {
    const time = new Date().toLocaleTimeString();
    const timePad = " ".repeat(TIME_LENGTH - time.length);

    const severityString = Level[severity];

    const requiredPad = Math.max(0, MAX_PAD - severityString.length);
    const pad = " ".repeat(requiredPad);

    let logBuilder = `[${time}]${timePad} [${severityString}] ${pad} ${msg} `;
    if (src) {
      logBuilder += ` - [${src}]`;
    }

    const color = this.colorResolver(severity);

    console.log(color(logBuilder));
  }

  private static colorResolver(severity: Level) {
    switch (severity) {
      case Level.TRACE:
        return chalk.whiteBright;
      case Level.INFO:
        return chalk.green;
      case Level.WARN:
        return chalk.yellow;
      case Level.ERROR:
        return chalk.red;
      default:
        return chalk.whiteBright.bgRed;
    }
  }
}
