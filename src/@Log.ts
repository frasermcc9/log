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

      if (true) {
        Log.dynamicLog(
          `[${target.constructor.name}] ${propertyName}(args) => result in ${time}ms.`,
          withLevel
        );

        if (Log.requireLevel(withLevel)) {
          console.groupCollapsed();
          console?.log("Arguments:", args);
          console?.log("Returns:", result);
          console.groupEnd();
        }
      }

      return result;
    };
  };
}
