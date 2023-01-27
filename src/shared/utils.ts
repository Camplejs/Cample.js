"use strict";

import { ArrayStringType, DynamicTextArrayType } from "../types/types";

const regex = /\{{(.*?)}}/g;

export const createError = (text: string): Error => {
  throw new Error(text);
};

export const testRegex = (text: string): boolean => {
  return regex.test(text);
};

export const isValuesEqual = (val: any, newVal: any): boolean => {
  if (val === newVal) return true;
  if (typeof val !== typeof newVal) return false;
  const equalArrayCondition = (arr1: any, arr2: any) => {
    return Array.isArray(arr1) && Array.isArray(arr2);
  };
  const equalObjectCondition = (val1: any, val2: any) => {
    return (
      typeof val1 === "object" &&
      !Array.isArray(val1) &&
      val1 !== null &&
      typeof val2 === "object" &&
      !Array.isArray(val2) &&
      val2 !== null
    );
  };
  if (val === null || newVal === null) {
    if (val === newVal) {
      return true;
    } else {
      false;
    }
  }
  if (
    val !== newVal &&
    !equalObjectCondition(val, newVal) &&
    !equalArrayCondition(val, newVal)
  ) {
    return false;
  }
  const equalArray = (arr1: Array<any>, arr2: Array<any>) => {
    return (
      arr1.length === arr1.length &&
      arr1.every((value, index) => value === arr2[index])
    );
  };
  if (Array.isArray(val) && Array.isArray(newVal)) {
    return equalArray(val, newVal);
  }
  for (const prop in val) {
    if (val.hasOwnProperty(prop)) {
      if (!isValuesEqual(val[prop], newVal[prop])) {
        return false;
      }
    }
  }
  for (const prop in newVal) {
    if (newVal.hasOwnProperty(prop)) {
      if (!isValuesEqual(val[prop], newVal[prop])) {
        return false;
      }
    }
  }
  return true;
};

export const cloneElement = (node: Node) => {
  const elWrapper = document.createElement("template");
  elWrapper.appendChild(node.cloneNode(true));
  return elWrapper.children[0];
};

export const testKeyRegex = (text: string, equalKey: string): boolean => {
  const values: ArrayStringType = [];
  text.replace(regex, (str, d) => {
    const key = d.trim();
    if (equalKey === key) {
      values.push(key);
    }
    return str;
  });
  return !!values.length;
};
export const getTextArray = (arr: Array<ChildNode>) => {
  return arr.filter(
    ({ nodeType, textContent }) =>
      nodeType === Node.TEXT_NODE && textContent?.trim() !== ""
  );
};

export const concatArrays = (arr1: Array<any>, arr2: Array<any>) => {
  return arr1.concat(arr2.filter((item) => arr1.indexOf(item) < 0));
};
export const filterKey = (
  arr: DynamicTextArrayType,
  key: string
): DynamicTextArrayType => {
  return arr.filter((val) => val.key === key);
};
const getRegexKeys = (text: string, arr: ArrayStringType) => {
  text.replace(regex, (str, d) => {
    const key = d.trim();
    arr.push(key);
    return str;
  });
};
export const filterDuplicate = (arr: Array<any>) => {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
};
export const getAttrKeys = (el: Element) => {
  if (el) {
    const arrAttr = Array.from(el.attributes);
    const textAttr = arrAttr
      .map((attr) => attr.value)
      .join()
      .trim();
    const attrArray: ArrayStringType = [];
    getRegexKeys(textAttr, attrArray);
    return filterDuplicate(attrArray);
  }
  return [];
};
export const getTextKeys = (el: Element) => {
  if (el) {
    const textArray: ArrayStringType = [];
    const arrText = getTextArray(Array.from(el.childNodes));
    const text = arrText
      .map((n) => n.textContent)
      .join()
      .trim();
    getRegexKeys(text, textArray);
    return filterDuplicate(textArray);
  }
  return [];
};
export const getKeys = (el: Element) => {
  const attrArray: ArrayStringType = getAttrKeys(el);
  const textArray: ArrayStringType = getTextKeys(el);
  const arr: ArrayStringType = concatArrays(textArray, attrArray);
  return filterDuplicate(arr);
};

export const getDynamicElements = (e: Element): Element[] => {
  const els: Array<Element> = [];
  if (e) {
    for (const child of e.getElementsByTagName("*")) {
      const arrayText = getTextArray(Array.from(child.childNodes));
      const regexAttr = Array.from(child.attributes)
        .map((attr) => attr.value)
        .filter((a) => testRegex(a));
      if (
        (arrayText.length &&
          testRegex(
            arrayText
              .map((n) => n.textContent)
              .join()
              .trim()
          )) ||
        regexAttr.length
      ) {
        if (els.indexOf(child) < 0) {
          els.push(child);
        }
      }
    }
  }
  return els;
};
