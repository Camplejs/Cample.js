"use-strict";
import { renderTemplateElement } from "../../functions/render/render-template-element";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentsType,
  DefaultOptionsType,
  LengthType,
  SelectorType,
  FunctionsArray,
  ExportDataType,
  ExportIdType
} from "../../../types/types";
import { createError } from "../../../shared/utils";
import { renderHTML } from "../../functions/render/render-html";
import { ParentComponent } from "../parent-component/parent-component";
import { renderComponents } from "../../functions/render/render-components";

export class Cycle extends ParentComponent {
  public length: LengthType;
  public components: ComponentsType;
  public replaceTags?: boolean;

  constructor(
    selector: SelectorType,
    components: ComponentsType,
    length: LengthType = 0,
    options: DefaultOptionsType = {}
  ) {
    super(selector, options);
    this.length = length;
    this.components = components;
    this.replaceTags = options.replaceTags;
  }

  render(
    replaceTags?: boolean,
    trimHTML?: boolean,
    exportData?: ExportDataType,
    exportId?: ExportIdType
  ): void {
    if (typeof this.components === "undefined" || this.components.length === 0)
      createError("Error: Cycle component renders one and more components");
    let templateElement: any = null;
    const trim = (trimHTML && this.trimHTML === undefined) || this.trimHTML;
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
    for (let i = 0; i < this.length; i++) {
      const components = renderComponents(
        this.components,
        (replaceTags && this.replaceTags === undefined) || this.replaceTags,
        "cycle",
        this.template,
        i,
        exportId
      );
      this.template = typeof components === "string" ? components : "";
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
            "cycle",
            trim
          );
        });
  }
}
