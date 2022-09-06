"use-strict";
import { renderScript } from "../functions/render-script";
import { renderData } from "../functions/render-data";
import { renderAttributes } from "../functions/render-attributes";
export class Component {
  constructor(selector, template, options = {}) {
    this.selector = selector;
    this.template = template;
    this.attributes = options.attributes;
    this.script = options.script;
    this.data = options.data;
    this.style = options.style;
  }
  get _getSelector() {
    return this.selector;
  }
  get _getStyle() {
    return this.style;
  }
  render() {
    document.querySelectorAll(this.selector).forEach((e, index) => {
      if (typeof this.script !== "undefined") {
        if (this.script[1].start === "beforeLoad") renderScript(this.script, e);
      }
      if (typeof this.attributes !== "undefined") {
        renderAttributes(e, this.attributes);
      }
      e.insertAdjacentHTML(
        "afterbegin",
        renderData(this.template, this.data, index)
      );
      if (typeof this.script !== "undefined") {
        if (
          this.script[1].start === "afterLoad" ||
          this.script[1].start === "undefined"
        )
          renderScript(this.script, e);
      }
    });
  }
}
