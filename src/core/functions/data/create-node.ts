"use-strict";
import { getAttrKeys, getTextKeys, testRegex } from "../../../shared/utils";
import {
  DataComponentType,
  DynamicTextArrayType,
  DynamicTextType,
  EachDataValueType,
  NodeType,
  TextArrayType
} from "../../../types/types";
import { returnDataValue } from "./return-data-value";
import { updateAttributes } from "./update-attributes";
import { updateText } from "./update-text";

export const createNode = (
  el: Element,
  index: number,
  data: DataComponentType | EachDataValueType,
  id: number,
  isEach: boolean,
  eachIndex?: number,
  valueName?: string
): NodeType => {
  const keys = getTextKeys(el);
  const dynamicTexts: DynamicTextArrayType = [];
  const attrs = {};
  const dynamicAttrs = getAttrKeys(el);
  const arrayAttr = Array.from(el.attributes);
  const regexAttr = arrayAttr
    .map((attr) => attr.value)
    .filter((a) => testRegex(a));
  if (regexAttr.length) {
    arrayAttr.forEach((e) => {
      const valArr = {};
      const regex = /\{{(.*?)}}/g;
      e.value.replace(regex, (str, d) => {
        const key = d.trim();
        valArr[key] = undefined;
        return str;
      });
      const attr = {
        values: valArr,
        value: e.value,
        renderedValue: e.value
      };
      attrs[e.name] = attr;
    });
  }

  keys.forEach((e) => {
    const value: DynamicTextType = {
      key: e,
      texts: [],
      oldValue: returnDataValue(data, e, isEach, valueName),
      value: returnDataValue(data, e, isEach, valueName)
    };
    dynamicTexts.push(value);
  });

  const node: NodeType = {
    updateText: (
      val: any = undefined,
      updVal: DynamicTextType,
      texts: TextArrayType
    ) => updateText(el, val, updVal, index, texts),
    updateAttr: (val: any, key: string) =>
      updateAttributes(el, val, index, attrs, key),
    index,
    attrs,
    texts: [],
    dynamicAttrs,
    dynamicTexts,
    dataId: id
  };
  if (isEach) {
    node.eachIndex = eachIndex;
  }
  return node;
};
