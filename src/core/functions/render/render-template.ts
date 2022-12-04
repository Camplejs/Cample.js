"use-strict";

export const renderTemplate = (template: string, options: any): string => {
  if (typeof options === "undefined") return template;
  const regex = /\{{(.*?)}}/g;
  template = template.replace(regex, (str, d) => {
    const key = d.trim();
    if (!options[key]) return str;
    return options[key]._getSelector
      ? document.createElement(options[key]._getSelector).outerHTML
      : str;
  });
  return template;
};
