"use strict";

import { DynamicDataValueType } from "../../../types/types";
import { renderComponentDynamicKey } from "../render/render-component-dynamic-key";
import { renderKey } from "../render/render-key";

export const renderComponentDynamicKeyData = (
  data: DynamicDataValueType,
  key: string,
  isValueKey: boolean = false,
  renderedKey?: {
    dynamicKey: string;
    renderDynamicKeyData: any;
  }
): any => {
  const dynamicKeyRendered =
    renderedKey !== undefined
      ? renderedKey
      : renderComponentDynamicKey(renderKey(key));
  const { dynamicKey, renderDynamicKeyData } = dynamicKeyRendered;
  const firstKeyData = isValueKey ? data : data?.[dynamicKey];
  const newData = renderDynamicKeyData(firstKeyData);
  return newData;
};
