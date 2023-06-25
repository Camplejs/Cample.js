"use strict";

import { checkObject, createError } from "../../../shared/utils";
import { ValuesValueType } from "../../../types/types";

export const renderValues = (
  key: string,
  valuesObject: ValuesValueType
): [any, boolean] => {
  let resultData: any = "";
  const regex = /\[+(.*?)\]+/g;
  key = key.replace(regex, (str, d) => d);
  if (checkObject(valuesObject) && valuesObject.hasOwnProperty(key)) {
    const values = valuesObject[key];
    Object.entries(values).forEach(([valueKey, value]) => {
      if (value) {
        if (typeof valueKey === "string") {
          resultData += valueKey;
        } else createError("Value name type is string");
      }
    });
  } else createError("Values error");
  const result: [any, boolean] = [resultData, false];
  return result;
};
