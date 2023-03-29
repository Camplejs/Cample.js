"use strict";

import { DynamicDataValueType } from "../../../types/types";
import { renderComponentDynamicKey } from "../render/render-component-dynamic-key";
import { renderData } from "../render/render-data";
import { renderKey } from "../render/render-key";
import { renderKeyData } from "../render/render-key-data";
import { renderDataValue } from "./render-data-value";

export const renderComponentDynamicKeyData = (
  data: DynamicDataValueType,
  index: number,
  key: string,
  isEach = false,
  isComponentData = true
): [any, boolean] => {
  const dynamicKeyRendered = renderComponentDynamicKey(renderKey(key));
  const dynamicKey: string = dynamicKeyRendered[0];
  const isProperty = dynamicKeyRendered[1];
  const properties = dynamicKeyRendered[2];
  const firstKeyData = isEach ? data : renderDataValue(data, dynamicKey);
  const newData = isProperty
    ? renderKeyData(
        isComponentData ? renderData(firstKeyData, index) : firstKeyData,
        properties
      )
    : firstKeyData;
  return [newData, isProperty];
};
