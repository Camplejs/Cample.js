"use-strict";
import { checkObject } from "../../../shared/utils";
import {
  DynamicEl,
  CurrentKeyType,
  ClassType,
  ObjClassListType
} from "../../../types/types";

const addClass = DOMTokenList.prototype.add;
const removeClass = DOMTokenList.prototype.remove;

export const updateClass = (
  el: DynamicEl,
  value: ClassType,
  getValue?: (key: CurrentKeyType) => any
) => {
  if (el && getValue) {
    let { oldClassList, classList } = value;
    const list = el.classList;
    let currentClass = {};
    classList.forEach((e) => {
      const isObj = checkObject(e);
      if (isObj) {
        let newClasses = getValue(e as CurrentKeyType) as ObjClassListType;
        if ((e as CurrentKeyType).isValue) {
          for (const newClass in newClasses) {
            if (!(newClass in currentClass)) currentClass[newClass] = null;
            if (!(newClass in oldClassList)) {
              addClass.call(list, newClass);
            }
          }
        } else {
          const arr = (newClasses as unknown as string)
            .trim()
            .replace(/\s+/g, " ")
            .split(" ");
          for (const i in arr) {
            if (!(arr[i] in currentClass)) currentClass[arr[i]] = null;
            if (!(arr[i] in oldClassList)) {
              addClass.call(list, arr[i]);
            }
          }
        }
      } else {
        const newClass = e as string;
        if (!(newClass in currentClass)) currentClass[newClass] = null;
        if (!(newClass in oldClassList)) addClass.call(list, newClass);
      }
    });
    for (const oldClass in oldClassList) {
      if (!(oldClass in currentClass)) {
        removeClass.call(list, oldClass);
      }
    }
    value.oldClassList = currentClass as ObjClassListType;
  }
};
