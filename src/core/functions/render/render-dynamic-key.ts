"use strict";

import { DynamicDataValueType, ValuesValueType } from "../../../types/types";
import { renderComponentDynamicKeyData } from "../data/render-component-dynamic-key-data";
import { renderValues } from "./render-values";

export const renderDynamicKey = (
  data: DynamicDataValueType,
  index: number,
  key: string,
  values: ValuesValueType | undefined = undefined,
  isEach = false,
  isValueKey?: boolean
): [any, boolean] => {
  let result: [any, boolean] = ["", false];
  if (isValueKey) {
    if (values) {
      result = renderValues(key, values);
    }
  } else {
    result = renderComponentDynamicKeyData(data, index, key, isEach);
  }
  return result;
};
