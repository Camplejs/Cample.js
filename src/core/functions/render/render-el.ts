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
  getIndexOf,
  isIncludes,
  testRegex,
  testValuesRegex
} from "../../../shared/utils";
import {
  AttributesValType,
  CurrentKeyType,
  DynamicKeyObjectArrayType,
  EachTemplateNodesType,
  EventEachGetDataType,
  EventEachGetFunctionType,
  EventGetDataType,
  IndexObjNode,
  NodeDOMType,
  ValueItemsType,
  ValueType,
  ValueValueType,
  ValuesTemplateType,
  ValuesType
} from "../../../types/types";
import { parseKey } from "../parse/parse-key";
import { renderEventKey } from "../render/render-event-key";

export const renderEl = (
  nodeDom: NodeDOMType,
  valueFunctions: [
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  filtredKeys: DynamicKeyObjectArrayType,
  eventArray: any[],
  el: Element,
  idElement: number,
  getEventsData: EventGetDataType | EventEachGetDataType,
  nodes: EachTemplateNodesType,
  id: number,
  isEach: boolean | undefined,
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
    let indexNode: number;
    if (!isIncludes(nodes, idElement)) {
      indexNode = nodes.length;
      const node: IndexObjNode = {
        rootId: indexNode - 1,
        id: idElement,
        node: nodeDom
      };
      push.call(nodes, node);
    } else {
      indexNode = getIndexOf(nodes, idElement);
    }
    let val: ValueType;
    if (currentValue) {
      val = currentValue;
      (val as any).elId = indexNode;
    } else {
      val = {
        id: indexNode,
        type,
        ...value
      } as ValueType;
    }
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
                        valueFunctions[8]
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
              const keyEvent = e.name.substring(1);
              const event = {
                elId: 0,
                indexValue: values.length,
                args,
                keyEvent,
                getEventsData,
                getEventsFunction,
                renderedKey,
                id,
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
          const classList: ValueItemsType = {
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
                  valueFunctions[8]
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
            classList.render = valueFunctions[1];
          } else {
            classList.value = arrList.map((e) => {
              return createValItem(getVal(e));
            });
          }
          const newVal: ValueValueType = {
            classes: classList,
            old: ""
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
                  valueFunctions[8]
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
