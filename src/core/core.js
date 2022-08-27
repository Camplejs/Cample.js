'use-strict';
import { renderStyle } from "../functions/render-style";
const renderTemplate = (template, options) => {
    if (typeof options === "undefined")
        return template;
    const regex = /\{{(.*?)}}/g;
    template = template.replace(regex, (str, d) => {
        let key = d.trim();
        if (!options[key])
            return str;
        return options[key].getSelector ? document.createElement(options[key].getSelector).outerHTML : str;
    });
    return template;
};

export class Cample{
    constructor(selector) {
        this.selector = selector;
        this.template = "";
        this.style = "";
    }
    render(template, options) {
        if (typeof this.template === "undefined" || this.options === "undefined")
            return;
        this.template = renderTemplate(template, options);
        document.querySelector(this.selector).insertAdjacentHTML('afterbegin', this.template);
        Object.keys(options).forEach((e) => {
            if (options[e].getStyle) {
                this.style += options[e].getStyle;
            }
        });
        renderStyle(this.style);
        Object.keys(options).forEach((e) => {
            options[e].render();
        });
    }
}
