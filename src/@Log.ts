import { performance } from "perf_hooks";
import Log, { Level } from ".";

export default function Trace(withLevel: Level = Level.TRACE) {
  return function (
    target: Object,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor
  ) {
    const method = propertyDescriptor.value;
    propertyDescriptor.value = function (...args: any[]) {
      const start = performance.now();
      const result = method.apply(this, args);
      const end = performance.now();
      const time = (end - start).toPrecision(3);

      Log.dynamicLog(
        `[${target.constructor.name}] ${propertyName}(args) => result in ${time} ms.`,
        withLevel
      );

      if (Log.requireLevel(withLevel)) {
        console.groupCollapsed();

        Log.logAndPersist("Arguments:", { extraArgs: args });
        Log.logAndPersist("Returns:", { extraArgs: result });
        console.groupEnd();
      }

      return result;
    };
  };
}
