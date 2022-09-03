'use-strict';
import { renderTemplateElement } from "../functions/render-template-element";
import { renderEvents } from "../functions/render-events";
import { renderAttributes } from "../functions/render-attributes";
export class AnimationComponent {
    constructor(selector, component, options) {
        this.selector = selector;
        this.component = component;
        this.template = "";
        this.options = options;
        this.attributes = typeof this.options !== "undefined" ? this.options.attributes : undefined;
        this.styleAnimation = typeof this.options !== "undefined" ? `.${this.options.class}{` + this.options.styleAnimation + `}` : "";
        this.style = typeof this.options !== "undefined" ? (this.options.style ? this.options.style : "") + this.styleAnimation : "";
    }
    get getSelector() {
        return this.selector;
    }
    get getStyle() {
        return this.style;
    }
    render() {
        if (typeof this.component === "undefined" || typeof this.options === "undefined")
            return;
        const component = document.createElement(this.component);
        let templateElement = null;
        if (this.options.element) {
            templateElement = renderTemplateElement(this.options.element.selector, this.options.element.id, this.options.element.class, this.options.element.attributes);
        }
        if (templateElement) {
            templateElement.appendChild(component);
            if (this.options.element && this.options.element.transition)
                templateElement.setAttribute("style", `transition:${this.options.element.transition};`);
        }
        this.template = templateElement ? templateElement.outerHTML : component.outerHTML;
        document.querySelectorAll(this.selector).forEach((e) => {
            if(typeof this.attributes !== "undefined"){
                renderAttributes(e, this.attributes);
            }
            e.insertAdjacentHTML('afterbegin', this.template);
            if (this.options.transition)
                e.setAttribute("style", `transition:${this.options.transition};`);
            renderEvents(templateElement ? e.firstChild : e, this.options.event, this.options.class, this.options.reverseEvent);
        });
    }
}
