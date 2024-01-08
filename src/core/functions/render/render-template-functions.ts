"use strict";

import { concat } from "../../../config/config";
import {
  CurrentKeyType,
  ImportDataType,
  KeyValuesType,
  KeyValuesValueConditionType,
  KeyValuesValueType,
  RenderConditionType,
  ValueItemType,
  ValueKeyStringType
} from "../../../types/types";
import { renderDynamic1, renderDynamic2 } from "./render-dynamics";
export const renderFn0 = (
  value: string | CurrentKeyType,
  data: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => renderDynamic1(value as CurrentKeyType, data);
export const renderFn1 = (
  indexData: any,
  value: Array<ValueItemType>,
  importData: ImportDataType | undefined,
  eachIndex?: number
): string => {
  let str = "";
  for (const val of value) {
    const { value: currentVal, render } = val;
    str += render(currentVal, indexData, importData, eachIndex);
  }
  return str;
};
export const renderFn2 = (
  indexData: any,
  value: ValueItemType,
  importData: ImportDataType | undefined,
  eachIndex?: number
): string => {
  const { value: val, render } = value;
  return render(val, indexData, importData, eachIndex);
};
export const renderFn3 = (e: string) => e;
export const renderFn4 = (
  value: string | CurrentKeyType,
  indexData: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => renderDynamic2(value as CurrentKeyType, indexData, importData, eachIndex);
export const renderFn5 = (
  operand: KeyValuesValueConditionType,
  indexData: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => {
  (operand.render as RenderConditionType)(indexData, importData, eachIndex);
};
export const renderFn6 = (
  str: { value: string },
  condition: boolean,
  vals: ValueKeyStringType,
  data: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => {
  if (condition) {
    renderStr(str, vals, data, importData, eachIndex);
  }
};
export const renderFn7 = (
  str: { value: string },
  condition: boolean,
  vals: ValueKeyStringType,
  data: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => {
  const val = condition ? vals[0] : vals[1];
  renderStr(str, val, data, importData, eachIndex);
};
export const renderStr = (
  str: { value: string },
  currentValues: ValueKeyStringType,
  data: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => {
  const { value, render } = currentValues.valueClass;
  return render(str, value, data, importData, eachIndex);
};
export const renderFn8 = (
  str: { value: string },
  currentValue: ValueItemType,
  data: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => {
  const { value, render } = currentValue;
  const prop = render(value, data, importData, eachIndex);
  str.value += prop;
};
export const renderFn9 = (
  str: { value: string },
  currentValues: Array<ValueItemType>,
  data: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => {
  const length = currentValues.length;
  const lastIndex = length - 1;
  for (let i = 0; i < length; i++) {
    const { value, render } = currentValues[i];
    const prop = render(value, data, importData, eachIndex);
    str.value =
      i !== lastIndex
        ? concat.call(str.value, " ", prop)
        : concat.call(str.value, prop);
  }
};
export const renderFn10 = (
  str: { value: string },
  currentValue: ValueItemType,
  data: any,
  importData: ImportDataType | undefined,
  eachIndex?: number
) => {
  const { value, render } = currentValue;
  const prop = render(value, data, importData, eachIndex);
  str.value = prop;
};
export const renderFn11 = (
  str: { value: string },
  currentVal: KeyValuesValueType,
  data: any,
  importData: any,
  eachIndex?: number | undefined
) => {
  const condition = (currentVal.condition.render as RenderConditionType)(
    data,
    importData,
    eachIndex
  );
  const { values, render } = currentVal;
  render(str, condition, values, data, importData, eachIndex);
};
export const renderFn12 = (
  str: { value: string },
  vals: KeyValuesType,
  data: any,
  importData: any,
  eachIndex?: number | undefined
) => {
  for (let i = 0; i < vals.length; i++) {
    const currentVal = vals[i];
    const condition = (currentVal.condition.render as RenderConditionType)(
      data,
      importData,
      eachIndex
    );
    const { values, render } = currentVal;
    render(str, condition, values, data, importData, eachIndex);
  }
};
