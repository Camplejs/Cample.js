"use-strict";
export const renderData = (data: any, index: number): any => {
  if (typeof data === "undefined") return undefined;
  if (Array.isArray(data)) return data[index];
  if (typeof data === "object" && data && !Array.isArray(data)) {
    if (data.value !== undefined || data.defaultValue !== undefined) {
      let returnValue = data;
      if (data.defaultValue !== undefined) {
        if (Array.isArray(data.defaultValue)) {
          returnValue = data.defaultValue[index];
        } else {
          returnValue = data.defaultValue;
        }
      }
      if (data.value !== undefined) {
        if (Array.isArray(data.value)) {
          if (data.value[index]) {
            returnValue = data.value[index];
          } else if (returnValue === data) {
            returnValue = undefined;
          }
        } else {
          returnValue = data.value;
        }
      }
      return returnValue;
    } else return data;
  }
  return data;
};
