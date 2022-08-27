'use-strict';
import { Operator } from '../operator';
import { renderTemplateElement } from "../../functions/render-template-element";
export class If extends Operator {
    constructor(selector, components, bool, options) {
        super(selector, components, options);
        this.bool = bool;
    }
    render() {
        if (typeof this.components === "undefined" || this.components.length === 0)
            return;
        
        let templateElement = null;

        if(this.bool){
            if (this.components.length > 0) {
                this.components.forEach((component) => {
                    this.template += document.createElement(component).outerHTML;
                });
            }
        }

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
