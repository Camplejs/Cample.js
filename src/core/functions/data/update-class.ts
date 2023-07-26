"use-strict";
import { checkObject } from "../../../shared/utils";
import {
  DynamicEl,
  CurrentKeyType,
  ClassType,
  ArrayStringType
} from "../../../types/types";

const addClass = DOMTokenList.prototype.add;
const removeClass = DOMTokenList.prototype.remove;
const { push } = Array.prototype;

export const updateClass = (
  el: DynamicEl,
  value: ClassType,
  getValue?: (key: CurrentKeyType) => any
) => {
  if (el && getValue) {
    const { oldClassList, classList } = value;
    const list = el.classList;
    const currentClass: ArrayStringType = [];
    classList.forEach((e) => {
      const isObj = checkObject(e);
      if (isObj) {
        const newClasses = getValue(e as CurrentKeyType) as ArrayStringType;
        if ((e as CurrentKeyType).isValue) {
          newClasses.forEach((newClass) => {
            if (!currentClass.includes(newClass))
              push.call(currentClass, newClass);
            if (!oldClassList.includes(newClass)) {
              addClass.call(list, newClass);
            }
          });
        } else {
          const arr = (newClasses as unknown as string)
            .trim()
            .replace(/\s+/g, " ")
            .split(" ");
          arr.forEach((newClass) => {
            if (!currentClass.includes(newClass))
              push.call(currentClass, newClass);
            if (!oldClassList.includes(newClass)) {
              addClass.call(list, newClass);
            }
          });
        }
      } else {
        const newClass = e as string;
        if (!currentClass.includes(newClass)) push.call(currentClass, newClass);
        if (!oldClassList.includes(newClass)) {
          addClass.call(list, newClass);
        }
      }
    });
    oldClassList.forEach((oldClass) => {
      if (!currentClass.includes(oldClass)) {
        removeClass.call(list, oldClass);
      }
    });
    value.oldClassList = currentClass as ArrayStringType;
  }
};
