"use-strict";
import { checkObject, getIsValue } from "../../../shared/utils";
import { CurrentKeyType, DynamicKeyObjectType } from "../../../types/types";
import { renderKey } from "../render/render-key";

export const parseKey = (
  key: string,
  valueName?: string,
  importedDataName?: string
): CurrentKeyType => {
  const renderedKey = renderKey(key);
  const isObj = checkObject(renderedKey);
  const originKey = (
    isObj ? (renderedKey as DynamicKeyObjectType).key : renderedKey
  ) as string;
  const properties: Array<string> | undefined = isObj
    ? (renderedKey as DynamicKeyObjectType).properties
    : undefined;
  const keyObj: CurrentKeyType = {
    originKey,
    key,
    isValue: getIsValue(key),
    isOrigin: originKey === valueName || originKey === importedDataName,
    isProperty: !!(properties && properties.length)
  };
  if (properties && properties.length) {
    keyObj.properties = properties;
  }
  return keyObj;
};
