"use-strict";
import { renderTemplateElement } from "../../functions/render/render-template-element";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentsType,
  DefaultOptionsType,
  LengthType,
  SelectorType,
  StyleType,
  AttributesType,
  FunctionsArray
} from "../../../types/types";
import { createError } from "../../../shared/utils";
import { renderHTML } from "../../functions/render/render-html";

export class Cycle {
  public selector: SelectorType;
  public length: LengthType;
  public components: ComponentsType;
  public template: string;
  public options: DefaultOptionsType;
  public attributes: AttributesType | undefined;
  public style: StyleType;
  public replaceTag?: boolean;
  public replaceTags?: boolean;
  public trimHTML?:boolean;

  constructor(
    selector: SelectorType,
    components: ComponentsType,
    length: LengthType = 0,
    options: DefaultOptionsType = {}
  ) {
    this.selector = selector;
    this.length = length;
    this.components = components;
    this.template = "";
    this.options = options;
    this.attributes = this.options.attributes;
    this.style = this.options.style ? this.options.style : "";
    this.replaceTag = options.replaceTag;
    this.replaceTags =  options.replaceTags;
    this.trimHTML = options.trimHTML;
  }
  get _getSelector(): SelectorType {
    return this.selector;
  }
  get _getStyle(): StyleType {
    return this.style;
  }
  render(replaceTags?:boolean, trimHTML?:boolean): void {
    if (typeof this.components === "undefined" || this.components.length === 0)
      createError("Error: Cycle component renders one and more components");
    let templateElement: any = null;
    const trim = trimHTML && this.trimHTML === undefined || this.trimHTML;
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
      this.components.forEach((component) => {
        if(replaceTags && this.replaceTags === undefined || this.replaceTags){
          const el = document.createElement("template");
          el.setAttribute("data-cample", component);
          this.template += el.outerHTML;
        }else{
          this.template += document.createElement(component).outerHTML;
        }
      });
    }
    const condition = replaceTags && this.replaceTag === undefined || this.replaceTag;
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
        renderHTML(e, template,this.replaceTag, replaceTags, functionsArray, "cycle",trim);
      });
  }
}
