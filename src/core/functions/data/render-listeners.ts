"use-strict";

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
    el.addEventListener(key, () => {
      const newArgs = args.map((e) => getEventsData(e));
      fn().apply(this, newArgs);
    });
  }
};
