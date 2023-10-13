"use-strict";
import { createError, getElement, getTextKey } from "../../../shared/utils";
import {
  DynamicTextType,
  EachTemplateType,
  EventEachGetFunctionType,
  ValuesType
} from "../../../types/types";
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
  valueName?: string,
  importedDataName?: string,
  indexName?: string,
  isEach?: boolean,
  getEventsFunction?: EventEachGetFunctionType
): EachTemplateType => {
  const el = getElement(template, trim);
  const obj: EachTemplateType = {
    el,
    nodes: [],
    values: []
  };
  if (isEach) {
    obj.key = [];
  }
  let i = -1;
  const renderNode = (node: ChildNode) => {
    i++;
    if (node.nodeType === Node.ELEMENT_NODE) {
      parseText(node as Element);
      renderEl(
        setEventListener,
        node as Element,
        index,
        i,
        getEventsData,
        obj.nodes,
        id,
        true,
        obj.values,
        values,
        valueName,
        importedDataName,
        indexName,
        i === 0 && isEach,
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
            obj.values.push({
              type: 1,
              value: dynamicText
            });
          }
          obj.nodes.push(i);
        }
      }
    }
  };
  renderNode(el as ChildNode);
  return obj;
};
