"use-strict";

export const renderTemplate = (template: string, options: any, replaceTag:boolean): string => {
  if (typeof options === "undefined") return template;
  const regex = /\{{(.*?)}}/g;
  template = template.replace(regex, (str, d) => {
    const key = d.trim();
    if (!options[key]) return str;
    if(replaceTag){
      if(options[key]._getSelector){
        const el = document.createElement("template");
        el.setAttribute("data-cample", options[key]._getSelector);
        return el.outerHTML;
      }else return str;
    }else return options[key]._getSelector
    ? document.createElement(options[key]._getSelector).outerHTML
    : str;
  });
  return template;
};
