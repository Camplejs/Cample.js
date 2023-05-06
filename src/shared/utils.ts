"use strict";
import {
  DataAttributesArrayType,
  ElementsType,
  ExportCampleDataType,
  ExportDataValueType,
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
export const equalArrayCondition = (arr1: any, arr2: any) => {
  return Array.isArray(arr1) && Array.isArray(arr2);
};
export const cloneObject = (obj1: object) => {
  return JSON.parse(JSON.stringify(obj1));
};
export const isValuesEqual = (val: any, newVal: any): boolean => {
  if (val === newVal) return true;
  if (typeof val !== typeof newVal) return false;

  if (val === null || newVal === null) {
    return val === newVal;
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
const getRegexKeys = (
  text: string,
  arr: ArrayStringType,
  arr1: ArrayStringType,
  isFunction = true
) => {
  text.replace(regex, (str, d) => {
    const key = d.trim();
    if (key.includes("(") || key.includes(")")) {
      if (!isFunction) createError("Function key includes only in event attr");
      if (
        (key.includes("(") && !key.includes(")")) ||
        (!key.includes("(") && key.includes(")"))
      ) {
        createError(`Function key includes "(" and ")"`);
      } else {
        arr1.push(key);
      }
    } else {
      arr.push(key);
    }
    return str;
  });
};
export const filterDuplicate = (arr: Array<any>) => {
  return arr.filter((item, index) => {
    return arr.indexOf(item) === index;
  });
};
export const getAttrKeys = (
  el: Element
): [ArrayStringType, ArrayStringType] => {
  if (el) {
    const arrAttr = Array.from(el.attributes);
    const textAttr = arrAttr
      .map((attr) => attr.value)
      .join()
      .trim();
    const attrArray: ArrayStringType = [];
    const attrEventArray: ArrayStringType = [];
    getRegexKeys(textAttr, attrArray, attrEventArray);
    return [filterDuplicate(attrArray), attrEventArray];
  }
  return [[], []];
};
export const getTextKeys = (el: Element): ArrayStringType => {
  if (el) {
    const textArray: ArrayStringType = [];
    const arrText = getTextArray(Array.from(el.childNodes));
    const text = arrText
      .map((n) => n.textContent)
      .join()
      .trim();
    getRegexKeys(text, textArray, [], false);
    return filterDuplicate(textArray);
  }
  return [];
};
export const getKeys = (el: Element) => {
  const attrArray: [ArrayStringType, ArrayStringType] = getAttrKeys(el);
  const textArray: ArrayStringType = getTextKeys(el);
  const arr: ArrayStringType = concatArrays(textArray, attrArray[0]);
  return [filterDuplicate(arr), filterDuplicate(attrArray[1])];
};

export const getExportData = (
  obj1: ExportCampleDataType,
  obj2: ExportDataType,
  index: ExportIdType
): ExportCampleDataType => {
  const result = obj1;
  if (checkObject(obj2)) {
    Object.keys(obj2).forEach((key, i) => {
      if (!result.hasOwnProperty(key)) {
        const valueData: ExportDataValueType = {
          value: {},
          components: []
        };
        result[key] = valueData;
      }
      const cloneVal = obj2[key];
      result[key].value[index] = cloneVal;
    });
  } else {
    createError("Export data is object");
  }
  return result;
};

export const concatObjects = (obj1: object, obj2: object) => {
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

export const testValuesRegex = (key: string) => {
  const newRegex = /\[+(.*?)\]+/g;
  const newKey = key.replace(/\s+/g, "");
  const isValues = newRegex.test(newKey);
  return isValues;
};

export const testExportRegex = (text: string) => {
  let isExport = false;
  const newText = text.replace(/\s+/g, "");
  newText.replace(/\{{{(.*?)}}}/g, (str, d) => {
    const key = d.trim();
    if (key) isExport = true;
    return str;
  });
  return isExport;
};
export const testEventKey = (key: string) => {
  return key.includes(":") && key[0] === ":";
};
export const getEventAttrs = (el: Element) => {
  const eventAttrs: ArrayStringType = [];
  if (el) {
    const attrs = Array.from(el.attributes);
    attrs.forEach((e) => {
      if (testEventKey(e.name)) {
        eventAttrs.push(e.name);
      }
    });
  }
  return eventAttrs;
};

export const getDynamicElements = (
  e: Element,
  isExport = false
): ElementsType => {
  const els: ElementsType = [];
  if (e) {
    const getDynamicEls = (child: Element) => {
      const arrayText = isExport
        ? []
        : getTextArray(Array.from(child.childNodes));
      const regexAttr = isExport
        ? Array.from(child.attributes)
            .filter((attr) => {
              return (
                attr.name === "data-cample-import" &&
                testExportRegex(attr.value)
              );
            })
            .map((attr) => attr.value)
        : Array.from(child.attributes)
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

export const getArrImportString = (
  obj: ImportObjectType | undefined,
  index: number
) => {
  if (obj && obj.value && Array.isArray(obj.value)) {
    obj.value = obj.value.map((val) => val.replace(/\s+/g, ""));
    const importString = obj.value.join(";");
    const importObj: ImportObjectStringType = {
      import: importString,
      exportId: obj.exportId,
      index,
      importIndex: obj.importIndex
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
