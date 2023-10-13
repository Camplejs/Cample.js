"use-strict";

import { CLICK_FUNCTION_NAME } from "../../../config/config";
import {
  ArgumentsArrayType,
  EventEachGetDataType,
  EventFunctionType,
  EventGetDataType
} from "../../../types/types";

export const renderListeners = (
  el: Element,
  fn: EventFunctionType,
  args: ArgumentsArrayType,
  key: string,
  getEventsData: (key: string) => EventGetDataType | EventEachGetDataType
) => {
  if (el) {
    const eventFn = () => {
      const newArgs = args.map((e) => getEventsData(e));
      fn().apply(this, newArgs);
    };
    if (key === "click") {
      el[CLICK_FUNCTION_NAME] = eventFn;
    } else {
      el.addEventListener(key, eventFn);
    }
  }
};
