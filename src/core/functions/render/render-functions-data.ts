"use-strict";
import { IdType, EachDynamicNodeComponentType } from "../../../types/types";

export const renderFunctionsData = (
  updateFunction: (
    name: string,
    key: string,
    id: IdType,
    index: number,
    isRender?: boolean,
    currentComponent?: EachDynamicNodeComponentType
  ) => void,
  id: IdType,
  functions: any,
  index: number,
  isRender?: boolean,
  currentComponent?: EachDynamicNodeComponentType
): void => {
  for (let i = 0; i < functions.length; i++) {
    const { key, value } = functions[i];
    updateFunction(key, value, id, index, isRender, currentComponent);
  }
};
