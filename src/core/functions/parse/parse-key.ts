"use-strict";
import { VALUE_REGEX } from "../../../config/config";
import { checkObject, createError, getIsValue } from "../../../shared/utils";
import {
  CurrentKeyType,
  DynamicKeyObjectType,
  KeyValuesType,
  RenderedKeyType,
  ValuesType
} from "../../../types/types";
import { renderKey } from "../render/render-key";
import { parseValues } from "./parse-values";

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
      renderedKey = (renderedKey as string).replace(VALUE_REGEX, (_, d) => d);
    }
  }
  return [renderedKey, isValue, isObj];
};

export const parseKey = (
  key: string,
  values?: ValuesType,
  valueName?: string,
  importedDataName?: string,
  indexName?: string,
  isClass?: boolean,
  isCondition?: boolean
): CurrentKeyType => {
  const [renderedKey, isValue, isObj] = validateIsValue(renderKey(key), key);
  const originKey = (
    isObj ? (renderedKey as DynamicKeyObjectType).key : renderedKey
  ) as string;
  let val: KeyValuesType | undefined = undefined;
  if (isValue) {
    if (isCondition) createError("The presence of value in the condition");
    if (values) {
      const currentObj = values[originKey];
      val = parseValues(currentObj, valueName, importedDataName, indexName);
    } else {
      createError("Values error");
    }
  }
  const properties: Array<string> | undefined = isObj
    ? (renderedKey as DynamicKeyObjectType).properties
    : undefined;
  let originType = 0;
  const isProperty = !!(properties && properties.length);
  switch (originKey) {
    case valueName:
      originType = 1;
      break;
    case importedDataName:
      originType = 2;
      break;
    case indexName:
      if (isProperty) createError("Error properties");
      originType = 3;
      break;
  }
  const keyObj: CurrentKeyType = {
    originKey,
    key: isValue ? (renderedKey as string) : key,
    originType,
    isProperty,
    isClass,
    values: val,
    type: isValue ? 1 : 0
  };
  if (properties && properties.length) {
    keyObj.properties = properties;
  }
  return keyObj;
};
