'use-strict';
import { renderTemplateElement } from "../functions/render-template-element";
export class Cycle {
    constructor(selector, components, length = 0, options) {
        this.selector = selector;
        this.length = length;
        this.components = components;
        this.template = '';
        this.options = options;
        this.style = typeof this.options !== "undefined" ? this.options.style : "";
    }
    get getSelector() {
        return this.selector;
    }
    get getStyle() {
        return this.style;
    }
    render() {
        if (typeof this.components === "undefined" || this.components.length === 0)
            return;
        let templateElement = null;
        if(typeof this.options !== "undefined"){
            if (this.options.element) {
                templateElement = renderTemplateElement(this.options.element.selector, this.options.element.id, this.options.element.class);
            }
        }
        for (let i = 0; i < this.length; i++) {
            this.components.forEach(component => {
                this.template += document.createElement(component).outerHTML;
            });
        }
        if (templateElement)
            templateElement.insertAdjacentHTML('afterbegin', this.template);
        document.querySelectorAll(this.selector).forEach((e) => {
            e.insertAdjacentHTML('afterbegin', templateElement ? templateElement.outerHTML : this.template);
        });
    }
}
