"use-strict";
import { isValuesEqual } from "../../../shared/utils";
import { AttributesValType } from "../../../types/types";
import { renderData } from "../render/render-data";
import { renderTextData } from "../render/render-text-data";

export const updateAttributes = (
  el: Element,
  value: any,
  index: number,
  attrs: AttributesValType,
  currentKey: string
) => {
  if (el) {
    Object.entries(attrs).forEach(([key, val]) => {
      const renderAttr = () => {
        val.values[currentKey] = renderData(value, index);
        val.renderedValue = renderTextData(val.value, val.values);
        el.setAttribute(key, val.renderedValue);
      };
      if (el.hasAttribute(key)) {
        try {
          if (
            !isValuesEqual(val.values[currentKey], renderData(value, index))
          ) {
            renderAttr();
          }
        } catch (err) {
          renderAttr();
        }
      }
    });
  }
  return attrs;
};
