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
  EventGetDataType,
  NodeType,
  NodeValuesType,
  ValueType,
  ValuesTemplateType
} from "../../../types/types";
import { parseKey } from "../parse/parse-key";
import { renderEventKey } from "../render/render-event-key";
import { renderListeners } from "./render-listeners";

const setAttr = Element.prototype.setAttribute;
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
  importedDataName?: string
) => {
  const arrayAttr = Array.from(el.attributes);
  const regexAttr = arrayAttr.filter((a) => testRegex(a.value));
  if (regexAttr.length) {
    const regex = /\{{(.*?)}}/g;
    regexAttr.forEach((e) => {
      const value = e.value;
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
                  const renderedKey = parseKey(d, valueName, importedDataName);
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
              ? (getEventsData as EventEachGetDataType)(
                  renderedKey.key,
                  id,
                  0,
                  index
                )
              : (getEventsData as EventGetDataType)(renderedKey.key, id, index);
            if (!checkFunction(fn)) createError("Data key is of function type");
            el.removeAttribute(e.name);
            const setEvent = (element: Element, eIndex?: number) => {
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
                        eIndex,
                        index
                      )
                    : (getEventsData as EventGetDataType)(key, id, index)
              );
            };
            const newVal: ValueType = {
              id: values.length,
              type: "event",
              value: (element: Element, eIndex?: number) =>
                setEvent(element, eIndex)
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
            const key = e.replace(/\{{(.*?)}}/g, (str, d) => {
              return d;
            });
            return parseKey(
              key,
              valueName,
              importedDataName,
              true
            ) as CurrentKeyType;
          } else return e as string;
        });
        const newVal: ValueType = {
          id: values.length,
          type: "class",
          value: {
            classList,
            oldClassList: []
          }
        };
        values.push(newVal);
        nodes.push(idElement);
        setAttr.call(el, "class", "");
      }
    });
  }
};
export const createNode = (
  values: NodeValuesType,
  index: number,
  id: number,
  isEach: boolean,
  eachIndex?: number,
  isFirst = false
): NodeType => {
  const node: NodeType = {
    index,
    values,
    dataId: id
  };
  if (!isFirst) {
    node.isNew = true;
  }
  if (isEach) {
    node.eachIndex = eachIndex;
  }
  return node;
};
