"use strict";

import { KeyValuesValueConditionType, OperandType } from "../../../types/types";

const renderOperand = (
  operand: OperandType,
  data: any,
  importData: any,
  eachIndex: number | undefined
) => {
  const { value, render } = operand;
  return render(value, data, importData, eachIndex);
};
export const renderCondition = (
  condition: KeyValuesValueConditionType,
  data: any,
  importData: any,
  eachIndex: number | undefined
): boolean => {
  const { operands, render } = condition;
  const result = render(
    renderOperand(operands[0], data, importData, eachIndex),
    renderOperand(operands[1], data, importData, eachIndex)
  );
  return result;
};
