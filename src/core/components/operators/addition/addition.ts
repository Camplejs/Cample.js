"use-strict";
import { Operator } from "../operator";
import { renderTemplateElement } from "../../../functions/render/render-template-element";
import { renderAttributes } from "../../../functions/render/render-attributes";
import {
  ComponentsType,
  DefaultOptionsType,
  ExportDataType,
  ExportIdType,
  FunctionsArray,
  SelectorType
} from "../../../../types/types";
import { createError } from "../../../../shared/utils";
import { renderHTML } from "../../../functions/render/render-html";
import { renderComponents } from "../../../functions/render/render-components";
export class Addition extends Operator {
  constructor(
    selector: SelectorType,
    components: ComponentsType,
    options: DefaultOptionsType | undefined = undefined
  ) {
    super(selector, components, options);
  }
  render(
    replaceTags?: boolean,
    trimHTML?: boolean,
    exportData?: ExportDataType,
    exportId?: ExportIdType
  ): void {
    if (typeof this.components === "undefined" || this.components.length < 1)
      createError("Addition operator renders two and more components");
    let templateElement: any = null;
    const trim = (trimHTML && this.trimHTML === undefined) || this.trimHTML;
    const components = renderComponents(
      this.components,
      (replaceTags && this.replaceTags === undefined) || this.replaceTags,
      "addition",
      this.template
    );
    this.template = typeof components === "string" ? components : "";
    if (typeof this.options !== "undefined") {
      if (this.options.element) {
        templateElement = renderTemplateElement(
          this.options.element.selector,
          this.options.element.id,
          this.options.element.class,
          this.options.element.attributes
        );
      }
    }
    const condition =
      (replaceTags && this.replaceTag === undefined) || this.replaceTag;
    if (templateElement)
      templateElement.insertAdjacentHTML("afterbegin", this.template);
    if (this.selector)
      document
        .querySelectorAll(
          condition ? `template[data-cample=${this.selector}]` : this.selector
        )
        .forEach((e) => {
          const functionsArray: FunctionsArray = [];
          if (typeof this.attributes !== "undefined") {
            if (!condition) {
              renderAttributes(e, this.attributes);
            } else {
              functionsArray.push((el: Element) =>
                renderAttributes(el, this.attributes)
              );
            }
          }
          const template = templateElement
            ? templateElement.outerHTML
            : this.template;
          renderHTML(
            e,
            template,
            this.replaceTag,
            replaceTags,
            functionsArray,
            "addition",
            trim
          );
        });
  }
}
