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
  EventEachGetDataType,
  EventEachGetFunctionType,
  EventGetDataType,
  IndexObjNode,
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

export const renderEl = (
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
  indexName?: string,
  isKeyed?: boolean,
  keyTemplate?: ValueItemsType,
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
    return {
      value,
      render: typeof value === "string" ? valueFunctions[2] : valueFunctions[3]
    };
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
              const keyEvent = e.name.substring(1);
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
                key
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
                indexName,
                true
              ) as CurrentKeyType;
            } else return e as string;
          };
          if (arrList.length === 1) {
            const val1 = getVal(arrList[0]);
            classList.value = createValItem(val1);
            delete classList.render;
          } else {
            classList.value = arrList.map((e) => {
              return createValItem(getVal(e));
            });
          }
          const newVal: ValueValueType = {
            classes: classList
          };
          addValue(undefined, newVal, 4);
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
                indexName,
                false
              ) as CurrentKeyType;
            }
            return val;
          };
          const keyArr = [...e.value.matchAll(TEXT_REGEX)];
          if (keyArr.length === 1) {
            keyTemplate.value = createValItem(getVal(keyArr[0]));
            keyTemplate.render = valueFunctions[1];
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
