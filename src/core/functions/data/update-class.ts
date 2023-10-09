"use-strict";

import { CurrentKeyType, ClassType } from "../../../types/types";

const addClass = DOMTokenList.prototype.add;
const removeClass = DOMTokenList.prototype.remove;

export const updateClass = (
  el: Element,
  value: ClassType,
  getValue: (key: CurrentKeyType) => any
) => {
  const { oldClassList, classList, oldClassListString } = value;
  const val = getValue(classList[0] as CurrentKeyType) as string;
  const str = val;
  if (!(str === oldClassListString)) {
    const newClasses = str.split(" ").filter(Boolean);
    const list = el.classList;
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
};
