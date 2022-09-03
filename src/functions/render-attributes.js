'use-strict';
export const renderAttributes = (element, renderingAttributes) => {
    if (typeof element === "undefined")
        return;

    if(renderingAttributes){
        Object.keys(renderingAttributes).forEach((e) => {
            element.setAttribute(e, renderingAttributes[e]);
        });
    }
};
