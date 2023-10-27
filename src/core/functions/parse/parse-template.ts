"use-strict";
import { push } from "../../../config/config";
import {
  checkFunction,
  createError,
  getElement,
  getTextKey
} from "../../../shared/utils";
import {
  DynamicKeyObjectArrayType,
  DynamicTextType,
  EachTemplateType,
  EventEachGetDataType,
  EventEachGetFunctionType,
  EventGetDataType,
  FunctionsType,
  ValueType,
  ValuesType
} from "../../../types/types";
import { renderListeners } from "../data/render-listeners";
import { renderEl } from "../render/render-el";
import { parseKey } from "./parse-key";
import { parseText } from "./parse-text";

export const parseTemplate = (
  setEventListener: () => void,
  template: string,
  index: number,
  id: number,
  values?: ValuesType,
  trim?: boolean,
  getEventsData?: any,
  getEventsFunction?: EventEachGetFunctionType,
  setDataFunctions?: (filtredKeys: DynamicKeyObjectArrayType) => void,
  renderFunctions?: () => void,
  functions?: FunctionsType,
  valueName?: string,
  importedDataName?: string,
  indexName?: string,
  isEach?: boolean
): {
  filtredKeys: DynamicKeyObjectArrayType;
  obj: EachTemplateType;
} => {
  const el = getElement(template, trim);
  const filtredKeys: DynamicKeyObjectArrayType = [];
  const obj: EachTemplateType = {
    el,
    nodes: [],
    values: []
  };
  if (isEach) {
    obj.key = [];
  }
  let i = -1;
  const eventArray: any[] = [];
  const renderNode = (node: ChildNode) => {
    i++;
    if (node.nodeType === Node.ELEMENT_NODE) {
      parseText(node as Element);
      renderEl(
        filtredKeys,
        eventArray,
        setEventListener,
        node as Element,
        index,
        i,
        getEventsData,
        obj.nodes,
        id,
        isEach,
        obj.values,
        values,
        valueName,
        importedDataName,
        indexName,
        id === 0 && isEach,
        obj.key,
        getEventsFunction
      );
      for (
        let currentNode = node.firstChild;
        currentNode;
        currentNode = currentNode.nextSibling
      ) {
        renderNode(currentNode);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) {
        const key: string | undefined = getTextKey(text);
        if (key) {
          const data = obj.values.filter(
            (e) => e.type === 1 && (e.value as DynamicTextType).key.key === key
          );
          if (data.length > 1) {
            createError("id is unique");
          }
          const index = obj.values.indexOf(data[0]);
          if (index > -1) {
            (obj.values[index].value as DynamicTextType).texts.push(
              obj.nodes.length
            );
          } else {
            const renderedKey = parseKey(
              key,
              values,
              valueName,
              importedDataName,
              indexName
            );
            const dynamicText: DynamicTextType = {
              key: renderedKey,
              texts: [obj.nodes.length]
            };
            filtredKeys.push({
              key: renderedKey.originKey,
              properties: renderedKey.properties ?? []
            });
            obj.values.push({
              type: 1,
              value: dynamicText
            });
          }
          if (!obj.nodes.includes(i)) {
            push.call(obj.nodes, i);
          }
        }
      }
    }
  };
  renderNode(el as ChildNode);
  setDataFunctions?.(filtredKeys);
  renderFunctions?.();
  for (const {
    elId,
    args,
    keyEvent,
    getEventsData,
    getEventsFunction,
    renderedKey,
    id,
    key
  } of eventArray) {
    const fn = isEach
      ? (getEventsFunction as EventEachGetFunctionType)?.(
          renderedKey.key,
          id,
          key
        )
      : (getEventsFunction as EventEachGetFunctionType)?.(
          renderedKey.key,
          id,
          key,
          functions
        );
    if (!checkFunction(fn)) createError("Data key is of function type");
    const setEvent = (element: Element, keyEl?: string) => {
      renderListeners(element, fn, args, keyEvent, (key: string) =>
        isEach
          ? (getEventsData as EventEachGetDataType)(key, id, keyEl, index)
          : (getEventsData as EventGetDataType)(key, id)
      );
    };
    const newVal: ValueType = {
      id: elId,
      type: 0,
      value: (element: Element, keyEl: string) => setEvent(element, keyEl)
    };
    obj.values[elId] = newVal;
  }
  return { filtredKeys, obj };
};
