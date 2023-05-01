"use-strict";
import { renderTemplateElement } from "../../functions/render/render-template-element";
import { renderEvents } from "../../functions/render/render-events";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  AnimationOptionsType,
  ComponentType,
  SelectorType,
  FunctionsArray,
  ExportDataType,
  ExportIdType
} from "../../../types/types";
import { createError } from "../../../shared/utils";
import { renderHTML } from "../../functions/render/render-html";
import { renderComponents } from "../../functions/render/render-components";
import { StaticDataComponent } from "../static-data-cmponent/static-data-component";

export class AnimationComponent extends StaticDataComponent {
  public component: ComponentType;
  public options: AnimationOptionsType;
  public styleAnimation: string;
  public style: string;
  public replaceTags?: boolean;

  constructor(
    selector: SelectorType,
    component: ComponentType,
    options: AnimationOptionsType
  ) {
    super(selector, options);
    this.component = component;
    this.options = options;
    this.styleAnimation =
      `.${this.options.class}{` + this.options.styleAnimation + `}`;
    this.style =
      (this.options.style ? this.options.style : "") + this.styleAnimation;
    this.replaceTags = options.replaceTags;
  }
  render(
    replaceTags?: boolean,
    trimHTML?: boolean,
    exportData?: ExportDataType,
    exportId?: ExportIdType
  ): void {
    if (
      typeof this.component === "undefined" ||
      typeof this.options === "undefined" ||
      typeof this.selector === "undefined" ||
      typeof this.options.class === "undefined" ||
      typeof this.options.styleAnimation === "undefined" ||
      typeof this.options.event === "undefined"
    ) {
      createError(
        "Properties 'component', 'options', 'options.class', 'options.styleAnimation', 'options.event' or 'selector' is required"
      );
    } else {
      let component: Element;
      const components = renderComponents(
        [this.component],
        (replaceTags && this.replaceTags === undefined) || this.replaceTags,
        "animation"
      );
      if (typeof components !== "string") {
        component = components;
        const trim = (trimHTML && this.trimHTML === undefined) || this.trimHTML;
        let templateElement: null | any = null;
        if (this.options.element) {
          templateElement = renderTemplateElement(
            this.options.element.selector,
            this.options.element.id,
            this.options.element.class,
            this.options.element.attributes
          );
        }
        const condition =
          (replaceTags && this.replaceTag === undefined) || this.replaceTag;
        if (templateElement) {
          templateElement.appendChild(component);
          if (this.options.element && this.options.element.transition)
            templateElement.setAttribute(
              "style",
              `transition:${this.options.element.transition};`
            );
        }
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
                functionsArray.push((el: Element | null) =>
                  renderAttributes(el, this.attributes)
                );
              }
            }
            this.template = templateElement
              ? templateElement.outerHTML
              : component.outerHTML;
            if (this.options.transition) {
              if (condition) {
                functionsArray.push((el: Element | null) => {
                  if (el) {
                    el.setAttribute(
                      "style",
                      `transition:${this.options.transition};`
                    );
                  }
                });
              }
            }
            if (condition) {
              functionsArray.push((el: Element | null) => {
                if (el) {
                  renderEvents(
                    el,
                    this.options.event,
                    this.options.class,
                    this.options.reverseEvent
                  );
                }
              });
            }
            renderHTML(
              e,
              this.template,
              this.replaceTag,
              replaceTags,
              functionsArray,
              "animation",
              trim
            );
            if (!condition) {
              renderEvents(
                templateElement ? e.firstChild : e,
                this.options.event,
                this.options.class,
                this.options.reverseEvent
              );
              if (this.options.transition)
                e.setAttribute(
                  "style",
                  `transition:${this.options.transition};`
                );
            }
          });
      } else createError("Component render");
    }
  }
}
