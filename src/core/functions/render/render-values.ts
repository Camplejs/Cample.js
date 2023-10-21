"use strict";

import { createError } from "../../../shared/utils";
import { CurrentKeyType, ValueKeyStringType } from "../../../types/types";
import { renderCondition } from "./render-condition";

export const renderValues = (
  key: CurrentKeyType,
  data: any,
  importData: any,
  eachIndex: number | undefined,
  renderDynamic: (...args: any[]) => any
) => {
  const values = key.values;
  let val: string | undefined | object = undefined;
  const renderConditionKey = (currentKey: CurrentKeyType) =>
    renderDynamic(currentKey, data, importData, eachIndex);
  if (values) {
    let str = "";
    for (const currentVal of values) {
      const condition = renderCondition(
        currentVal.condition,
        renderConditionKey
      );
      const vals = currentVal.values as ValueKeyStringType;
      switch (currentVal.type) {
        case 0:
          if (condition) {
            for (const e of vals.valueClass) {
              if (typeof e !== "string") {
                const prop = renderConditionKey(e);
                str = str.concat(prop);
              } else {
                str = str.concat(e);
              }
            }
          }
          break;
        case 1:
          const currentValue2 = condition ? vals[0] : vals[1];
          if (condition) {
            for (const e of currentValue2.valueClass) {
              if (typeof e !== "string") {
                const prop = renderConditionKey(e);
                str = str.concat(prop);
              } else {
                str = str.concat(e);
              }
            }
          }
          break;
        default:
          break;
      }
    }
    val = str;
  } else {
    createError("Values error");
  }
  return val;
};
