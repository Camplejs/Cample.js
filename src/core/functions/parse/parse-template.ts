"use-strict";
import { createError, getElement, getTextKey } from "../../../shared/utils";
import { DynamicTextType, EachTemplateType } from "../../../types/types";
import { renderEl } from "../data/create-node";
import { parseKey } from "./parse-key";
import { parseText } from "./parse-text";

export const parseTemplate = (
  template: string,
  index: number,
  id: number,
  trim?: boolean,
  getEventsData?: any,
  valueName?: string,
  importedDataName?: string
): EachTemplateType => {
  const el = getElement(template, trim);
  const obj: EachTemplateType = {
    el,
    nodes: [],
    values: []
  };
  let i = -1;
  const renderNode = (node: ChildNode) => {
    i++;
    if (node.nodeType === Node.ELEMENT_NODE) {
      parseText(node as Element);
      renderEl(
        node as Element,
        index,
        i,
        getEventsData,
        obj.nodes,
        id,
        true,
        obj.values,
        valueName,
        importedDataName
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
            (e) =>
              e.type === "dynamicText" &&
              (e.value as DynamicTextType).key.key === key
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
            const renderedKey = parseKey(key, valueName, importedDataName);
            const dynamicText: DynamicTextType = {
              key: renderedKey,
              texts: [obj.nodes.length]
            };
            obj.values.push({
              type: "dynamicText",
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
