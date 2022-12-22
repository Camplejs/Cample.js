"use-strict";
import { renderScript } from "../../functions/render/render-script";
import { renderData } from "../../functions/render/render-data";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentOptionsType,
  SelectorType,
  StyleType,
  DataType,
  ScriptType,
  AttributesType,
  RenderType
} from "../../../types/types";
import { createError, getTextArray, testRegex } from "../../../shared/utils";
import { renderFunctionsData } from "../../functions/render/render-functions-data";
import { Dynamic } from "../../data/dynamic/dynamic";

export class Component {
  public selector: SelectorType;
  public template: string;
  public attributes: AttributesType | undefined;
  public script: ScriptType | undefined;
  public data: DataType | undefined;
  public style: StyleType | undefined;
  private _dynamic: Dynamic;

  constructor(
    selector: SelectorType,
    template: string,
    options: ComponentOptionsType | undefined = {}
  ) {
    this.selector = selector;
    this.template = template;
    this.attributes = options.attributes;
    this.script = options.script;
    this._dynamic = new Dynamic();
    this.data = options.data
      ? this._dynamic.watcher(options.data, this._dynamicRender.bind(this))
      : undefined;
    this.style = options.style;
  }
  get _getSelector(): SelectorType {
    return this.selector;
  }
  get _getStyle(): StyleType {
    return this.style;
  }

  _dynamicRender(): void {
    this.render("dynamic");
  }

  render(type: RenderType = "default"): void {
    if (typeof this.selector !== "undefined") {
      const newFunction = (attribute: any, key: string) => {
        if (this.data && key && this.data[key]) {
          this.data[key] = attribute;
        }
      };
      const updateFunction = (name: string, key: string) => {
        const defaultData =
          this.data && this.data[key] ? this.data[key] : undefined;
        const updateData = (attr = defaultData) => {
          return attr;
        };
        this._dynamic.functions[name] = (attribute: any = updateData) => {
          if (typeof attribute === "function") {
            newFunction(attribute(defaultData), key);
          } else {
            newFunction(attribute, key);
          }
        };
      };
      const returnValue = (key: string) => {
        if (this.data) {
          return this.data[key];
        } else {
          return undefined;
        }
      };
      document.querySelectorAll(this.selector).forEach((e, index) => {
        this._dynamic.functions = new Set();
        renderFunctionsData(this.data, updateFunction);
        if (typeof this.script !== "undefined") {
          if (this.script[1].start === "beforeLoad")
            renderScript(this.script, e, this._dynamic.functions);
        }
        if (typeof this.attributes !== "undefined") {
          renderAttributes(e, this.attributes);
        }
        if (type !== "dynamic") {
          e.innerHTML = this.template;
          for (const child of e.getElementsByTagName("*")) {
            const arrayText = getTextArray(Array.from(child.childNodes));
            const regexAttr = Array.from(child.attributes)
              .map((attr) => attr.value)
              .filter((a) => testRegex(a));
            if (
              (arrayText.length &&
                testRegex(
                  arrayText
                    .map((n) => n.textContent)
                    .join()
                    .trim()
                )) ||
              regexAttr.length
            ) {
              if (!this._dynamic.updatingSet.get(child)) {
                this._dynamic.updatingSet.set(child, child.cloneNode(true));
              }
            }
            if (regexAttr.length) {
              Array.from(child.attributes).forEach((attr) => {
                if (testRegex(attr.value)) {
                  attr.value = renderData(
                    attr.value ?? "",
                    this.data,
                    index,
                    returnValue
                  );
                }
              });
            }
            if (
              arrayText.length &&
              testRegex(
                arrayText
                  .map((n) => n.textContent)
                  .join()
                  .trim()
              )
            ) {
              const text = getTextArray([...child.childNodes]);
              text.forEach((t) => {
                Array.from(child.childNodes).forEach((ch) => {
                  if (ch.nodeType === Node.TEXT_NODE) {
                    if (ch.nodeValue === t.nodeValue) {
                      ch.textContent = renderData(
                        t.nodeValue ?? "",
                        this.data,
                        index,
                        returnValue
                      );
                    }
                  }
                });
              });
            }
          }
        } else {
          this._dynamic.updatingSet.forEach(
            (constructor: Element, node: Element) => {
              const clonedValue = constructor;
              const arrayText = getTextArray(
                Array.from(clonedValue.childNodes)
              );
              const regexAttr = Array.from(clonedValue.attributes)
                .map((attr) => attr.value)
                .filter((a) => testRegex(a));
              if (regexAttr.length) {
                Array.from(node.attributes).forEach((attr, i) => {
                  const val = Array.from(clonedValue.attributes)[i].nodeValue;
                  if (testRegex(val ?? "")) {
                    attr.value = renderData(
                      val ?? "",
                      this.data,
                      index,
                      returnValue
                    );
                  }
                });
              }
              if (
                arrayText.length &&
                testRegex(
                  arrayText
                    .map((n) => n.textContent)
                    .join()
                    .trim()
                )
              ) {
                Array.from(node.childNodes).forEach((el, i) => {
                  if (el.nodeType === Node.TEXT_NODE) {
                    const val = clonedValue.childNodes[i].nodeValue;
                    el.textContent = renderData(
                      val ?? "",
                      this.data,
                      index,
                      returnValue
                    );
                  }
                });
              }
            }
          );
        }
        if (typeof this.script !== "undefined") {
          if (
            this.script[1].start === "afterLoad" ||
            this.script[1].start === undefined
          )
            renderScript(this.script, e, this._dynamic.functions);
        }
      });
    } else {
      createError("Error: Property 'selector' is required");
    }
  }
}
