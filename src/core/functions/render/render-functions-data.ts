"use-strict";
import { DataType, IdType } from "../../../types/types";

export const renderFunctionsData = (
  data: DataType | undefined,
  updateFunction: (
    name: string,
    key: string,
    isRender: boolean,
    index: IdType
  ) => void,
  isRender: boolean,
  index: IdType
): void => {
  if (data !== undefined) {
    for (const key in data) {
      if (
        data[key] &&
        (data[key].value !== undefined ||
          data[key].defaultValue !== undefined) &&
        data[key].function &&
        typeof data[key].function === "string"
      ) {
        updateFunction(data[key].function, key, isRender, index);
      }
    }
  }
};
