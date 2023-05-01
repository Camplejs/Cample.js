"use-strict";
import {
  checkFunction,
  createError,
  getAttrKeys,
  getTextKeys,
  testRegex
} from "../../../shared/utils";
import {
  ArgumentsArrayType,
  DataComponentType,
  DynamicTextArrayType,
  DynamicTextType,
  EachDataValueType,
  EventEachGetDataType,
  EventFunctionType,
  EventGetDataType,
  ImportDataType,
  ListenersType,
  NodeType,
  TextArrayType
} from "../../../types/types";
import { renderEventKey } from "../render/render-event-key";
import { renderComponentDynamicKeyData } from "./render-component-dynamic-key-data";
import { updateAttributes } from "./update-attributes";
import { updateListeners } from "./update-listeners";
import { updateText } from "./update-text";

export const createNode = (
  el: Element,
  index: number,
  getEventsData: EventGetDataType | EventEachGetDataType,
  data: DataComponentType | EachDataValueType,
  id: number,
  isEach: boolean,
  eachIndex?: number,
  isComponentData = true,
  importData: ImportDataType | undefined = undefined
): NodeType => {
  const keys = getTextKeys(el);
  const dynamicTexts: DynamicTextArrayType = [];
  const attrs = {};
  const listeners: ListenersType = {};
  const attrsKeysArray = getAttrKeys(el);
  const dynamicAttrs = attrsKeysArray[0];
  const arrayAttr = Array.from(el.attributes);
  const regexAttr = arrayAttr
    .map((attr) => attr.value)
    .filter((a) => testRegex(a));

  if (regexAttr.length) {
    const regex = /\{{(.*?)}}/g;
    arrayAttr.forEach((e) => {
      if (
        !(
          e.name.includes(":") ||
          e.value.includes("(") ||
          e.value.includes(")")
        )
      ) {
        const valArr = {};
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
      } else {
        if (e.name[0] !== ":") createError("Event error");
        let key = "";
        e.value.replace(regex, (str, d) => {
          const filtredKey = d.trim();
          key = filtredKey;
          return str;
        });
        const renderedKey = renderEventKey(key);
        const fn = isEach
          ? (getEventsData as EventEachGetDataType)(
              renderedKey.key,
              id,
              eachIndex,
              index
            )
          : (getEventsData as EventGetDataType)(renderedKey.key, id, index);
        if (!checkFunction(fn)) createError("Data key is of function type");
        listeners[e.name.substring(1)] = {
          value: renderedKey,
          fn
        };
      }
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
    updateListeners: (
      fn: EventFunctionType,
      args: ArgumentsArrayType,
      key: string,
      isFirst = true,
      eachIndex?: number
    ) =>
      updateListeners(
        el,
        fn,
        args,
        key,
        (key: string) =>
          isEach
            ? (getEventsData as EventEachGetDataType)(key, id, eachIndex, index)
            : (getEventsData as EventGetDataType)(key, id, index),
        isFirst
      ),
    index,
    attrs,
    listeners,
    texts: [],
    dynamicAttrs,
    dynamicTexts,
    dataId: id
  };
  if (isEach) {
    node.eachIndex = eachIndex;
    node.isListeners = true;
  }

  return node;
};
