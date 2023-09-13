"use-strict";
import {
  checkFunction,
  createError,
  testRegex,
  testValuesRegex
} from "../../../shared/utils";
import {
  AttributesValType,
  CurrentKeyType,
  EachTemplateNodesType,
  EventEachGetDataType,
  EventEachGetFunctionType,
  EventGetDataType,
  NodeType,
  NodeValuesType,
  ValueItemType,
  ValueItemsType,
  ValueType,
  ValuesTemplateType
} from "../../../types/types";
import { parseKey } from "../parse/parse-key";
import { renderEventKey } from "../render/render-event-key";
import { renderListeners } from "./render-listeners";

const { setAttribute, removeAttribute } = Element.prototype;
const regexKey = /\{\{\s*([^}]+)\s*\}\}|([^{}]+)/g;
const { push } = Array.prototype;

export const renderEl = (
  el: Element,
  index: number,
  idElement: number,
  getEventsData: EventGetDataType | EventEachGetDataType,
  nodes: EachTemplateNodesType,
  id: number,
  isEach: boolean,
  values: ValuesTemplateType,
  valueName?: string,
  importedDataName?: string,
  indexName?: string,
  isKeyed?: boolean,
  keyTemplate?: ValueItemsType,
  getEventsFunction?: EventEachGetFunctionType
) => {
  const arrayAttr = Array.from(el.attributes);
  const regexAttr = arrayAttr.filter((a) => testRegex(a.value));
  if (regexAttr.length) {
    const regex = /\{{(.*?)}}/g;
    regexAttr.forEach((e) => {
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
                value.replace(regex, (str, d) => {
                  if (!keys.hasOwnProperty(d)) {
                    const renderedKey = parseKey(
                      d,
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
              const newVal: ValueType = {
                id: values.length,
                type: "attribute",
                value: attr
              };
              values.push(newVal);
              nodes.push(idElement);
            } else {
              if (e.name[0] !== ":") createError("Event error");
              let key = "";
              value.replace(regex, (str, d) => {
                const filtredKey = d.trim();
                key = filtredKey;
                return str;
              });
              const renderedKey = renderEventKey(key);
              const args = [...renderedKey.arguments];
              const fn = isEach
                ? (getEventsFunction as EventEachGetFunctionType)?.(
                    renderedKey.key,
                    id,
                    key
                  )
                : (getEventsData as EventGetDataType)(
                    renderedKey.key,
                    id,
                    index
                  );
              if (!checkFunction(fn))
                createError("Data key is of function type");
              removeAttribute.call(el, e.name);
              const setEvent = (element: Element, keyEl?: string) => {
                renderListeners(
                  element,
                  fn,
                  args,
                  e.name.substring(1),
                  (key: string) =>
                    isEach
                      ? (getEventsData as EventEachGetDataType)(
                          key,
                          id,
                          keyEl,
                          index
                        )
                      : (getEventsData as EventGetDataType)(key, id, index)
                );
              };
              const newVal: ValueType = {
                id: values.length,
                type: "event",
                value: (element: Element, keyEl: string) =>
                  setEvent(element, keyEl)
              };
              values.push(newVal);
              nodes.push(idElement);
            }
          } else {
            const newVal: ValueType = {
              id: values.length,
              type: "import",
              value: {
                value: value.replace(/\{{{(.*?)}}}/g, (str, d) => {
                  const key: string = d;
                  if (key) return key;
                  return str;
                })
              }
            };
            values.push(newVal);
            nodes.push(idElement);
          }
        } else {
          const classList = Array.from(el.classList).map((e) => {
            if (testRegex(e)) {
              const key = e.replace(regex, (str, d) => {
                return d;
              });
              return parseKey(
                key,
                valueName,
                importedDataName,
                indexName,
                true
              ) as CurrentKeyType;
            } else return e as string;
          });
          const newVal: ValueType = {
            id: values.length,
            type: "class",
            value: {
              classList,
              oldClassList: {}
            }
          };
          values.push(newVal);
          nodes.push(idElement);
          setAttribute.call(el, "class", "");
        }
      } else {
        if (isKeyed && keyTemplate) {
          const keyArr = [...e.value.matchAll(regexKey)];
          keyArr.forEach((txt) => {
            let val: ValueItemType = txt[0];
            if (testRegex(val)) {
              const key = val.replace(regex, (str, d) => {
                return d;
              });
              val = parseKey(
                key,
                valueName,
                importedDataName,
                indexName,
                false
              ) as CurrentKeyType;
            }
            push.call(keyTemplate, val);
          });
          removeAttribute.call(el, e.name);
        } else {
          createError("key error");
        }
      }
    });
  }
};
export const createNode = (
  values: NodeValuesType,
  index: number,
  id: number,
  isFirst = false,
  key?: string,
  el?: Node
): NodeType => {
  const node: NodeType = {
    index,
    values,
    dataId: id
  };
  if (!isFirst) {
    node.isNew = true;
  }
  if (el) {
    node.el = el;
  }
  if (key !== undefined) {
    node.key = key;
  }

  return node;
};
