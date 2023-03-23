"use strict";
import {
  DataAttributesArrayType,
  DataType,
  ElementsType,
  ExportIdType,
  ImportObjectStringType,
  ImportObjectType
} from "./../types/types";

import {
  ArrayStringType,
  DynamicTextArrayType,
  ExportDataType
} from "../types/types";

const regex = /\{{(.*?)}}/g;

export const createError = (text: string): Error => {
  throw new Error(text);
};

export const createWarning = (text: string): void => {
  console.warn(text);
};

export const objectEmpty = (obj: object): boolean => {
  return Object.keys(obj).length === 0;
};

export const testRegex = (text: string): boolean => {
  const filterText = text.replace(regex, (str, d) => {
    const key = d.trim();
    if (/^[0-9]+$/.test(key[0])) {
      return "";
    }
    return str;
  });
  return regex.test(filterText);
};
export const checkObject = (val: any) => {
  return typeof val === "object" && !Array.isArray(val) && val !== null;
};
const checkObjectCondition = (val1: any, val2: any) => {
  return (
    typeof val1 === "object" &&
    !Array.isArray(val1) &&
    val1 !== null &&
    typeof val2 === "object" &&
    !Array.isArray(val2) &&
    val2 !== null
  );
};

export const isValuesEqual = (val: any, newVal: any): boolean => {
  if (val === newVal) return true;
  if (typeof val !== typeof newVal) return false;
  const equalArrayCondition = (arr1: any, arr2: any) => {
    return Array.isArray(arr1) && Array.isArray(arr2);
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
    !checkObjectCondition(val, newVal) &&
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

export const getExportData = (
  obj1: ExportDataType,
  obj2: ExportDataType,
  index: ExportIdType
) => {
  const result = obj1;
  if (checkObject(obj2)) {
    Object.keys(obj2).forEach((key, i) => {
      if (!result.hasOwnProperty(key)) {
        result[key] = {};
      }
      const cloneVal = obj2[key];
      result[key][index] = cloneVal;
    });
  } else {
    createError("Export data is object");
  }
  return result;
};

export const concatObjects = (obj1: DataType, obj2: DataType) => {
  const result = obj1;
  if (checkObjectCondition(result, obj2)) {
    Object.entries(obj2).forEach(([key, value]) => {
      if (result.hasOwnProperty(key)) {
        result[key] = value;
      } else {
        result[key] = value;
      }
    });
  } else {
    createError("Export data is object");
  }
  return result;
};

export const checkFunction = (val: any) => {
  return Object.prototype.toString.call(val) === "[object Function]";
};

export const getDynamicElements = (e: Element): ElementsType => {
  const els: ElementsType = [];
  if (e) {
    const getDynamicEls = (child: Element) => {
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
    };
    getDynamicEls(e);
    for (const child of e.getElementsByTagName("*")) {
      getDynamicEls(child);
    }
  }
  return els;
};

export const createEl = (
  selector: string,
  attributes: DataAttributesArrayType
) => {
  const el = document.createElement(selector);
  attributes.forEach(({ selector, value }) => {
    if (value !== undefined && value !== "") el.setAttribute(selector, value);
  });
  return el;
};

export const getArrImportString = (arr: ImportObjectType | undefined) => {
  if (arr && arr.value && Array.isArray(arr.value)) {
    arr.value = arr.value.map((val) => val.replace(/\s+/g, ""));
    const importString = arr.value.join(";");
    const importObj: ImportObjectStringType = {
      import: importString,
      exportId: arr.exportId
    };
    return JSON.stringify(importObj);
  } else {
    createError("Import value is array");
  }
};

export const checkNodes = (template: string): boolean => {
  const el = document.createElement("template");
  el.innerHTML = template;
  return el.content.childNodes.length === 1;
};

export const getElements = (el: Element | null) => {
  const els: Array<Element> = [];
  if (el) {
    const getEl = (el: HTMLCollection) => {
      for (const child of el) {
        els.push(child);
      }
    };
    getEl(
      el instanceof HTMLTemplateElement ? el.content.children : el.children
    );
  }
  return els;
};
export const cloneValue = (value: any): any => {
  if (checkObject(value)) {
    return { ...value };
  } else if (Array.isArray(value)) {
    return [...value];
  } else {
    return value;
  }
};

export const createElement = (template: string) => {
  const elWrapper = document.createElement("template");
  elWrapper.innerHTML = template;
  if (elWrapper.content.children.length > 1) {
    createError("Component include only one node with type 'Element'");
  }
  return elWrapper.content.firstElementChild;
};
