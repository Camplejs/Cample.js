"use-strict";

import {
  EXCLAMATION_POINT,
  MAIN_KEEP_DOUBLE_QUOTES_REGEX,
  MAIN_REGEX,
  SPACE_REGEX,
  split
} from "../../../config/config";
import { checkObject, createError, testRegex } from "../../../shared/utils";
import {
  CurrentKeyType,
  KeyValuesType,
  KeyValuesValueConditionType,
  KeyValuesValueType,
  RenderConditionType,
  ValueItemType,
  ValueKeyStringType,
  ValuesValueType
} from "../../../types/types";
import { parseKey } from "./parse-key";

const renderOperation = (operator: string): number => {
  switch (operator) {
    case "!":
      return 1;
    case "==":
      return 2;
    case "!=":
      return 3;
    case "===":
      return 4;
    case "!==":
      return 5;
    case ">":
      return 6;
    case ">=":
      return 7;
    case "<":
      return 8;
    case "<=":
      return 9;
    case "&&":
      return 10;
    case "||":
      return 11;
    default:
      return 0;
  }
};
const setRender = (operation: number, isNot?: boolean): RenderConditionType => {
  switch (operation) {
    case 1:
      return (operand1: any) => (isNot ? !operand1 : !!operand1);
    case 2:
      return (operand1: any, operand2?: any) => operand1 == operand2;
    case 3:
      return (operand1: any, operand2?: any) => operand1 != operand2;
    case 4:
      return (operand1: any, operand2?: any) => operand1 === operand2;
    case 5:
      return (operand1: any, operand2?: any) => operand1 !== operand2;
    case 6:
      return (operand1: any, operand2?: any) => operand1 > operand2;
    case 7:
      return (operand1: any, operand2?: any) => operand1 >= operand2;
    case 8:
      return (operand1: any, operand2?: any) => operand1 < operand2;
    case 9:
      return (operand1: any, operand2?: any) => operand1 <= operand2;
    case 10:
      return (operand1: any, operand2?: any) => operand1 && operand2;
    case 11:
      return (operand1: any, operand2?: any) => operand1 || operand2;
    default:
      return (operand1: any) => !!operand1;
  }
};
const parseCondition = (
  valueFunctions: [
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  condition: string,
  valueName?: string,
  importedDataName?: string,
  indexName?: string
): KeyValuesValueConditionType => {
  let string = condition;
  const CONDITION_REGEX = /(\(|\)|\|\||&&|>=|<=|!==|===)/g;
  string = string.replace(SPACE_REGEX, "");
  let filtredString = split.call(string, CONDITION_REGEX).filter(Boolean);
  const splitExclamationPoint = (arr: string[], text: string) => {
    if (text.includes("!") && !text.includes("!=") && !text.includes("!==")) {
      text
        .split(EXCLAMATION_POINT)
        .filter(Boolean)
        .forEach((txt1) => {
          arr.push(txt1);
        });
    } else {
      arr.push(text);
    }
  };
  filtredString = filtredString.reduce((arr: string[], txt: string) => {
    if (txt.includes("==") && txt !== "!==" && txt !== "===") {
      txt.split(/(==)/g).forEach((text) => {
        splitExclamationPoint(arr, text);
      });
    } else if (txt.includes("<") && txt !== "<=") {
      txt.split(/(<)/g).forEach((text) => {
        splitExclamationPoint(arr, text);
      });
    } else if (txt.includes(">") && txt !== ">=") {
      txt.split(/(>)/g).forEach((text) => {
        splitExclamationPoint(arr, text);
      });
    } else if (txt.includes("!=") && txt !== "!==") {
      txt.split(/(!=)/g).forEach((text) => {
        splitExclamationPoint(arr, text);
      });
    } else if (
      txt.includes("!") &&
      !txt.includes("!=") &&
      !txt.includes("!==")
    ) {
      txt
        .split(EXCLAMATION_POINT)
        .filter(Boolean)
        .forEach((txt1) => {
          arr.push(txt1);
        });
    } else {
      arr.push(txt);
    }
    return arr;
  }, []);
  for (const text of filtredString) {
    const isOpen = text === "(";
    if (isOpen || text === ")") {
      createError("Brackets are not yet supported");
    }
  }
  const length: number = filtredString.length;
  if (!filtredString.length) createError("Condition error");
  const defaultCurrentVal: KeyValuesValueConditionType = {
    operands: [],
    render: (operand1: any) => !!operand1
  };
  let currentVal = {
    ...defaultCurrentVal,
    operands: [...defaultCurrentVal.operands]
  };
  let mainCurrentVal = {
    ...defaultCurrentVal,
    operands: [...defaultCurrentVal.operands]
  };
  let currentIsNot = false;
  let currentOperation = 0;
  const mainOperation = 0;
  for (let i = 0; i < length; ) {
    const txt = filtredString[i];
    const operation = renderOperation(txt);
    switch (operation) {
      case 1:
        let isAdd = false;
        currentIsNot = true;
        while (i < length) {
          const nextOperation = renderOperation(filtredString[i + 1]);
          if (nextOperation > 1) {
            createError("Condition error");
            break;
          } else if (nextOperation === 1) {
            currentIsNot = !currentIsNot;
            i++;
          } else {
            isAdd = true;
            break;
          }
        }
        if (isAdd) {
          i++;
        }
        currentVal.render = setRender(operation, currentIsNot);
        currentOperation = 1;
        break;
      case 0:
        const key = parseKey(
          txt,
          valueFunctions,
          undefined,
          valueName,
          importedDataName,
          indexName,
          false,
          true
        );
        const createValItem = (
          value: KeyValuesValueConditionType | CurrentKeyType,
          isOperation = false
        ) => {
          return {
            value,
            render: !isOperation ? valueFunctions[0] : valueFunctions[1]
          };
        };
        if (currentOperation === 1) {
          if (currentVal.operands.length) createError("Condition error");
          currentVal.operands.push(createValItem(key));
          mainCurrentVal.operands.push(createValItem(currentVal, true));
        } else {
          mainCurrentVal.operands.push(createValItem(key));
        }
        if (i + 1 < length) {
          currentVal = { ...defaultCurrentVal, operands: [] };
        } else {
          if (!mainOperation && currentOperation === 1) {
            mainCurrentVal = {
              ...currentVal,
              operands: [...currentVal.operands]
            };
          }
        }
        i++;
        break;
      default:
        if (mainOperation) createError("Big condition are not yet supported");
        mainCurrentVal.render = setRender(operation);
        i++;
        break;
    }
  }
  return mainCurrentVal;
};
const parseValue = (
  valueFunctions: [
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  value: string,
  valueName?: string,
  importedDataName?: string,
  indexName?: string
): ValueKeyStringType => {
  const isTestRegex = testRegex(value);
  let valueClass: Array<ValueItemType> = [];
  if (isTestRegex) {
    value
      .split(MAIN_KEEP_DOUBLE_QUOTES_REGEX)
      .filter(Boolean)
      .map((val) => {
        if (testRegex(val)) {
          const key = val.replace(MAIN_REGEX, (_, d) => {
            return d;
          });
          const currentVal = parseKey(
            key,
            valueFunctions,
            undefined,
            valueName,
            importedDataName,
            indexName,
            false,
            true
          );
          if (currentVal)
            valueClass.push({
              value: currentVal,
              render: valueFunctions[0]
            });
          return currentVal;
        } else {
          split
            .call(val, SPACE_REGEX)
            .filter(Boolean)
            .forEach((currentVal) => {
              if (currentVal)
                valueClass.push({
                  value: currentVal,
                  render: valueFunctions[2]
                });
            });
          return val;
        }
      });
  } else {
    valueClass = split
      .call(value, SPACE_REGEX)
      .filter(Boolean)
      .map((e) => {
        return {
          value: e,
          render: valueFunctions[2]
        };
      });
  }
  const isObject = valueClass.length === 1;
  return {
    valueClass: {
      value: isObject ? valueClass[0] : valueClass,
      render: isObject ? valueFunctions[5] : valueFunctions[6]
    }
  };
};
export const parseValues = (
  valueFunctions: [
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  val: ValuesValueType,
  valueName?: string,
  importedDataName?: string,
  indexName?: string
): KeyValuesType | undefined => {
  let keyValues: KeyValuesType | undefined = undefined;
  if (checkObject(val)) {
    keyValues = [];
    for (const [key, value] of Object.entries(val)) {
      const isArray = Array.isArray(value);
      const condition = parseCondition(
        valueFunctions,
        key,
        valueName,
        importedDataName,
        indexName
      );
      const valueKeyValue = isArray
        ? (value.map((valueVal) =>
            parseValue(
              valueFunctions,
              valueVal,
              valueName,
              importedDataName,
              indexName
            )
          ) as [ValueKeyStringType, ValueKeyStringType])
        : parseValue(
            valueFunctions,
            value,
            valueName,
            importedDataName,
            indexName
          );
      const keyValue: KeyValuesValueType = {
        condition,
        values: valueKeyValue,
        render: !isArray ? valueFunctions[3] : valueFunctions[4]
      };
      (keyValues as KeyValuesType).push(keyValue);
    }
  } else createError("Value render error");
  return keyValues;
};
