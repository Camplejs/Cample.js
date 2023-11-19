"use strict";

import { CurrentKeyType, KeyValuesType } from "../../../types/types";
import { renderCondition } from "./render-condition";

export const renderValues = (
  key: CurrentKeyType,
  data: any,
  importData: any,
  eachIndex: number | undefined
) => {
  const vals = key.values as KeyValuesType;
  const str = {
    value: ""
  };
  for (const currentVal of vals) {
    const condition = renderCondition(
      currentVal.condition,
      data,
      importData,
      eachIndex
    );
    const { values, render } = currentVal;
    render(str, condition, values, data, importData, eachIndex);
  }
  return str.value;
};
