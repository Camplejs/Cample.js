"use-strict";
import { renderAttributes } from "./render-attributes";
import { SelectorType, AttributesType } from "../types/types";

export const renderTemplateElement = (
  selector: SelectorType,
  id: string | undefined,
  classElement: string | undefined,
  attributes: AttributesType | undefined
): any => {
  let templateElement: HTMLElement | null = null;
  if (selector) {
    templateElement = document.createElement(selector);
    if (id) templateElement.setAttribute("id", id);
    if (classElement) templateElement.classList.add(classElement);
    if (attributes) renderAttributes(templateElement, attributes);
  }
  return templateElement;
};
