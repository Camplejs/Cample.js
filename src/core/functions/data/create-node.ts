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
import { renderComponentDynamicKeyData } from "./render-component-dynamic-key-data";
import { updateAttributes } from "./update-attributes";
import { updateText } from "./update-text";

export const createNode = (
  el: Element,
  index: number,
  data: DataComponentType | EachDataValueType,
  id: number,
  isEach: boolean,
  eachIndex?: number,
  isComponentData = true
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
    const dynamicText: DynamicTextType = {
      key: e,
      texts: [],
      oldValue: renderComponentDynamicKeyData(
        data,
        index,
        e,
        isEach,
        isComponentData
      )[0],
      value: renderComponentDynamicKeyData(
        data,
        index,
        e,
        isEach,
        isComponentData
      )[0]
    };
    dynamicTexts.push(dynamicText);
  });

  const node: NodeType = {
    updateText: (
      val: any = undefined,
      updVal: DynamicTextType,
      texts: TextArrayType,
      isProperty: boolean
    ) => updateText(el, val, updVal, texts, index, isProperty, isComponentData),
    updateAttr: (val: any, key: string, isProperty: boolean) =>
      updateAttributes(el, val, index, attrs, key, isProperty, isComponentData),
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
