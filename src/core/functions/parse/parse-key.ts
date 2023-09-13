"use-strict";
import { checkObject, createError, getIsValue } from "../../../shared/utils";
import {
  CurrentKeyType,
  DynamicKeyObjectType,
  RenderedKeyType
} from "../../../types/types";
import { renderKey } from "../render/render-key";

const validateIsValue = (
  renderedKey: RenderedKeyType,
  key: string
): [RenderedKeyType, boolean, boolean] => {
  const isObj = checkObject(renderedKey);
  const isValue = getIsValue(key);
  if (isObj) {
    if (isValue && (renderedKey as DynamicKeyObjectType).properties.length > 0)
      createError("Value error");
  } else {
    if (isValue) {
      const regex = /\[+(.*?)\]+/g;
      renderedKey = (renderedKey as string).replace(regex, (str, d) => d);
    }
  }
  return [renderedKey, isValue, isObj];
};

export const parseKey = (
  key: string,
  valueName?: string,
  importedDataName?: string,
  indexName?: string,
  isClass?: boolean
): CurrentKeyType => {
  const [renderedKey, isValue, isObj] = validateIsValue(renderKey(key), key);
  const originKey = (
    isObj ? (renderedKey as DynamicKeyObjectType).key : renderedKey
  ) as string;
  const properties: Array<string> | undefined = isObj
    ? (renderedKey as DynamicKeyObjectType).properties
    : undefined;

  const keyObj: CurrentKeyType = {
    originKey,
    key: isValue ? (renderedKey as string) : key,
    isValue,
    isOrigin:
      originKey === valueName ||
      originKey === importedDataName ||
      originKey === indexName,
    isProperty: !!(properties && properties.length),
    isClass
  };
  if (properties && properties.length) {
    keyObj.properties = properties;
  }
  return keyObj;
};
