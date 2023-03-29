"use strict";
import { checkObject } from "../../../shared/utils";
import {
  ArrayStringType,
  DynamicKeyObjectType,
  DynamicKeyType
} from "../../../types/types";

export const renderComponentDynamicKey = (
  key: DynamicKeyType | undefined
): [string, boolean, ArrayStringType] => {
  let newKey: string;
  let isProperty = false;
  let properties: ArrayStringType = [];
  if (checkObject(key)) {
    const dynamicKeyObject = key as DynamicKeyObjectType;
    newKey = dynamicKeyObject.key;
    if (dynamicKeyObject.properties.length > 0) {
      isProperty = true;
      properties = dynamicKeyObject.properties;
    }
  } else newKey = key as string;

  return [newKey, isProperty, properties];
};
