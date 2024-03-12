"use-strict";

import { getKey } from "../../../shared/utils";
import { ArgumentsArrayType, EventFunctionType } from "../../../types/types";
import { renderComponentDynamicKey } from "../render/render-component-dynamic-key";
import { renderKey } from "../render/render-key";

export const renderListeners = (
  el: Element,
  fn: EventFunctionType,
  args: ArgumentsArrayType,
  key: string,
  getEventsData: any,
  isEach?: boolean,
  valueName?: string
) => {
  if (el) {
    let eventFn: any;
    if (isEach !== undefined) {
      const currentArgs = args.map((e) => {
        return {
          key: e,
          renderedKey: renderComponentDynamicKey(renderKey(e)),
          isValueKey: getKey(e) === valueName
        };
      });
      eventFn = () => {
        const newArgs = currentArgs.map(({ key, renderedKey, isValueKey }) =>
          getEventsData(key, renderedKey, isValueKey)
        );
        fn().apply(this, newArgs);
      };
    } else {
      eventFn = () => {
        const newArgs = args.map((e) => getEventsData(e));
        fn().apply(this, newArgs);
      };
    }
    el.addEventListener(key, eventFn);
  }
};
