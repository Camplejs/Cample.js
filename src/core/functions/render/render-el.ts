"use-strict";
import {
  IMPORT_REGEX,
  MAIN_REGEX,
  TEXT_REGEX,
  push,
  removeAttribute,
  setAttribute
} from "../../../config/config";
import { createError, testRegex, testValuesRegex } from "../../../shared/utils";
import {
  AttributesValType,
  CurrentKeyType,
  DynamicKeyObjectArrayType,
  EachTemplateNodesType,
  EventEachGetDataType,
  EventEachGetFunctionType,
  EventGetDataType,
  ValueItemType,
  ValueItemsType,
  ValueType,
  ValueValueType,
  ValuesTemplateType,
  ValuesType
} from "../../../types/types";
import { parseKey } from "../parse/parse-key";
import { renderEventKey } from "../render/render-event-key";

export const renderEl = (
  filtredKeys: DynamicKeyObjectArrayType,
  eventArray: any[],
  setEventListener: () => void,
  el: Element,
  index: number,
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
    if (!nodes.includes(idElement)) {
      indexNode = nodes.length;
      push.call(nodes, idElement);
    } else {
      indexNode = nodes.indexOf(idElement);
    }
    let val: ValueType;
    if (currentValue) {
      val = currentValue;
      (val as any).elId = indexNode;
    } else {
      val = {
        id: indexNode,
        type,
        value: value as ValueValueType
      };
    }
    push.call(values, val);
    return val;
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
                args,
                keyEvent,
                getEventsData,
                getEventsFunction,
                renderedKey,
                id,
                key
              };
              removeAttribute.call(el, e.name);
              if (keyEvent === "click") {
                setEventListener();
              }
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
          const classList = Array.from(el.classList).map((e) => {
            if (testRegex(e)) {
              const key = e.replace(MAIN_REGEX, (_, d) => {
                return d;
              });
              return parseKey(
                key,
                optionValues,
                valueName,
                importedDataName,
                indexName,
                true
              ) as CurrentKeyType;
            } else return e as string;
          });
          const newVal: ValueValueType = {
            classList,
            oldClassList: {},
            oldClassListString: ""
          };
          addValue(undefined, newVal, 4);
          setAttribute.call(el, "class", "");
        }
      } else {
        if (isKeyed && keyTemplate) {
          const keyArr = [...e.value.matchAll(TEXT_REGEX)];
          for (const txt of keyArr) {
            let val: ValueItemType = txt[0];
            if (testRegex(val)) {
              const key = val.replace(MAIN_REGEX, (_, d) => {
                return d;
              });
              val = parseKey(
                key,
                optionValues,
                valueName,
                importedDataName,
                indexName,
                false
              ) as CurrentKeyType;
            }
            push.call(keyTemplate, val);
          }
          removeAttribute.call(el, e.name);
        } else {
          createError("key error");
        }
      }
    }
  }
};
