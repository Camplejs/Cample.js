"use-strict";
import { DataType } from "../../../types/types";

export const renderData = (
  template: string,
  data: DataType | undefined,
  index: number,
  returnValueFunction: (key: string) => any | undefined
): string => {
  if (typeof data === "undefined") return template;
  const regex = /\{{(.*?)}}/g;
  template = template.replace(regex, (str, d) => {
    const key = d.trim();
    if (Array.isArray(data[key])) return data[key][index];
    if (
      typeof data[key] === "object" &&
      data[key] &&
      !Array.isArray(data[key])
    ) {
      if (
        data[key].value !== undefined ||
        data[key].defaultValue !== undefined
      ) {
        let returnValue = data[key];
        if (data[key].defaultValue !== undefined) {
          if (Array.isArray(data[key].defaultValue)) {
            returnValue = returnValueFunction(key).defaultValue[index];
          } else {
            returnValue = returnValueFunction(key).defaultValue;
          }
        }
        if (data[key].value !== undefined) {
          if (Array.isArray(data[key].value)) {
            if (data[key].value[index]) {
              returnValue = returnValueFunction(key).value[index];
            } else if (returnValue === data[key]) {
              returnValue = undefined;
            }
          } else {
            returnValue = returnValueFunction(key).value;
          }
        }
        return returnValue;
      } else return data[key];
    }
    return data[key];
  });
  return template;
};
