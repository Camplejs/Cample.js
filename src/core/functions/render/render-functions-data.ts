"use-strict";
import {
  IdType,
  FunctionsObjType,
  EachDynamicNodeComponentType
} from "../../../types/types";

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
  functions: FunctionsObjType | undefined,
  index: number,
  isRender?: boolean,
  currentComponent?: EachDynamicNodeComponentType
): void => {
  if (functions) {
    Object.entries(functions).forEach(([fn, value]) => {
      const val: string = Array.isArray(value) ? value[1] : value;
      updateFunction(fn, val, id, index, isRender, currentComponent);
    });
  }
};
