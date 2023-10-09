"use-strict";

import { MAIN_REGEX } from "../../../config/config";
import { createEl } from "../../../shared/utils";

export const renderTemplate = (template: string, options: any): string => {
  if (typeof options === "undefined") return template;
  template = template.replace(MAIN_REGEX, (str, d) => {
    const key = d.trim();
    if (!options[key]) return str;
    if (options[key]._getSelector) {
      return createEl("template", [
        {
          selector: "data-cample",
          value: options[key]._getSelector
        }
      ]).outerHTML;
    } else return str;
  });
  return template;
};
