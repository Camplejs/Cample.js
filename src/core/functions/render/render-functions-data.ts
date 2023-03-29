"use-strict";
import {
  DynamicKeyObjectArrayType,
  DataType,
  IdType
} from "../../../types/types";

export const renderFunctionsData = (
  data: DataType | undefined,
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
  index: number,
  keys: DynamicKeyObjectArrayType
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
        const filtredKeys = keys.filter(
          (currentDynamicKey) => currentDynamicKey.key === key
        );
        updateFunction(
          data[key].function,
          key,
          isRender,
          id,
          index,
          filtredKeys
        );
      }
    }
  }
};
