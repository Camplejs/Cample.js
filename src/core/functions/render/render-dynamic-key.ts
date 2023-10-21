"use strict";

import { DynamicDataValueType } from "../../../types/types";
import { renderComponentDynamicKeyData } from "../data/render-component-dynamic-key-data";

export const renderDynamicKey = (
  data: DynamicDataValueType,
  key: string,
  isEach = false
): [any, boolean] => {
  let result: [any, boolean] = ["", false];
  result = renderComponentDynamicKeyData(data, key, isEach);
  return result;
};
