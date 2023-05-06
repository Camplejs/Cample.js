"use strict";

import { checkObject, createError } from "../../../shared/utils";
import { ValuesValueType } from "../../../types/types";

export const renderValues = (
  key: string,
  valuesObject: ValuesValueType
): [any, boolean] => {
  let resultData: any = "";
  const newKey = key.replace(/\s+/g, "");
  const regex = /\[+(.*?)\]+/g;
  let valuesKey = "";
  newKey.replace(regex, (str, d) => {
    const key = d.trim();
    valuesKey = key;
    return str;
  });
  if (checkObject(valuesObject) && valuesObject.hasOwnProperty(valuesKey)) {
    const values = valuesObject[valuesKey];
    if (Object.keys(values).length) {
      Object.entries(values).forEach(([valueKey, value]) => {
        if (value) {
          if (typeof valueKey === "string") {
            resultData += valueKey;
          } else createError("Value name type is string");
        }
      });
    }
  } else createError("Values error");
  const result: [any, boolean] = [resultData, false];
  return result;
};
