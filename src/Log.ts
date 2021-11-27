import chalk from "chalk";
import figlet from "figlet";
import { createWriteStream, WriteStream } from "fs";
import { Level, LogArgs, TIME_LENGTH, MAX_PAD } from "./declarations";

export default class Log {
  private static severity = Level.TRACE;
  private static stream?: WriteStream;

  /**
   * Set the minimum level required for the log to output.
   *
   * @param level the {@link Level} to set the logging to
   */
  static level(level: Level) {
    this.severity = level;
  }

  /**
   * Persist the logs to a file.
   *
   * @param file The name of the file (optional)
   * @returns
   */
  static persist(file: string = Level[this.severity] + ".log") {
    if (this.stream) {
      return console.error("Log#Persist must only be called a single time.");
    }
    this.stream = createWriteStream(file);
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

    this.logAndPersist(Error().stack?.replace(/Error:\s*\n/, "") ?? "", {
      consoleColor: chalk.red,
    });
  }
  static critical(msg: string): void {
    if (!this.requireLevel(Level.CRITICAL)) return;

    this.log({ msg, severity: Level.CRITICAL });
    this.log({
      msg: "This is a fatal error. Terminating Process.",
      severity: Level.CRITICAL,
    });

    this.logAndPersist(Error().stack?.replace(/Error:\s*\n/, "") ?? "", {
      consoleColor: chalk.whiteBright.bgRed,
    });

    if (this.stream) {
      this.stream.once("close", () => {
        process.exit(1);
      });
      this.stream.close();
    } else {
      process.exit(1);
    }
  }

  static block(text: string, color: chalk.Chalk = chalk.whiteBright) {
    this.logAndPersist(figlet.textSync(text), { consoleColor: color });
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

    this.logAndPersist(logBuilder, { consoleColor: color });
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

  static logAndPersist(
    message: string,
    {
      consoleColor,
      extraArgs = [],
    }: { consoleColor?: chalk.Chalk; extraArgs?: any[] }
  ) {
    this.stream?.write(message + extraArgs.toString() + "\n");
    if (consoleColor) {
      console.log(consoleColor(message, extraArgs));
    } else {
      console.log(message, extraArgs);
    }
  }
}
