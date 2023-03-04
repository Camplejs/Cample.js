"use-strict";
import { createError } from "../../../shared/utils";
import {
  ConditionType,
  FunctionsArray,
  RenderComponentType
} from "../../../types/types";

export const renderHTML = (
  e: Element,
  template: string,
  replaceTag: ConditionType,
  replaceTags: ConditionType,
  functions: FunctionsArray,
  renderType: RenderComponentType,
  trimHTML: ConditionType
) => {
  if (trimHTML) {
    e.innerHTML = template.trim();
  } else {
    e.innerHTML = template;
  }
  if ((replaceTags && replaceTag === undefined) || replaceTag) {
    if (e instanceof HTMLTemplateElement) {
      const content = e.content;
      const parent = e.parentNode;
      if (content.childNodes.length > 0) {
        if (parent) {
          if (content.childNodes.length === 1) {
            if (
              content.childNodes[0].nodeType === Node.ELEMENT_NODE &&
              content.firstElementChild
            ) {
              parent.insertBefore(content.firstElementChild, e);
              const el = e.previousElementSibling;
              parent.removeChild(e);
              if (renderType !== "component" && renderType !== "animation") {
                if (functions.length) {
                  functions[0](el);
                }
              } else {
                switch (renderType) {
                  case "component":
                    functions[0](el);
                    functions[1](el);
                    break;
                  case "animation":
                    functions.forEach((func) => {
                      func(el);
                    });
                    break;
                }
              }
            } else {
              createError(
                "Error: Component include only one node with type 'Element'"
              );
            }
          } else {
            if (
              renderType !== "component" &&
              renderType !== "animation" &&
              renderType !== "ternary"
            ) {
              if (parent) {
                try {
                  while (content.firstChild) {
                    parent.insertBefore(content.firstChild, e);
                  }
                  parent.removeChild(e);
                } catch (err) {
                  createError(`${err}`);
                }
              }
              if (functions.length) {
                functions[0](null);
              }
            } else {
              createError(
                "Error: Component include only one node with type 'Element'"
              );
            }
          }
        }
      } else {
        if (parent) {
          parent.removeChild(e);
        }
        switch (renderType) {
          case "component":
            functions[1](null);
            break;
        }
      }
    } else createError("Error: Element instanceof HTMLTemplateElement");
  } else {
    switch (renderType) {
      case "component":
        functions[0](e);
        functions[1](e);
        break;
    }
  }
};
