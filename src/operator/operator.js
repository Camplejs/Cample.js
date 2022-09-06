"use-strict";
export class Operator {
  constructor(selector, components, options) {
    this.selector = selector;
    this.components = components;
    this.options = options;
    this.attributes =
      typeof this.options !== "undefined" ? this.options.attributes : undefined;
    this.style = typeof this.options !== "undefined" ? this.options.style : "";
    this.template = "";
  }
  get _getSelector() {
    return this.selector;
  }
  get _getStyle() {
    return this.style;
  }
}
