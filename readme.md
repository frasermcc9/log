# @frasermcc/log

A super simple log.

[![npm][[image](https://img.shields.io/npm/v/@frasermcc/log?color=%20%2323b84b&style=for-the-badge)]][https://www.npmjs.com/package/@frasermcc/log]


```
npm i @frasermcc/log
```

# Usage

```ts

import Log, { Level } from "@frasermcc/log";

// Set log level to trace
Log.level(Level.TRACE);

// White text.
Log.trace("Hello World");

// Green text.
Log.info("Hello World");

// Yellow text.
Log.warn("Hello World");

// Red text.
// Will print a stack trace.
Log.error("Hello World");

// White text on red background.
// Will print a stack trace.
// Will exit the application.
Log.critical("Hello World");

```

General output format is as follows:
```
[1:37:58 AM]  [INFO]      Hello World
[1:37:58 AM]  [WARN]      Hello World
[1:37:58 AM]  [ERROR]     Hello World
    at Function.Log.error (D:\Projects\f-log\src\index.ts:72:27)
    etc...
```

# Other Utilities

## Trace

The @Trace decorator can be used on class methods as follows:
```ts
class Test {
  @Trace()
  public test(a: any, b: any) {
    return "hello!";
  }
}

new Test().test(5, { a: 5 });
```

with the output:
```
[2:04:35 AM]  [TRACE]     [Test] test(args) => result in 0.0130ms.
  Arguments: [ 5, { a: 5 } ]
  Returns: hello!
```

Note that the log level of the @Trace decorator is set to TRACE by default. It can be changed by passing a Level to the decorator:

```ts
@Trace(Level.INFO)
```

## Block

The Log#block(message, color) method can be used to print a block of text.

```ts
import Log, { chalk } from ".";

Log.block("Hello", chalk.blue);
```

with the output:
```
  _   _      _ _
 | | | | ___| | | ___
 | |_| |/ _ \ | |/ _ \
 |  _  |  __/ | | (_) |
 |_| |_|\___|_|_|\___/
```
