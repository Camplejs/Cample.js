"use-strict";
import { createError } from "../../../shared/utils";
import { renderAttributes } from "./render-attributes";
import { SelectorType, AttributesType } from "../../../types/types";

export const renderTemplateElement = (
  selector: SelectorType,
  id: string | undefined,
  classElement: string | undefined,
  attributes: AttributesType | undefined
): any => {
  if (selector) {
    let templateElement: HTMLElement | null = null;
    templateElement = document.createElement(selector);
    if (id) templateElement.setAttribute("id", id);
    if (classElement) templateElement.classList.add(classElement);
    if (attributes) renderAttributes(templateElement, attributes);
    return templateElement;
  } else {
    createError("Error: Property 'selector' is required");
  }
};
