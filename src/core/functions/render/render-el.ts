"use-strict";
import {
  IMPORT_REGEX,
  MAIN_REGEX,
  TEXT_REGEX,
  push,
  removeAttribute,
  setAttribute
} from "../../../config/config";
import {
  createError,
  getKey,
  testRegex,
  testValuesRegex
} from "../../../shared/utils";
import {
  AttributesValType,
  CurrentKeyType,
  DynamicNodesObjectType,
  EachStack,
  EventEachGetDataType,
  EventEachGetFunctionType,
  EventGetDataType,
  ImportDataType,
  IndexObjNode,
  NodeValuesType,
  ValueItemType,
  ValueItemsType,
  ValueType,
  ValueValueType,
  ValuesTemplateType,
  ValuesType
} from "../../../types/types";
import { parseKey } from "../parse/parse-key";
import { renderEventKey } from "../render/render-event-key";
import { renderComponentDynamicKey } from "./render-component-dynamic-key";
import { renderKey } from "./render-key";
import { renderValues } from "./render-values";

export const renderEl = (
  setEventListener: () => void,
  isEach: boolean | undefined,
  valueFunctions: [
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  eventArray: any[],
  el: Element,
  getEventsData1: EventGetDataType | EventEachGetDataType,
  getEventsData2: EventGetDataType | undefined,
  newNode: IndexObjNode,
  dynamicNodesObj: DynamicNodesObjectType,
  id: number,
  values: ValuesTemplateType,
  optionValues?: ValuesType,
  valueName?: string,
  importedDataName?: string,
  stackName?: string,
  indexName?: string,
  isKeyed?: boolean,
  keyTemplate?: ValueItemsType,
  eachStackValues?: NodeValuesType,
  getEventsFunction?: EventEachGetFunctionType
) => {
  const arrayAttr = Array.from(el.attributes);
  const regexAttr = arrayAttr.filter((a) => testRegex(a.value));
  const addValue = (
    currentValue: ValueType | undefined = undefined,
    value: ValueValueType | undefined = undefined,
    type = 0
  ) => {
    let val: ValueType;
    if (currentValue) {
      val = currentValue;
      (val as any).elId = newNode.id;
    } else {
      val = {
        id: newNode.id,
        type,
        ...value
      } as ValueType;
    }
    if (newNode?.node)
      dynamicNodesObj[newNode.id as number] = newNode.node.path;
    push.call(values, val);
    return val;
  };
  const createValItem = (value: string | CurrentKeyType) => {
    if (typeof value === "string") {
      return {
        value,
        render: valueFunctions[2]
      };
    } else {
      if (isEach === true) {
        let currentRender: any;
        if (value.isValue) {
          currentRender = (
            key: CurrentKeyType,
            data: any,
            importData: any,
            eachIndex: number | undefined
          ) => {
            const str = {
              value: ""
            };
            renderValues(str, key, data, importData, eachIndex);
            return str.value;
          };
        } else {
          switch (value.originType) {
            case 1:
              currentRender = (
                key: CurrentKeyType,
                data: any,
                importData: any,
                eachIndex: number | undefined
              ) => (key.render as any)(data);
              break;
            case 2:
              currentRender = (
                key: CurrentKeyType,
                data: any,
                importData: any,
                eachIndex: number | undefined
              ) => (key.render as any)(importData);
              break;
            case 3:
              currentRender = (
                key: CurrentKeyType,
                data: any,
                importData: any,
                eachIndex: number | undefined
              ) => eachIndex;
              break;
            default:
              currentRender = (
                key: CurrentKeyType,
                data: any,
                importData: any,
                eachIndex: number | undefined
              ) => undefined;
              break;
          }
        }
        return {
          value,
          render: currentRender
        };
      } else {
        return {
          value,
          render: valueFunctions[3]
        };
      }
    }
  };
  if (regexAttr.length) {
    for (const e of regexAttr) {
      const value = e.value;
      if (e.name !== "key") {
        if (e.name !== "class") {
          if (e.name !== "data-cample-import") {
            if (
              !(
                e.name.includes(":") ||
                e.value.includes("(") ||
                e.value.includes(")")
              )
            ) {
              const isValue = testValuesRegex(value);
              const keys: {
                [key: string]: CurrentKeyType;
              } = {};
              if (!isValue)
                value.replace(MAIN_REGEX, (_, d) => {
                  if (!keys.hasOwnProperty(d)) {
                    const renderedKey = parseKey(
                      d,
                      [
                        valueFunctions[3],
                        valueFunctions[4],
                        valueFunctions[2],
                        valueFunctions[5],
                        valueFunctions[6],
                        valueFunctions[7],
                        valueFunctions[8],
                        valueFunctions[9],
                        valueFunctions[10],
                        valueFunctions[11]
                      ],
                      optionValues,
                      valueName,
                      importedDataName,
                      indexName
                    );
                    keys[d] = renderedKey;
                  }
                  return d;
                });
              const attr: AttributesValType = {
                name: e.name,
                value: isValue ? [value, isValue] : value,
                keys
              };
              addValue(undefined, attr, 2);
              setAttribute.call(el, e.name, "");
            } else {
              if (e.name[0] !== ":") createError("Event error");
              const isItemEvent = e.name[1] === ":";
              if (isItemEvent && !isEach) createError("Event error");
              let key = "";
              value.replace(MAIN_REGEX, (str, d) => {
                const filtredKey = d.trim();
                key = filtredKey;
                return str;
              });
              const renderedKey = renderEventKey(key);
              const args = [...renderedKey.arguments].filter(Boolean);
              const currentArgs =
                isEach === true
                  ? args.map((e) => {
                      return {
                        renderedKey: renderComponentDynamicKey(renderKey(e)),
                        getEventsDataFn:
                          getKey(e) === valueName
                            ? getEventsData1
                            : getEventsData2
                      };
                    })
                  : args;
              const keyEvent = e.name.substring(isItemEvent ? 2 : 1);
              if (keyEvent === "click") {
                setEventListener();
              }
              const event = {
                elId: 0,
                indexValue: values.length,
                args: currentArgs,
                keyEvent,
                getEventsData1,
                getEventsFunction,
                renderedKey,
                id,
                values,
                key,
                isItemEvent
              };
              removeAttribute.call(el, e.name);
              eventArray.push(addValue(event as unknown as ValueType));
            }
          } else {
            const newVal: ValueValueType = {
              value: value.replace(IMPORT_REGEX, (str, d) => {
                const key: string = d;
                if (key) return key;
                return str;
              })
            };
            addValue(undefined, newVal, 3);
          }
        } else {
          const arrList = Array.from(el.classList);
          const classList: any = {
            value: [],
            render: valueFunctions[0]
          };
          const getVal = (e: string) => {
            if (testRegex(e)) {
              const key = e.replace(MAIN_REGEX, (_, d) => {
                return d;
              });
              return parseKey(
                key,
                [
                  valueFunctions[3],
                  valueFunctions[4],
                  valueFunctions[2],
                  valueFunctions[5],
                  valueFunctions[6],
                  valueFunctions[7],
                  valueFunctions[8],
                  valueFunctions[9],
                  valueFunctions[10],
                  valueFunctions[11]
                ],
                optionValues,
                valueName,
                importedDataName,
                stackName,
                indexName,
                true
              ) as CurrentKeyType;
            } else return e as string;
          };
          const isLength = arrList.length === 1;
          if (isLength) {
            const val1 = getVal(arrList[0]);
            classList.value = createValItem(val1);
            delete classList.render;
          } else {
            classList.value = arrList.map((e) => {
              return createValItem(getVal(e));
            });
          }
          if (isLength && classList.value.value.originType === 4) {
            const eachStackValue = (
              el: Element,
              eachStack: EachStack,
              value?: any
            ) => {
              const renderKeyClass = classList.value.value.render;
              const currentValue =
                value !== undefined ? value : renderKeyClass(eachStack);
              if (el.className !== currentValue) {
                el.className = currentValue;
              }
            };
            eachStackValues!.push(eachStackValue);
          } else {
            const newVal: ValueValueType = {
              classes: classList
            };
            addValue(undefined, newVal, 4);
          }
          setAttribute.call(el, "class", "");
        }
      } else {
        if (isKeyed && keyTemplate) {
          const getVal = (txt: RegExpMatchArray) => {
            let val: string | CurrentKeyType = txt[0];
            if (testRegex(val)) {
              const key = val.replace(MAIN_REGEX, (_, d) => {
                return d;
              });
              val = parseKey(
                key,
                [
                  valueFunctions[3],
                  valueFunctions[4],
                  valueFunctions[2],
                  valueFunctions[5],
                  valueFunctions[6],
                  valueFunctions[7],
                  valueFunctions[8],
                  valueFunctions[9],
                  valueFunctions[10],
                  valueFunctions[11]
                ],
                optionValues,
                valueName,
                importedDataName,
                stackName,
                indexName,
                false
              ) as CurrentKeyType;
            }
            return val;
          };
          const keyArr = [...e.value.matchAll(TEXT_REGEX)];
          if (keyArr.length === 1) {
            const val = getVal(keyArr[0]);
            keyTemplate.value = createValItem(val);
            if (typeof val === "string") {
              keyTemplate.render = valueFunctions[1];
            } else {
              const { render: renderVal } = val;
              if (val.properties?.length === 1 && !val.isValue) {
                const prop = (val.properties as any)[0];
                switch (val.originType) {
                  case 1:
                    keyTemplate.render = (
                      indexData: any,
                      value: ValueItemType,
                      importData: ImportDataType | undefined,
                      eachIndex?: number
                    ) => indexData[prop];
                    break;
                  case 2:
                    keyTemplate.render = (
                      indexData: any,
                      value: ValueItemType,
                      importData: ImportDataType | undefined,
                      eachIndex?: number
                    ) => importData?.[prop];
                    break;
                  case 3:
                    keyTemplate.render = ((
                      indexData: any,
                      value: ValueItemType,
                      importData: ImportDataType | undefined,
                      eachIndex?: number
                    ) => eachIndex) as any;
                    break;
                  default:
                    keyTemplate.render = ((
                      indexData: any,
                      value: ValueItemType,
                      importData: ImportDataType | undefined,
                      eachIndex?: number
                    ) => undefined) as any;
                    break;
                }
              } else {
                switch (val.originType) {
                  case 1:
                    keyTemplate.render = (
                      indexData: any,
                      value: ValueItemType,
                      importData: ImportDataType | undefined,
                      eachIndex?: number
                    ) => (renderVal as any)(indexData);
                    break;
                  case 2:
                    keyTemplate.render = (
                      indexData: any,
                      value: ValueItemType,
                      importData: ImportDataType | undefined,
                      eachIndex?: number
                    ) => (renderVal as any)(importData);
                    break;
                  case 3:
                    keyTemplate.render = ((
                      indexData: any,
                      value: ValueItemType,
                      importData: ImportDataType | undefined,
                      eachIndex?: number
                    ) => eachIndex) as any;
                    break;
                  default:
                    keyTemplate.render = ((
                      indexData: any,
                      value: ValueItemType,
                      importData: ImportDataType | undefined,
                      eachIndex?: number
                    ) => undefined) as any;
                    break;
                }
              }
            }
          } else {
            for (const txt of keyArr) {
              const val = createValItem(getVal(txt));
              push.call(keyTemplate, val);
            }
          }
          removeAttribute.call(el, e.name);
        } else {
          createError("key error");
        }
      }
    }
  }
};
