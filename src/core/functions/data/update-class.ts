"use-strict";

import { setAttribute, updClass } from "../../../config/config";
import { ClassType } from "../../../types/types";

export const updateClass = (el: Element, value: ClassType, val: string) => {
  const { old } = value;
  if (old !== val) {
    if (val !== "") {
      updClass.call(el, val);
    } else {
      setAttribute.call(el, "class", "");
    }
    value.old = val;
  }
};
