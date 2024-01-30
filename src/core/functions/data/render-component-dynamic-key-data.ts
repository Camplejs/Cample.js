"use strict";

import { ArrayStringType, DynamicDataValueType } from "../../../types/types";
import { renderComponentDynamicKey } from "../render/render-component-dynamic-key";
import { renderKey } from "../render/render-key";
import { renderKeyData } from "../render/render-key-data";

export const renderComponentDynamicKeyData = (
  data: DynamicDataValueType,
  key: string,
  isValueKey = false,
  renderedKey?: [string, boolean, ArrayStringType]
): any => {
  const dynamicKeyRendered =
    renderedKey ?? renderComponentDynamicKey(renderKey(key));
  const dynamicKey: string = dynamicKeyRendered[0];
  const isProperty = dynamicKeyRendered[1];
  const properties = dynamicKeyRendered[2];
  const firstKeyData = isValueKey ? data : data?.[dynamicKey];
  const newData = isProperty
    ? renderKeyData(firstKeyData, properties)
    : firstKeyData;
  return newData;
};
