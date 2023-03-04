"use-strict";

import { createEl } from "../../../shared/utils";

export const renderTemplate = (
  template: string,
  options: any,
  replaceTag: boolean
): string => {
  if (typeof options === "undefined") return template;
  const regex = /\{{(.*?)}}/g;
  template = template.replace(regex, (str, d) => {
    const key = d.trim();
    if (!options[key]) return str;
    if (options[key]._getSelector) {
      return replaceTag
        ? createEl("template", [
            {
              selector: "data-cample",
              value: options[key]._getSelector
            }
          ]).outerHTML
        : createEl(options[key]._getSelector, []).outerHTML;
    } else return str;
  });
  return template;
};
