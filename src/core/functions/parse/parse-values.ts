"use-strict";

import {
  MAIN_KEEP_DOUBLE_QUOTES_REGEX,
  MAIN_REGEX,
  SPACE_REGEX
} from "../../../config/config";
import { checkObject, createError, testRegex } from "../../../shared/utils";
import {
  CurrentKeyType,
  KeyValuesType,
  KeyValuesValueConditionType,
  KeyValuesValueType,
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
const parseCondition = (
  condition: string,
  valueName?: string,
  importedDataName?: string,
  indexName?: string
): KeyValuesValueConditionType => {
  let string = condition;
  const CONDITION_REGEX = /(\(|\)|\|\||&&|>=|<=|!==|===)/g;
  string = string.replace(SPACE_REGEX, "");
  let filtredString = string.split(CONDITION_REGEX).filter(Boolean);
  const splitExclamationPoint = (arr: string[], text: string) => {
    if (text.includes("!") && !text.includes("!=") && !text.includes("!==")) {
      text
        .split(/(\!)/g)
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
        .split(/(\!)/g)
        .filter(Boolean)
        .forEach((txt1) => {
          arr.push(txt1);
        });
    } else {
      arr.push(txt);
    }
    return arr;
  }, []);
  filtredString.forEach((text, i) => {
    const isOpen = text === "(";
    if (isOpen || text === ")") {
      createError("Brackets are not yet supported");
      // brackets.push({ id: i, isOpen });
    }
  });
  const length: number = filtredString.length;
  if (!filtredString.length) createError("Condition error");
  const defaultCurrentVal: KeyValuesValueConditionType = {
    operands: [],
    operation: 0
  };
  let currentVal = {
    ...defaultCurrentVal,
    operands: [...defaultCurrentVal.operands]
  };
  let mainCurrentVal = {
    ...defaultCurrentVal,
    operands: [...defaultCurrentVal.operands]
  };
  for (let i = 0; i < length; ) {
    const txt = filtredString[i];
    const operation = renderOperation(txt);
    switch (operation) {
      case 1:
        let isAdd = false;
        currentVal.isNot = true;
        while (i < length) {
          const nextOperation = renderOperation(filtredString[i + 1]);
          if (nextOperation > 1) {
            createError("Condition error");
            break;
          } else if (nextOperation === 1) {
            currentVal.isNot = !currentVal.isNot;
            i++;
          } else {
            isAdd = true;
            break;
          }
        }
        if (isAdd) {
          i++;
        }
        currentVal.operation = 1;
        break;
      case 0:
        const key = parseKey(
          txt,
          undefined,
          valueName,
          importedDataName,
          indexName,
          false,
          true
        );
        if (currentVal.operation === 1) {
          if (currentVal.operands.length) createError("Condition error");
          currentVal.operands.push(key);
          mainCurrentVal.operands.push(currentVal);
        } else {
          mainCurrentVal.operands.push(key);
        }
        if (i + 1 < length) {
          currentVal = { ...defaultCurrentVal, operands: [] };
        } else {
          if (!mainCurrentVal.operation && currentVal.operation === 1) {
            mainCurrentVal = {
              ...currentVal,
              operands: [...currentVal.operands]
            };
          }
        }
        i++;
        break;
      default:
        if (mainCurrentVal.operation)
          createError("Big condition are not yet supported");
        mainCurrentVal.operation = operation;
        i++;
        break;
    }
  }
  return mainCurrentVal;
};
// Functionality in development
// const brackets: { id: number; isOpen: boolean }[] = [];
// let currentBracketId: number = 0;
// let nextBracketId = 0;
// let bracketOpenId = 0;
// let currentOpenBracket: any = undefined;
// type BracketsType = {
//   id: number;
//   siblingBrackets: BracketsType[];
//   range: number[];
// };
// let currentPath: number[] = [];
// const bracketArray: BracketsType[] = [];
// brackets.forEach(({ id, isOpen }) => {
//   let currentBracket = bracketArray[nextBracketId];
//   if (isOpen) {
//     let bracket = {
//       id: currentBracketId++,
//       siblingBrackets: [],
//       range: [id],
//       parent: undefined as any,
//       path: [...currentPath]
//     };
//     if (currentBracket) {
//       let curBracket: any = undefined;
//       bracket.path.forEach((position) => {
//         if (curBracket) {
//           curBracket = curBracket.siblingBrackets[position];
//         } else {
//           curBracket = currentBracket.siblingBrackets[position];
//         }
//       });
//       if (curBracket) {
//         bracket.parent = curBracket;
//         currentPath.push(curBracket.siblingBrackets.length);
//         bracket.path.push(curBracket.siblingBrackets.length);
//         curBracket.siblingBrackets.push(bracket);
//       } else {
//         bracket.parent = currentBracket;
//         currentPath.push(currentBracket.siblingBrackets.length);
//         bracket.path.push(currentBracket.siblingBrackets.length);
//         currentBracket.siblingBrackets.push(bracket);
//       }
//       currentOpenBracket = bracket;
//       bracketOpenId++;
//     } else {
//       bracketArray.push(bracket);
//     }
//   } else {
//     if (bracketOpenId) {
//       if (!currentOpenBracket) createError("Bracket error");
//       currentOpenBracket.range.push(id);
//       currentOpenBracket = currentOpenBracket.parent;
//       bracketOpenId--;
//       currentPath.pop();
//     } else {
//       currentOpenBracket = undefined;
//       if (!currentBracket) createError("Bracket error");
//       currentBracket.range.push(id);
//       nextBracketId++;
//       currentPath = [];
//     }
//   }
// });
// const bracketIndexes = bracketArray.map((e) => {
//   return e.range;
// });
const parseValue = (
  value: string,
  valueName?: string,
  importedDataName?: string,
  indexName?: string
): ValueKeyStringType => {
  let currentValue: string | Array<CurrentKeyType | string> = value;
  const isTestRegex = testRegex(value);
  let valueClass: Array<CurrentKeyType | string> = [];
  if (isTestRegex) {
    currentValue = value
      .split(MAIN_KEEP_DOUBLE_QUOTES_REGEX)
      .filter(Boolean)
      .map((val) => {
        if (testRegex(val)) {
          const key = val.replace(MAIN_REGEX, (_, d) => {
            return d;
          });
          const currentVal = parseKey(
            key,
            undefined,
            valueName,
            importedDataName,
            indexName,
            false,
            true
          );
          if (currentVal) valueClass.push(currentVal);
          return currentVal;
        } else {
          val
            .split(" ")
            .filter(Boolean)
            .forEach((currentVal) => {
              if (currentVal) valueClass.push(currentVal);
            });
          return val;
        }
      });
  } else {
    valueClass = value.split(" ").filter(Boolean);
  }
  return {
    value: currentValue,
    valueClass,
    isTestRegex
  };
};
export const parseValues = (
  val: ValuesValueType,
  valueName?: string,
  importedDataName?: string,
  indexName?: string
): KeyValuesType | undefined => {
  let keyValues: KeyValuesType | undefined = undefined;
  if (checkObject(val)) {
    keyValues = [];
    Object.entries(val).forEach(([key, value]) => {
      const isArray = Array.isArray(value);
      const condition = parseCondition(
        key,
        valueName,
        importedDataName,
        indexName
      );
      const valueKeyValue = isArray
        ? (value.map((valueVal) =>
            parseValue(valueVal, valueName, importedDataName, indexName)
          ) as [ValueKeyStringType, ValueKeyStringType])
        : parseValue(value, valueName, importedDataName, indexName);
      const keyValue: KeyValuesValueType = {
        condition,
        values: valueKeyValue,
        type: isArray ? 1 : 0
      };
      (keyValues as KeyValuesType).push(keyValue);
    });
  } else createError("Value render error");
  return keyValues;
};
