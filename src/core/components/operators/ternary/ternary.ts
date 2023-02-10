"use-strict";
import { Operator } from "../operator";
import { renderTemplateElement } from "../../../functions/render/render-template-element";
import { renderAttributes } from "../../../functions/render/render-attributes";
import {
  ComponentsType,
  DefaultOptionsType,
  FunctionsArray,
  SelectorType
} from "../../../../types/types";
import { createError } from "../../../../shared/utils";
import { renderHTML } from "../../../functions/render/render-html";

export class Ternary extends Operator {
  public bool: boolean;

  constructor(
    selector: SelectorType,
    components: ComponentsType,
    bool: boolean,
    options: DefaultOptionsType | undefined = undefined
  ) {
    super(selector, components, options);
    this.bool = bool;
  }
  render(replaceTags?:boolean, trimHTML?:boolean): void {
    if (typeof this.components === "undefined" || this.components.length !== 2)
      createError("Error: Ternary operator renders two components");
    let templateElement: any = null;
    const index = this.bool ? 0 : 1;
    const condition = replaceTags && this.replaceTag === undefined || this.replaceTag;
    const trim = trimHTML && this.trimHTML === undefined || this.trimHTML;
    if(replaceTags && this.replaceTags === undefined || this.replaceTags){
      const el = document.createElement("template");
      el.setAttribute("data-cample", this.components[index]);
      this.template = el.outerHTML;
    }else{
      this.template = document.createElement(this.components[index]).outerHTML;
    }

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
    if (templateElement)
      templateElement.insertAdjacentHTML("afterbegin", this.template);
    if (this.selector)
    document.querySelectorAll(condition?`template[data-cample=${this.selector}]`: this.selector).forEach((e) => {
      const functionsArray:FunctionsArray = [];
      if(typeof this.attributes !== "undefined"){
        if (!condition) {
          renderAttributes(e, this.attributes);
        }else{
          functionsArray.push((el:Element)=>renderAttributes(el, this.attributes))
        }
      }
      const template = templateElement
      ? templateElement.outerHTML
      : this.template;
      renderHTML(e, template,this.replaceTag, replaceTags, functionsArray, "ternary",trim);
    });
  }
}
