"use strict";

export const createError = (text: string): Error => {
  throw new Error(text);
};

export const testRegex = (text: string): boolean => {
  const regex = /\{{(.*?)}}/g;
  return regex.test(text);
};

export const isValuesEqual = (val: any, newVal: any): boolean => {
  const recursive = (val1: any, val2: any) => {
    if (val1 === val2) return true;
    if (val1 && val2) {
      const isVal1Object = typeof val1 == "object";
      const isVal2Object = typeof val2 == "object";
      if (isVal1Object && isVal2Object) {
        const val1Constructor = val1.constructor;
        const val2Constructor = val2.constructor;
        if (val1Constructor !== val2Constructor) return false;
        if (Array.isArray(val1)) {
          if (val1.length != val2.length) return false;
          for (let i = val1.length; i !== 0; i--) {
            if (!recursive(val1[i], val2[i])) return false;
          }
          return true;
        }
        if (val1Constructor === RegExp)
          return val1.source === val2.source && val1.flags === val2.flags;
        if (val1.valueOf !== Object.prototype.valueOf)
          return val1.valueOf() === val2.valueOf();
        if (val1.toString !== Object.prototype.toString)
          return val1.toString() === val2.toString();
        const keys1 = Object.keys(val1);
        const keys2 = Object.keys(val2);
        const keys1Length = keys1.length;
        const keys2Length = keys2.length;
        if (keys1Length !== keys2Length) return false;
        for (let i = keys1Length; i !== 0; i--) {
          if (!Object.prototype.hasOwnProperty.call(val2, keys1[i]))
            return false;
        }
        for (let i = keys1Length; i !== 0; i--) {
          if (!recursive(val1[keys1[i]], val2[keys1[i]])) return false;
        }
        return true;
      }
    }
    return val1 !== val1 && val2 !== val2;
  };
  return recursive(val, newVal);
};

export const getTextArray = (arr: Array<ChildNode>) => {
  return arr.filter(
    ({ nodeType, textContent }) =>
      nodeType === Node.TEXT_NODE && textContent?.trim() !== ""
  );
};
