"use-strict";

import { addClass, removeClass } from "../../../config/config";
import { CurrentKeyType, ClassType } from "../../../types/types";

export const updateClass = (
  el: Element,
  value: ClassType,
  getValue: (key: CurrentKeyType) => any
) => {
  const { oldClassList, classList, oldClassListString } = value;
  const val = getValue(classList[0] as CurrentKeyType) as string;
  const str = val;
  if (str !== oldClassListString) {
    const list = el.classList;
    if (!str) {
      for (const oldClass of oldClassList) {
        removeClass.call(list, oldClass);
      }
      value.oldClassList = [];
      value.oldClassListString = "";
    } else {
      const newClasses = str.split(" ");
      for (const newClass of newClasses) {
        if (!oldClassList.includes(newClass)) {
          addClass.call(list, newClass);
        }
      }
      for (const oldClass of oldClassList) {
        if (!newClasses.includes(oldClass)) {
          removeClass.call(list, oldClass);
        }
      }
      value.oldClassList = newClasses;
      value.oldClassListString = str;
    }
  }
};
