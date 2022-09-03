'use-strict';
import {renderAttributes} from "./render-attributes";
export const renderTemplateElement = (selector, id, classElement, attributes) => {
    let templateElement = null;
    if (selector) {
        templateElement = document.createElement(selector);
        if (id)
            templateElement.setAttribute("id", id);
        if (classElement)
            templateElement.classList.add(classElement);
        if(attributes)
            renderAttributes(templateElement, attributes);
    }
    return templateElement;
};
