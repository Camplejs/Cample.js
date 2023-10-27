"use-strict";

import { addClass, removeClass } from "../../../config/config";
import { convertStringToObject } from "../../../shared/utils";
import { CurrentKeyType, ClassType } from "../../../types/types";

export const updateClass = (
  list: DOMTokenList,
  value: ClassType,
  getValue: (key: CurrentKeyType) => any
) => {
  const { oldClassList, classList, oldClassListString } = value;
  const val = getValue(classList[0] as CurrentKeyType) as string;
  if (oldClassListString !== val) {
    const newClasses = convertStringToObject(val);
    for (const oldClass in oldClassList) {
      if (!(oldClass in newClasses)) {
        removeClass.call(list, oldClass);
      }
    }
    for (const newClass in newClasses) {
      if (!(newClass in oldClassList)) {
        addClass.call(list, newClass);
      }
    }
    value.oldClassList = newClasses;
    value.oldClassListString = val;
  }
};
