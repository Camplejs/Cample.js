'use-strict';
import { Operator } from '../operator';
import { renderTemplateElement } from "../../functions/render-template-element";
export class Addition extends Operator {
    constructor(selector, components, options) {
        super(selector, components, options);
    }
    render() {
        if (typeof this.components === "undefined" || this.components.length === 0)
            return;
        let templateElement = null;
        if (this.components.length > 1) {
            this.components.forEach((component) => {
                this.template += document.createElement(component).outerHTML;
            });
        }
        else
            throw new Error("Error: Addition operator renders two and more components");
        if(typeof this.options !== "undefined"){
            if (this.options.element) {
                templateElement = renderTemplateElement(this.options.element.selector, this.options.element.id, this.options.element.class);
            }
        }
        if (templateElement)
            templateElement.insertAdjacentHTML('afterbegin', this.template);
        document.querySelectorAll(this.selector).forEach((e) => {
            e.insertAdjacentHTML('afterbegin', templateElement ? templateElement.outerHTML : this.template);
        });
    }
}
