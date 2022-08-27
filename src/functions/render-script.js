'use-strict';
export const renderScript = (script, element) => {
    const scripts = script[0];
    const options = script[1];
    const elements = {};
    if (typeof options.elements !== "undefined") {
        options.elements.forEach((e) => {
            elements[Object.keys(e)[0]] = element.querySelector(e[Object.keys(e)[0]]);
        });
    }
    scripts(elements);
};
