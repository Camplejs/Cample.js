"use strict";

import {
  CurrentKeyType,
  KeyValuesValueConditionType
} from "../../../types/types";
const renderOperation = (
  operation: number,
  operand1: any,
  operand2?: any,
  isNot?: boolean
): boolean => {
  switch (operation) {
    case 1:
      return isNot ? !operand1 : !!operand1;
    case 2:
      return operand1 == operand2;
    case 3:
      return operand1 != operand2;
    case 4:
      return operand1 === operand2;
    case 5:
      return operand1 !== operand2;
    case 6:
      return operand1 > operand2;
    case 7:
      return operand1 >= operand2;
    case 8:
      return operand1 < operand2;
    case 9:
      return operand1 <= operand2;
    case 10:
      return operand1 && operand2;
    case 11:
      return operand1 || operand2;
    default:
      return false;
  }
};
const renderOperand = (
  operand: KeyValuesValueConditionType | CurrentKeyType | undefined,
  renderKey: (key: CurrentKeyType) => any
) => {
  if (!operand) return undefined;
  if ("operation" in operand) {
    renderCondition(operand, renderKey);
  } else {
    return renderKey(operand);
  }
};
export const renderCondition = (
  condition: KeyValuesValueConditionType,
  renderKey: (key: CurrentKeyType) => any
): boolean => {
  const operands = condition.operands;
  const result = renderOperation(
    condition.operation,
    renderOperand(operands[0], renderKey),
    renderOperand(operands[1], renderKey),
    condition.isNot
  );
  return result;
};
