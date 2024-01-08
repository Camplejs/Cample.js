"use-strict";
import { appendChild } from "../../../config/config";
import { createError } from "../../../shared/utils";
import { FunctionsArray, RenderComponentType } from "../../../types/types";

export const renderHTML = (
  e: Element,
  template: Element | null,
  functions: FunctionsArray,
  renderType: RenderComponentType
) => {
  if (e instanceof HTMLTemplateElement) {
    const content = e.content;
    if (template && content) {
      appendChild.call(e.content, template);
    }
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
            functions.forEach((func, i) => {
              if (i === 0 && renderType === "each") {
                return func(el?.parentNode);
              } else if (i === 0 && renderType === "component") {
                return func(el);
              } else return func(el);
            });
          } else {
            createError("Component include only one node with type 'Element'");
          }
        } else {
          if (renderType === "each") {
            if (parent) {
              try {
                while (content.firstChild) {
                  parent.insertBefore(content.firstChild, e);
                }
                parent.removeChild(e);
              } catch (err) {
                createError(`${err}`);
              }
            } else {
              createError("Each Element error");
            }
            if (functions.length) {
              if (renderType !== "each") {
                functions[0](null);
              } else {
                functions.forEach((func, i) => {
                  if (i === 0) {
                    return func(parent);
                  } else return func(null);
                });
              }
            }
          } else {
            createError("Component include only one node with type 'Element'");
          }
        }
      }
    } else {
      if (parent && renderType !== "each") {
        parent.removeChild(e);
      }
      switch (renderType) {
        case "component":
          functions[0](null);
          break;
        case "each":
          const previousNode = e.previousSibling;
          const nextNode = e.nextSibling;
          if (parent) {
            parent.removeChild(e);
          }
          functions.forEach((func, i) => {
            if (i === 0) {
              func(parent, previousNode, nextNode);
            } else func(null);
          });
          break;
      }
    }
  } else createError("Element instanceof HTMLTemplateElement");
};
