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
            str = vals.valueClass
              .map((e) => {
                if (typeof e !== "string") {
                  const prop = renderConditionKey(e);
                  return prop;
                } else {
                  return e;
                }
              })
              .join(" ");
          }
          break;
        case 1:
          const currentValue2 = condition ? vals[0] : vals[1];
          if (condition) {
            str = currentValue2.valueClass
              .map((e: string | CurrentKeyType) => {
                if (typeof e !== "string") {
                  const prop = renderConditionKey(e);
                  return prop;
                } else {
                  return e;
                }
              })
              .join(" ");
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
