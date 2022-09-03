'use-strict';
import { Operator } from '../operator';
import { renderTemplateElement } from "../../functions/render-template-element";
import { renderAttributes } from "../../functions/render-attributes";
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
                templateElement = renderTemplateElement(this.options.element.selector, this.options.element.id, this.options.element.class, this.options.element.attributes);
            }
        }
        if (templateElement)
            templateElement.insertAdjacentHTML('afterbegin', this.template);
        document.querySelectorAll(this.selector).forEach((e) => {
            if(typeof this.attributes !== "undefined"){
                renderAttributes(e, this.attributes);
            }
            e.insertAdjacentHTML('afterbegin', templateElement ? templateElement.outerHTML : this.template);
        });
    }
}
