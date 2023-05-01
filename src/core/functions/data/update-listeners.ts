"use-strict";

import {
  ArgumentsArrayType,
  EventEachGetDataType,
  EventFunctionType,
  EventGetDataType
} from "../../../types/types";

export const updateListeners = (
  el: Element,
  fn: EventFunctionType,
  args: ArgumentsArrayType,
  key: string,
  getEventsData: (key: string) => EventGetDataType | EventEachGetDataType,
  isFirst = true
) => {
  if (el) {
    if (isFirst) {
      el.addEventListener(key, () => {
        const newArgs = args.map((e) => getEventsData(e));
        fn.apply(this, newArgs);
      });
    }
  }
};
