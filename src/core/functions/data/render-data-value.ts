"use-strict";
import { checkObject } from "../../../shared/utils";
import {
  DataType,
  DynamicKeyObjectType,
  DynamicKeyType
} from "../../../types/types";
import { renderKeyData } from "../render/render-key-data";

export const renderDataValue = (
  data: DataType | undefined,
  key: DynamicKeyType | undefined,
  isEach?: boolean,
  valueName?: string
) => {
  if (key !== undefined && data && !(isEach && valueName === undefined)) {
    if (checkObject(key)) {
      const newKey = key as DynamicKeyObjectType;
      if (isEach && valueName !== newKey.key) return undefined;
      return renderKeyData(isEach ? data : data[newKey.key], newKey.properties);
    } else {
      const newKey = key as string;
      if (isEach && valueName !== newKey) return undefined;
      return isEach ? data : data[newKey];
    }
  } else {
    return undefined;
  }
};
