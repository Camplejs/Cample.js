"use strict";

import { checkObject, createError } from "../../../shared/utils";
import { ValuesValueType } from "../../../types/types";

const { push } = Array.prototype;

export const renderValues = (
  key: string,
  valuesObject: ValuesValueType,
  isClass?: boolean
): [any, boolean] => {
  let resultData: any = isClass ? [] : "";
  if (checkObject(valuesObject) && valuesObject.hasOwnProperty(key)) {
    const values = valuesObject[key];
    Object.entries(values).forEach(([valueKey, value]) => {
      if (value) {
        if (typeof valueKey === "string") {
          isClass ? push.call(resultData, valueKey) : (resultData += valueKey);
        } else createError("Value name type is string");
      }
    });
  } else createError("Values error");
  const result: [any, boolean] = [resultData, false];
  return result;
};
