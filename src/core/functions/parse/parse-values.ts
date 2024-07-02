"use-strict";

import {
  EXCLAMATION_POINT,
  MAIN_KEEP_DOUBLE_QUOTES_REGEX,
  MAIN_REGEX,
  SPACE_REGEX,
  indexOf,
  push,
  split
} from "../../../config/config";
import { checkObject, createError, testRegex } from "../../../shared/utils";
import {
  ConnectingOperationType,
  CurrentKeyType,
  KeyValuesType,
  KeyValuesValueConditionType,
  KeyValuesValueType,
  OperandType,
  OperationType,
  RenderConditionType,
  ValueItemType,
  ValueKeyStringType,
  ValuesValueType
} from "../../../types/types";
import { renderDynamic1, renderDynamic2 } from "../render/render-dynamics";
import { renderKeyData } from "../render/render-key-data";
import { renderValues } from "../render/render-values";
import { parseKey } from "./parse-key";
const defaultRenderFn = (operand1: any) => operand1;
const defaultRenderBooleanFn = (operand1: any) => !!operand1;

const getOperation = (operator: string): number => {
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
const getPriority = (operation: number): number => {
  switch (operation) {
    case 10:
      return 3;
    case 11:
      return 4;
    default:
      return 2;
  }
};
const getTypeOperation = (operation: number, type: number): number => {
  switch (operation) {
    case 2:
      return type === 1 ? 12 : 22;
    case 3:
      return type === 1 ? 13 : 23;
    case 4:
      return type === 1 ? 14 : 24;
    case 5:
      return type === 1 ? 15 : 25;
    case 6:
      return type === 1 ? 16 : 26;
    case 7:
      return type === 1 ? 17 : 27;
    case 8:
      return type === 1 ? 18 : 28;
    case 9:
      return type === 1 ? 19 : 29;
    case 10:
      return type === 1 ? 20 : 30;
    case 11:
      return type === 1 ? 21 : 31;
    default:
      return operation;
  }
};
const fn2 = (operand1: any, operand2?: any) => operand1 == operand2;
const fn3 = (operand1: any, operand2?: any) => operand1 != operand2;
const fn4 = (operand1: any, operand2?: any) => operand1 === operand2;
const fn5 = (operand1: any, operand2?: any) => operand1 !== operand2;
const fn6 = (operand1: any, operand2?: any) => operand1 > operand2;
const fn7 = (operand1: any, operand2?: any) => operand1 >= operand2;
const fn8 = (operand1: any, operand2?: any) => operand1 < operand2;
const fn9 = (operand1: any, operand2?: any) => operand1 <= operand2;
const fn10 = (operand1: any, operand2?: any) => operand1 && operand2;
const fn11 = (operand1: any, operand2?: any) => operand1 || operand2;
const fn12 = (operand1: any, operand2?: any) => !(operand1 == operand2);
const fn13 = (operand1: any, operand2?: any) => !(operand1 != operand2);
const fn14 = (operand1: any, operand2?: any) => !(operand1 === operand2);
const fn15 = (operand1: any, operand2?: any) => !(operand1 !== operand2);
const fn16 = (operand1: any, operand2?: any) => !(operand1 > operand2);
const fn17 = (operand1: any, operand2?: any) => !(operand1 >= operand2);
const fn18 = (operand1: any, operand2?: any) => !(operand1 < operand2);
const fn19 = (operand1: any, operand2?: any) => !(operand1 <= operand2);
const fn20 = (operand1: any, operand2?: any) => !(operand1 && operand2);
const fn21 = (operand1: any, operand2?: any) => !(operand1 || operand2);
const fn22 = (operand1: any, operand2?: any) => !!(operand1 == operand2);
const fn23 = (operand1: any, operand2?: any) => !!(operand1 != operand2);
const fn24 = (operand1: any, operand2?: any) => !!(operand1 === operand2);
const fn25 = (operand1: any, operand2?: any) => !!(operand1 !== operand2);
const fn26 = (operand1: any, operand2?: any) => !!(operand1 > operand2);
const fn27 = (operand1: any, operand2?: any) => !!(operand1 >= operand2);
const fn28 = (operand1: any, operand2?: any) => !!(operand1 < operand2);
const fn29 = (operand1: any, operand2?: any) => !!(operand1 <= operand2);
const fn30 = (operand1: any, operand2?: any) => !!(operand1 && operand2);
const fn31 = (operand1: any, operand2?: any) => !!(operand1 || operand2);

const getOperationRender = (render: any) => {
  switch (render) {
    case fn2:
      return 2;
    case fn3:
      return 3;
    case fn4:
      return 4;
    case fn5:
      return 5;
    case fn6:
      return 6;
    case fn7:
      return 7;
    case fn8:
      return 8;
    case fn9:
      return 9;
    case fn10:
      return 10;
    case fn11:
      return 11;
    case fn12:
      return 12;
    case fn13:
      return 13;
    case fn14:
      return 14;
    case fn15:
      return 15;
    case fn16:
      return 16;
    case fn17:
      return 17;
    case fn18:
      return 18;
    case fn19:
      return 19;
    case fn20:
      return 20;
    case fn21:
      return 21;
    case fn22:
      return 22;
    case fn23:
      return 23;
    case fn24:
      return 24;
    case fn25:
      return 25;
    case fn26:
      return 26;
    case fn27:
      return 27;
    case fn28:
      return 28;
    case fn29:
      return 29;
    case fn30:
      return 30;
    case fn31:
      return 31;
    default:
      return undefined;
  }
};

const getRender = (
  operation: number,
  renderDynamic: (...args: any[]) => string,
  isNot?: boolean
): RenderConditionType | [RenderConditionType, number] => {
  switch (operation) {
    case 1:
      return isNot
        ? [(operand1: any) => !operand1, 1]
        : [defaultRenderBooleanFn, 2];
    case 2:
      return fn2;
    case 3:
      return fn3;
    case 4:
      return fn4;
    case 5:
      return fn5;
    case 6:
      return fn6;
    case 7:
      return fn7;
    case 8:
      return fn8;
    case 9:
      return fn9;
    case 10:
      return fn10;
    case 11:
      return fn11;
    case 12:
      return fn12;
    case 13:
      return fn13;
    case 14:
      return fn14;
    case 15:
      return fn15;
    case 16:
      return fn16;
    case 17:
      return fn17;
    case 18:
      return fn18;
    case 19:
      return fn19;
    case 20:
      return fn20;
    case 21:
      return fn21;
    case 22:
      return fn22;
    case 23:
      return fn23;
    case 24:
      return fn24;
    case 25:
      return fn25;
    case 26:
      return fn26;
    case 27:
      return fn27;
    case 28:
      return fn28;
    case 29:
      return fn29;
    case 30:
      return fn30;
    case 31:
      return fn31;
    case 32:
      return isNot
        ? [
            (
              key: CurrentKeyType,
              data: any,
              importData: any,
              eachIndex: number | undefined
            ) => !renderDynamic(key, data, importData, eachIndex),
            1
          ]
        : [
            (
              key: CurrentKeyType,
              data: any,
              importData: any,
              eachIndex: number | undefined
            ) => !!renderDynamic(key, data, importData, eachIndex),
            2
          ];
    case 33:
      return [renderDynamic, 0];
    default:
      return [defaultRenderFn, 0];
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
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  condition: string,
  valueName?: string,
  importedDataName?: string,
  stackName?: string,
  indexName?: string
): { mainCurrentVal: KeyValuesValueConditionType; isValueImport: boolean } => {
  const renderDynamic = valueFunctions[0];
  let string = condition;
  let isValueImport = false;
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
  const brackets: { id: number; isOpen: boolean }[] = [];
  const lastIndex: number = filtredString.length - 1;
  if (lastIndex === -1) createError("Condition error");
  const firstIndex = 0;
  filtredString.forEach((text, i) => {
    const isOpen = text === "(";
    if (isOpen || text === ")") {
      brackets.push({ id: i, isOpen });
    }
  });
  let currentBracketId: number = 0;
  let nextBracketId = 0;
  let bracketOpenId = 0;
  let currentOpenBracket: any = undefined;
  type BracketsType = {
    id: number;
    siblingBrackets: BracketsType[];
    range: number[];
  };
  let currentPath: number[] = [];
  const mainBracket: BracketsType = {
    id: -1,
    siblingBrackets: [],
    range: [firstIndex, lastIndex]
  };
  brackets.forEach(({ id, isOpen }) => {
    const currentBracket = mainBracket.siblingBrackets[nextBracketId];
    if (isOpen) {
      const bracket = {
        id: currentBracketId++,
        siblingBrackets: [],
        range: [id],
        parent: undefined as any,
        path: [...currentPath]
      };
      if (currentBracket) {
        let curBracket: any = undefined;
        bracket.path.forEach((position) => {
          if (curBracket) {
            curBracket = curBracket.siblingBrackets[position];
          } else {
            curBracket = currentBracket.siblingBrackets[position];
          }
        });
        if (curBracket) {
          bracket.parent = curBracket;
          currentPath.push(curBracket.siblingBrackets.length);
          bracket.path.push(curBracket.siblingBrackets.length);
          curBracket.siblingBrackets.push(bracket);
        } else {
          bracket.parent = currentBracket;
          currentPath.push(currentBracket.siblingBrackets.length);
          bracket.path.push(currentBracket.siblingBrackets.length);
          currentBracket.siblingBrackets.push(bracket);
        }
        currentOpenBracket = bracket;
        bracketOpenId++;
      } else {
        mainBracket.siblingBrackets.push(bracket);
      }
    } else {
      if (bracketOpenId) {
        if (!currentOpenBracket) createError("Bracket error");
        currentOpenBracket.range.push(id);
        currentOpenBracket = currentOpenBracket.parent;
        bracketOpenId--;
        currentPath.pop();
      } else {
        currentOpenBracket = undefined;
        if (!currentBracket) createError("Bracket error");
        currentBracket.range.push(id);
        nextBracketId++;
        currentPath = [];
      }
    }
  });
  const defaultCurrentVal: KeyValuesValueConditionType = {
    operands: [],
    render: defaultRenderFn
  };
  const createOperand = (
    value: KeyValuesValueConditionType | CurrentKeyType,
    render: RenderConditionType = defaultRenderFn,
    type: number = 0,
    priority: number = 0
  ): OperandType => {
    return {
      value,
      type,
      render,
      priority
    };
  };
  const mainCurrentVal: KeyValuesValueConditionType = {
    ...defaultCurrentVal,
    connectingOperations: [],
    operands: []
  };
  const createConnectingOperation = (
    priority: number,
    value: OperationType | OperandType
  ): ConnectingOperationType => ({
    priority,
    value
  });
  const processCondition = (
    firstId: number,
    lastId: number,
    brackets: BracketsType,
    parentVal: KeyValuesValueConditionType
  ) => {
    const bracketIndexes = brackets.siblingBrackets.map((e) => {
      return e.range;
    });
    let siblingBracketId = 0;
    let isNot = false;
    let currentOperation = 0;
    for (let i = firstId; i <= lastId; ) {
      const txt = filtredString[i];
      const currentBracketRange = bracketIndexes[siblingBracketId];
      if (currentBracketRange?.includes(i)) {
        const lastRangeIndex = currentBracketRange[1];
        const val: KeyValuesValueConditionType = {
          ...defaultCurrentVal,
          connectingOperations: [],
          operands: []
        };
        const [render, type] = getRender(
          currentOperation,
          renderDynamic,
          isNot
        ) as [RenderConditionType, number];
        const operand = createOperand(val, render, type);
        push.call(parentVal.operands, operand);
        processCondition(
          i + 1,
          lastRangeIndex - 1,
          brackets.siblingBrackets[siblingBracketId],
          val
        );
        siblingBracketId++;
        i = lastRangeIndex + 1;
        isNot = false;
        currentOperation = 0;
      } else {
        const operation = getOperation(txt);
        switch (operation) {
          case 0:
            const key = parseKey(
              txt,
              valueFunctions,
              undefined,
              valueName,
              importedDataName,
              stackName,
              indexName,
              false,
              true
            );
            if (key.originKey !== undefined && !isValueImport) {
              isValueImport = key.originKey === importedDataName;
            }
            const currentOperandOperation: number =
              currentOperation === 0 ? 33 : 32;
            const [render, type] = getRender(
              currentOperandOperation,
              renderDynamic,
              isNot
            ) as [RenderConditionType, number];
            const operand = createOperand(key, render, type, 1);
            push.call(parentVal.operands, operand);
            isNot = false;
            currentOperation = 0;
            break;
          case 1:
            let increase = 1;
            isNot = true;
            const nextIdIsNot = i + increase;
            let nextItemIsNot = filtredString[nextIdIsNot];
            while (getOperation(nextItemIsNot) === 1 && i <= lastId) {
              isNot = !isNot;
              nextItemIsNot = filtredString[i + ++increase];
            }
            i = i + increase - 1;
            currentOperation = 1;
            break;
          default:
            const nextId = i + 1;
            const nextItem = filtredString[nextId];
            const nextOperation = getOperation(nextItem);
            const priority = getPriority(operation);
            if (
              currentBracketRange?.includes(nextId) ||
              nextOperation === 0 ||
              nextOperation === 1
            ) {
              const operationObj: OperationType = {
                value: operation,
                priority,
                render: getRender(
                  operation,
                  renderDynamic,
                  isNot
                ) as RenderConditionType
              };
              push.call(parentVal.operands, operationObj);
              const connectingOperation = createConnectingOperation(
                priority,
                operationObj
              );
              push.call(parentVal.connectingOperations, connectingOperation);
              isNot = false;
              currentOperation = 0;
            } else createError("Condition error");
            break;
        }
        i++;
      }
    }
  };
  processCondition(firstIndex, lastIndex, mainBracket, mainCurrentVal);
  /*
    () - 0
    !, !!, e - 1
    >, < - 2
    && - 3
    || - 4
  */
  /*
    e - 0
    ! - 1
    !! - 2
  */
  const renderBracket = (
    currentOperand: KeyValuesValueConditionType | OperandType | OperationType,
    val: KeyValuesValueConditionType,
    isBracket: boolean,
    i: number,
    oldType?: number
  ) => {
    const bracketCondition = (currentOperand as OperandType)
      .value as KeyValuesValueConditionType;
    oldType = oldType ?? (currentOperand as OperandType).type;
    if (val.oldBracketType !== undefined) {
      const oldBracketType = val.oldBracketType;
      if (oldBracketType === 1 && oldType === 1) {
        oldType = 2;
      } else if (oldType === 1 || oldBracketType === 1) {
        oldType = 1;
      } else {
        oldType = oldBracketType;
      }
    }
    bracketCondition.oldBracketType = oldType;
    const operation = setPriority(bracketCondition);
    if (isBracket) {
      val.operands = bracketCondition.operands;
      delete val.connectingOperations;
      val.isFirstOperation = bracketCondition.isFirstOperation;
      if (
        val.isFirstOperation === undefined &&
        operation === undefined &&
        oldType !== 0
      ) {
        const currentRender = getRender(1, renderDynamic, oldType === 1)[0];
        val.render = currentRender;
        val.isFirstOperation = true;
      } else {
        val.render = bracketCondition.render;
      }
    } else {
      val.operands[i] = bracketCondition;
      if (operation === undefined && oldType !== 0) {
        const currentRender = getRender(1, renderDynamic, oldType === 1)[0];
        val.operands[i].render = currentRender;
      }
      delete (val.operands[i] as KeyValuesValueConditionType)
        .connectingOperations;
    }
    if (oldType !== 0 && oldType !== undefined && operation !== undefined) {
      const type = getTypeOperation(operation, oldType);
      const render = getRender(type, renderDynamic) as (...args: any[]) => any;
      if (isBracket) {
        val.render = render;
        val.isFirstOperation = false;
      } else {
        val.operands[i].render = render;
      }
    }
  };
  const setPriority = (val: KeyValuesValueConditionType) => {
    const operandsLength = val.operands.length;
    const { operands } = val;
    if (operandsLength % 2 === 0) createError("Condition error");
    const connectingOperations =
      val.connectingOperations as ConnectingOperationType[];
    if (connectingOperations.length === 0) {
      const operand: OperandType = val.operands[0] as OperandType;
      const { type, priority } = operand;
      if (priority === 0) {
        renderBracket(operand, val, true, 0, type);
      }
      return;
    }
    connectingOperations.sort((a, b) => a.priority - b.priority);
    const lastIndex = connectingOperations.length - 1;
    for (let i = 0; i < lastIndex; i++) {
      const { value } = connectingOperations[i];
      const index = indexOf.call(operands, value);
      const nextValIndex = index + 1;
      const nextVal = operands[nextValIndex];
      const previousValIndex = index - 1;
      const previousVal = operands[previousValIndex];
      if (nextVal.priority === 0) {
        renderBracket(nextVal, val, false, nextValIndex);
      }
      if (previousVal.priority === 0) {
        renderBracket(previousVal, val, false, previousValIndex);
      }
      const newVal: KeyValuesValueConditionType = {
        operands: [operands[previousValIndex], operands[nextValIndex]],
        render: value.render
      };
      if (nextVal === undefined || previousVal === undefined)
        createError("Condition error");
      val.operands.splice(previousValIndex, 3, newVal);
    }
    const { value } = connectingOperations[lastIndex];
    const index = indexOf.call(operands, value);
    val.render = value.render;
    val.operands.splice(index, 1);
    for (let i = 0; i < 2; i++) {
      const currentOperand = val.operands[i];
      if (currentOperand.priority === 0) {
        renderBracket(currentOperand, val, false, i);
      }
    }
    return value.value as number;
  };
  setPriority(mainCurrentVal);
  const getIsOptimization = (mainCurrentVal: KeyValuesValueConditionType) => {
    if (mainCurrentVal.operands.length === 2) {
      const isCondition = mainCurrentVal.operands.some(
        (e) => (e as any).operands !== undefined
      );
      const isType = mainCurrentVal.operands.some((e) => (e as any).type !== 0);
      return !isCondition && !isType;
    } else return false;
  };
  const structuringValue = (
    val: OperandType | OperationType | KeyValuesValueConditionType
  ) => {
    delete val.priority;
    const render = val.render as RenderConditionType;
    const operands = (val as KeyValuesValueConditionType).operands;
    if (operands !== undefined) {
      delete (val as KeyValuesValueConditionType).connectingOperations;
      delete (val as KeyValuesValueConditionType).isFirstOperation;
      delete (val as KeyValuesValueConditionType).oldBracketType;
      const operand1 = operands[0] as OperandType;
      const length = operands.length;
      if (length === 2) {
        const operand2 = operands[1] as OperandType;
        val.render = (
          data: any,
          importData: any,
          eachIndex: number | undefined
        ) => {
          const result = render(
            operand1.render(data, importData, eachIndex),
            operand2.render(data, importData, eachIndex)
          );
          return result;
        };
      } else if (length === 1) {
        val.render = (
          data: any,
          importData: any,
          eachIndex: number | undefined
        ) => {
          const result = render(operand1.render(data, importData, eachIndex));
          return result;
        };
      } else {
        createError("Condition error");
      }
      for (
        let i = 0;
        i < (val as KeyValuesValueConditionType).operands.length;
        i++
      ) {
        structuringValue((val as KeyValuesValueConditionType).operands[i]);
      }
    } else {
      delete (val as OperandType).type;
      delete (val as OperandType).oldType;
      const value = (val as OperandType).value;
      if (render === renderDynamic1) {
        if ((value as CurrentKeyType).isValue) {
          val.render = (
            data: any,
            importData: any,
            eachIndex: number | undefined
          ) => {
            const str = {
              value: ""
            };
            renderValues(
              str,
              value as CurrentKeyType,
              data,
              importData,
              eachIndex
            );
            return str.value;
          };
        } else {
          if ((value as CurrentKeyType).isProperty) {
            val.render = (
              data: any,
              importData: any,
              eachIndex: number | undefined
            ) => {
              const firstKeyData = data[(value as CurrentKeyType).originKey];
              return renderKeyData(
                firstKeyData,
                (value as CurrentKeyType).properties as Array<string>
              );
            };
          } else {
            val.render = (
              data: any,
              importData: any,
              eachIndex: number | undefined
            ) => data[(value as CurrentKeyType).originKey];
          }
        }
      } else if (render === renderDynamic2) {
        if ((value as CurrentKeyType).isValue) {
          val.render = (
            data: any,
            importData: any,
            eachIndex: number | undefined
          ) => {
            const str = {
              value: ""
            };
            renderValues(
              str,
              value as CurrentKeyType,
              data,
              importData,
              eachIndex
            );
            return str.value;
          };
        } else {
          switch ((value as CurrentKeyType).originType) {
            case 1:
              if ((value as CurrentKeyType).isProperty) {
                if ((value as CurrentKeyType).properties?.length === 1) {
                  const currentProp = (
                    (value as CurrentKeyType).properties as any
                  )[0];
                  return (val.render = (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp]);
                } else {
                  return (val.render = (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => (value as CurrentKeyType as any)(data));
                }
              } else {
                return (val.render = (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) => data);
              }
            case 2:
              if ((value as CurrentKeyType).isProperty) {
                if ((value as CurrentKeyType).properties?.length === 1) {
                  const currentProp = (
                    (value as CurrentKeyType).properties as any
                  )[0];
                  return (val.render = (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp]);
                } else {
                  return (val.render = (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => (value as CurrentKeyType as any)(importData));
                }
              } else {
                return (val.render = (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) => importData);
              }
            case 3:
              return (val.render = (
                data: any,
                importData: any,
                eachIndex: number | undefined
              ) => eachIndex);
            default:
              return (val.render = (
                data: any,
                importData: any,
                eachIndex: number | undefined
              ) => undefined);
          }
        }
      } else {
        val.render = render.bind(this, value);
      }
    }
  };
  if (getIsOptimization(mainCurrentVal)) {
    const optimizeValue = (val: KeyValuesValueConditionType) => {
      delete val.priority;
      delete val.connectingOperations;
      delete val.isFirstOperation;
      delete val.oldBracketType;
      const { render: renderVal } = val;
      const operation = getOperationRender(renderVal);
      if (operation !== undefined) {
        const operand1 = val.operands[0];
        const operand2 = val.operands[1];
        const { render: render1 } = operand1;
        const { render: render2 } = operand2;
        const getOperandOperationRender = (
          render: any,
          operand: OperandType
        ) => {
          delete operand.priority;
          delete operand.type;
          delete operand.oldType;
          const { value } = operand;
          if (render === renderDynamic1) {
            if ((value as CurrentKeyType).isValue) {
              operand.render = (
                data: any,
                importData: any,
                eachIndex: number | undefined
              ) => {
                const str = {
                  value: ""
                };
                renderValues(
                  str,
                  value as CurrentKeyType,
                  data,
                  importData,
                  eachIndex
                );
                return str.value;
              };
            } else {
              if ((value as CurrentKeyType).isProperty) {
                operand.render = (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) => {
                  const firstKeyData =
                    data[(value as CurrentKeyType).originKey];
                  return renderKeyData(
                    firstKeyData,
                    (value as CurrentKeyType).properties as Array<string>
                  );
                };
              } else {
                operand.render = (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) => data[(value as CurrentKeyType).originKey];
              }
            }
          } else if (render === renderDynamic2) {
            if ((value as CurrentKeyType).isValue) {
              operand.render = (
                data: any,
                importData: any,
                eachIndex: number | undefined
              ) => {
                const str = {
                  value: ""
                };
                renderValues(
                  str,
                  value as CurrentKeyType,
                  data,
                  importData,
                  eachIndex
                );
                return str.value;
              };
            } else {
              switch ((value as CurrentKeyType).originType) {
                case 1:
                  if ((value as CurrentKeyType).isProperty) {
                    if ((value as CurrentKeyType).properties?.length === 1) {
                      const currentProp = (
                        (value as CurrentKeyType).properties as any
                      )[0];
                      operand.render = (
                        data: any,
                        importData: any,
                        eachIndex: number | undefined
                      ) => data[currentProp];
                      return 0;
                    } else {
                      operand.render = (
                        data: any,
                        importData: any,
                        eachIndex: number | undefined
                      ) => (value as CurrentKeyType as any)(data);
                    }
                  } else {
                    operand.render = (
                      data: any,
                      importData: any,
                      eachIndex: number | undefined
                    ) => data;
                  }
                case 2:
                  if ((value as CurrentKeyType).isProperty) {
                    if ((value as CurrentKeyType).properties?.length === 1) {
                      const currentProp = (
                        (value as CurrentKeyType).properties as any
                      )[0];
                      operand.render = (
                        data: any,
                        importData: any,
                        eachIndex: number | undefined
                      ) => importData[currentProp];
                      return 1;
                    } else {
                      operand.render = (
                        data: any,
                        importData: any,
                        eachIndex: number | undefined
                      ) => (value as CurrentKeyType as any)(importData);
                    }
                  } else {
                    operand.render = (
                      data: any,
                      importData: any,
                      eachIndex: number | undefined
                    ) => importData;
                  }
                case 3:
                  operand.render = (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => eachIndex;
                default:
                  operand.render = (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => undefined;
              }
            }
          } else {
            operand.render = render.bind(this, value);
          }
          return undefined;
        };
        const operation1 = getOperandOperationRender(
          render1,
          operand1 as OperandType
        );
        const operation2 = getOperandOperationRender(
          render2,
          operand2 as OperandType
        );
        if (operation1 !== undefined && operation2 !== undefined) {
          let getOptimizeRender: any;
          if (operation1 === 0 && operation2 === 0) {
            getOptimizeRender = (operation: number): RenderConditionType => {
              const { value: value1 } = operand1 as OperandType;
              const { value: value2 } = operand2 as OperandType;
              const currentProp1 = (
                (value1 as CurrentKeyType).properties as any
              )[0];
              const currentProp2 = (
                (value2 as CurrentKeyType).properties as any
              )[0];
              switch (operation) {
                case 2:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] == data[currentProp2];
                case 3:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] != data[currentProp2];
                case 4:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] === data[currentProp2];
                case 5:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] !== data[currentProp2];
                case 6:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] > data[currentProp2];
                case 7:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] >= data[currentProp2];
                case 8:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] < data[currentProp2];
                case 9:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] <= data[currentProp2];
                case 10:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] && data[currentProp2];
                case 11:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] || data[currentProp2];
                case 12:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] == data[currentProp2]);
                case 13:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] != data[currentProp2]);
                case 14:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] === data[currentProp2]);
                case 15:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] !== data[currentProp2]);
                case 16:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] > data[currentProp2]);
                case 17:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] >= data[currentProp2]);
                case 18:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] < data[currentProp2]);
                case 19:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] <= data[currentProp2]);
                case 20:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] && data[currentProp2]);
                case 21:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] || data[currentProp2]);
                case 22:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] == data[currentProp2]);
                case 23:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] != data[currentProp2]);
                case 24:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] === data[currentProp2]);
                case 25:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] !== data[currentProp2]);
                case 26:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] > data[currentProp2]);
                case 27:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] >= data[currentProp2]);
                case 28:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] < data[currentProp2]);
                case 29:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] <= data[currentProp2]);
                case 30:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] && data[currentProp2]);
                default:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] || data[currentProp2]);
              }
            };
          } else if (operation1 === 0 && operation2 === 1) {
            getOptimizeRender = (operation: number): RenderConditionType => {
              const { value: value1 } = operand1 as OperandType;
              const { value: value2 } = operand2 as OperandType;
              const currentProp1 = (
                (value1 as CurrentKeyType).properties as any
              )[0];
              const currentProp2 = (
                (value2 as CurrentKeyType).properties as any
              )[0];
              switch (operation) {
                case 2:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] == importData[currentProp2];
                case 3:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] != importData[currentProp2];
                case 4:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] === importData[currentProp2];
                case 5:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] !== importData[currentProp2];
                case 6:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] > importData[currentProp2];
                case 7:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] >= importData[currentProp2];
                case 8:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] < importData[currentProp2];
                case 9:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] <= importData[currentProp2];
                case 10:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] && importData[currentProp2];
                case 11:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => data[currentProp1] || importData[currentProp2];
                case 12:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] == importData[currentProp2]);
                case 13:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] != importData[currentProp2]);
                case 14:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] === importData[currentProp2]);
                case 15:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] !== importData[currentProp2]);
                case 16:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] > importData[currentProp2]);
                case 17:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] >= importData[currentProp2]);
                case 18:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] < importData[currentProp2]);
                case 19:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] <= importData[currentProp2]);
                case 20:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] && importData[currentProp2]);
                case 21:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(data[currentProp1] || importData[currentProp2]);
                case 22:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] == importData[currentProp2]);
                case 23:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] != importData[currentProp2]);
                case 24:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] === importData[currentProp2]);
                case 25:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] !== importData[currentProp2]);
                case 26:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] > importData[currentProp2]);
                case 27:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] >= importData[currentProp2]);
                case 28:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] < importData[currentProp2]);
                case 29:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] <= importData[currentProp2]);
                case 30:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] && importData[currentProp2]);
                default:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(data[currentProp1] || importData[currentProp2]);
              }
            };
          } else if (operation1 === 1 && operation2 === 0) {
            getOptimizeRender = (operation: number): RenderConditionType => {
              const { value: value1 } = operand1 as OperandType;
              const { value: value2 } = operand2 as OperandType;
              const currentProp1 = (
                (value1 as CurrentKeyType).properties as any
              )[0];
              const currentProp2 = (
                (value2 as CurrentKeyType).properties as any
              )[0];
              switch (operation) {
                case 2:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] == data[currentProp2];
                case 3:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] != data[currentProp2];
                case 4:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] === data[currentProp2];
                case 5:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] !== data[currentProp2];
                case 6:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] > data[currentProp2];
                case 7:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] >= data[currentProp2];
                case 8:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] < data[currentProp2];
                case 9:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] <= data[currentProp2];
                case 10:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] && data[currentProp2];
                case 11:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] || data[currentProp2];
                case 12:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] == data[currentProp2]);
                case 13:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] != data[currentProp2]);
                case 14:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] === data[currentProp2]);
                case 15:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] !== data[currentProp2]);
                case 16:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] > data[currentProp2]);
                case 17:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] >= data[currentProp2]);
                case 18:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] < data[currentProp2]);
                case 19:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] <= data[currentProp2]);
                case 20:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] && data[currentProp2]);
                case 21:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] || data[currentProp2]);
                case 22:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] == data[currentProp2]);
                case 23:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] != data[currentProp2]);
                case 24:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] === data[currentProp2]);
                case 25:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] !== data[currentProp2]);
                case 26:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] > data[currentProp2]);
                case 27:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] >= data[currentProp2]);
                case 28:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] < data[currentProp2]);
                case 29:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] <= data[currentProp2]);
                case 30:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] && data[currentProp2]);
                default:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] || data[currentProp2]);
              }
            };
          } else {
            getOptimizeRender = (operation: number): RenderConditionType => {
              const { value: value1 } = operand1 as OperandType;
              const { value: value2 } = operand2 as OperandType;
              const currentProp1 = (
                (value1 as CurrentKeyType).properties as any
              )[0];
              const currentProp2 = (
                (value2 as CurrentKeyType).properties as any
              )[0];
              switch (operation) {
                case 2:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] == importData[currentProp2];
                case 3:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] != importData[currentProp2];
                case 4:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] === importData[currentProp2];
                case 5:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] !== importData[currentProp2];
                case 6:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] > importData[currentProp2];
                case 7:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] >= importData[currentProp2];
                case 8:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] < importData[currentProp2];
                case 9:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] <= importData[currentProp2];
                case 10:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] && importData[currentProp2];
                case 11:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => importData[currentProp1] || importData[currentProp2];
                case 12:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] == importData[currentProp2]);
                case 13:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] != importData[currentProp2]);
                case 14:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] === importData[currentProp2]);
                case 15:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] !== importData[currentProp2]);
                case 16:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] > importData[currentProp2]);
                case 17:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] >= importData[currentProp2]);
                case 18:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] < importData[currentProp2]);
                case 19:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] <= importData[currentProp2]);
                case 20:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] && importData[currentProp2]);
                case 21:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !(importData[currentProp1] || importData[currentProp2]);
                case 22:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] == importData[currentProp2]);
                case 23:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] != importData[currentProp2]);
                case 24:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) =>
                    !!(importData[currentProp1] === importData[currentProp2]);
                case 25:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) =>
                    !!(importData[currentProp1] !== importData[currentProp2]);
                case 26:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] > importData[currentProp2]);
                case 27:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] >= importData[currentProp2]);
                case 28:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] < importData[currentProp2]);
                case 29:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] <= importData[currentProp2]);
                case 30:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] && importData[currentProp2]);
                default:
                  return (
                    data: any,
                    importData: any,
                    eachIndex: number | undefined
                  ) => !!(importData[currentProp1] || importData[currentProp2]);
              }
            };
          }
          val.render = getOptimizeRender(operation);
        } else {
          const getConditionOperationRender = () => {
            switch (operation) {
              case 2:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) ==
                  (operand2 as any).render(data, importData, eachIndex);
              case 3:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) !=
                  (operand2 as any).render(data, importData, eachIndex);
              case 4:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) ===
                  (operand2 as any).render(data, importData, eachIndex);
              case 5:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) !==
                  (operand2 as any).render(data, importData, eachIndex);
              case 6:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) >
                  (operand2 as any).render(data, importData, eachIndex);
              case 7:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) >=
                  (operand2 as any).render(data, importData, eachIndex);
              case 8:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) <
                  (operand2 as any).render(data, importData, eachIndex);
              case 9:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) <=
                  (operand2 as any).render(data, importData, eachIndex);
              case 10:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) &&
                  (operand2 as any).render(data, importData, eachIndex);
              case 11:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  (operand1 as any).render(data, importData, eachIndex) ||
                  (operand2 as any).render(data, importData, eachIndex);
              case 12:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) ==
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 13:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) !=
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 14:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) ===
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 15:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) !==
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 16:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) >
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 17:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) >=
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 18:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) <
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 19:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) <=
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 20:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) &&
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 21:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !(
                    (operand1 as any).render(data, importData, eachIndex) ||
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 22:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) ==
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 23:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) !=
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 24:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) ===
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 25:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) !==
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 26:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) >
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 27:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) >=
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 28:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) <
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 29:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) <=
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              case 30:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) &&
                    (operand2 as any).render(data, importData, eachIndex)
                  );
              default:
                return (
                  data: any,
                  importData: any,
                  eachIndex: number | undefined
                ) =>
                  !!(
                    (operand1 as any).render(data, importData, eachIndex) ||
                    (operand2 as any).render(data, importData, eachIndex)
                  );
            }
          };
          val.render = getConditionOperationRender();
        }
      } else {
        structuringValue(mainCurrentVal);
      }
    };
    optimizeValue(mainCurrentVal);
  } else {
    structuringValue(mainCurrentVal);
  }
  return { mainCurrentVal, isValueImport };
};
const parseValue = (
  valueFunctions: [
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  value: string,
  valueName?: string,
  importedDataName?: string,
  stackName?: string,
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
            stackName,
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
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  val: ValuesValueType,
  valueName?: string,
  importedDataName?: string,
  stackName?: string,
  indexName?: string
): KeyValuesType | undefined => {
  let keyValues: KeyValuesType | undefined = undefined;
  if (checkObject(val)) {
    keyValues = [];
    for (const [key, value] of Object.entries(val)) {
      const isArray = Array.isArray(value);
      const { mainCurrentVal: condition, isValueImport } = parseCondition(
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
        isValueImport,
        values: valueKeyValue,
        render: !isArray ? valueFunctions[3] : valueFunctions[4]
      };
      (keyValues as KeyValuesType).push(keyValue);
    }
  } else createError("Value render error");
  return keyValues;
};
