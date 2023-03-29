"use-strict";
import { AttributesValType } from "../../../types/types";
import { renderData } from "../render/render-data";
import { renderTextData } from "../render/render-text-data";

export const updateAttributes = (
  el: Element,
  value: any,
  index: number,
  attrs: AttributesValType,
  currentKey: string,
  isProperty = false,
  isComponentData = true
) => {
  if (el) {
    Object.entries(attrs).forEach(([key, val]) => {
      if (el.hasAttribute(key)) {
        let newData: any;
        if (isComponentData) {
          newData = isProperty ? value : renderData(value, index);
        } else {
          newData = value;
        }
        val.values[currentKey] = newData;
        val.renderedValue = renderTextData(val.value, val.values);
        el.setAttribute(key, val.renderedValue);
      } else {
        delete attrs[key];
      }
    });
  }
  return attrs;
};
