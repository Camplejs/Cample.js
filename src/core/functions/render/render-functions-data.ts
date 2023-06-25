"use-strict";
import {
  DynamicKeyObjectArrayType,
  IdType,
  FunctionsObjType
} from "../../../types/types";

export const renderFunctionsData = (
  updateFunction: (
    name: string,
    key: string,
    isRender: boolean,
    id: IdType,
    index: number,
    keys: DynamicKeyObjectArrayType
  ) => void,
  isRender: boolean,
  id: IdType,
  functions: FunctionsObjType | undefined,
  index: number,
  keys: DynamicKeyObjectArrayType
): void => {
  if (functions) {
    Object.entries(functions).forEach(([fn, value]) => {
      const val: string = Array.isArray(value) ? value[1] : value;
      const filtredKeys = keys.filter(
        (currentDynamicKey) => currentDynamicKey.key === val
      );
      updateFunction(fn, val, isRender, id, index, filtredKeys);
    });
  }
};
