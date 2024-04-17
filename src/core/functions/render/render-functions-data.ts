"use-strict";
import { IdType } from "../../../types/types";

export const renderFunctionsData = (
  updateFunction: (
    name: string,
    key: string,
    id: IdType,
    index: number,
    currentComponent?: any
  ) => void,
  id: IdType,
  functions: any,
  index: number,
  currentComponent?: any
): void => {
  for (let i = 0; i < functions.length; i++) {
    const { key, value } = functions[i];
    updateFunction(key, value, id, index, currentComponent);
  }
};
