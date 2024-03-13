"use strict";
import { checkObject } from "../../../shared/utils";
import {
  ArrayStringType,
  DynamicKeyObjectType,
  DynamicKeyType
} from "../../../types/types";
import { renderKeyData } from "./render-key-data";
export const renderComponentDynamicKey = (
  key: DynamicKeyType | undefined
): {
  dynamicKey: string;
  renderDynamicKeyData: any;
} => {
  let newKey: string;
  let properties: ArrayStringType = [];
  let renderDynamicKeyData: any = (data: any) => data;
  if (checkObject(key)) {
    const dynamicKeyObject = key as DynamicKeyObjectType;
    newKey = dynamicKeyObject.key;
    if (dynamicKeyObject.properties.length > 0) {
      properties = dynamicKeyObject.properties;
      renderDynamicKeyData = (data: any) => renderKeyData(data, properties);
    }
  } else newKey = key as string;

  return {
    dynamicKey: newKey,
    renderDynamicKeyData
  };
};
