"use-strict";
import { AttributesType } from "../types/types";
export const renderAttributes = (
  element: any,
  renderingAttributes: AttributesType | undefined
): void => {
  if (typeof element === "undefined") return;

  if (renderingAttributes) {
    Object.keys(renderingAttributes).forEach((e) => {
      element.setAttribute(e, renderingAttributes[e]);
    });
  }
};
