"use-strict";
import { createError } from "../../../shared/utils";
import {
  ConditionType,
  ElementsType,
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
              if (
                renderType !== "component" &&
                renderType !== "animation" &&
                renderType !== "each"
              ) {
                if (functions.length) {
                  functions[0](el);
                }
              } else {
                functions.forEach((func, i) => {
                  if (i === 0 && renderType === "each") {
                    return func([el], el?.parentNode);
                  } else return func(el);
                });
              }
            } else {
              createError(
                "Component include only one node with type 'Element'"
              );
            }
          } else {
            if (
              renderType !== "component" &&
              renderType !== "animation" &&
              renderType !== "ternary"
            ) {
              const elArray: ElementsType = [];
              if (parent) {
                try {
                  if (renderType === "each") {
                    for (const child of content.children) {
                      elArray.push(child);
                    }
                  }
                  while (content.firstChild) {
                    parent.insertBefore(content.firstChild, e);
                  }
                  parent.removeChild(e);
                } catch (err) {
                  createError(`${err}`);
                }
              } else {
                if (renderType === "each") createError("Each Element error");
              }
              if (functions.length) {
                if (renderType !== "each") {
                  functions[0](null);
                } else {
                  functions.forEach((func, i) => {
                    if (i === 0) {
                      return func(elArray, parent);
                    } else return func(null);
                  });
                }
              }
            } else {
              createError(
                "Component include only one node with type 'Element'"
              );
            }
          }
        }
      } else {
        if (parent && renderType !== "each") {
          parent.removeChild(e);
        }
        switch (renderType) {
          case "component":
            functions[1](null);
            break;
          case "each":
            const previousNode = e.previousSibling;
            const nextNode = e.nextSibling;
            if (parent) {
              parent.removeChild(e);
            }
            functions.forEach((func, i) => {
              if (i === 0) {
                func([], parent, previousNode, nextNode);
              } else func(null);
            });
            break;
        }
      }
    } else createError("Element instanceof HTMLTemplateElement");
  } else {
    if (renderType === "component" || renderType === "each") {
      functions.forEach((func, i) => {
        if (renderType === "each" && i === 0) {
          const previousNode = e.previousSibling;
          const nextNode = e.nextSibling;
          func([], e?.parentNode, previousNode, nextNode);
        } else func(e);
      });
    }
  }
};
