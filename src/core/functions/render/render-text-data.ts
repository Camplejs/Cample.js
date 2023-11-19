"use strict";

import { MAIN_REGEX } from "../../../config/config";
import { AttrValueType } from "../../../types/types";

export const renderTextData = (text: string, data: AttrValueType) => {
  const newValue = text.replace(MAIN_REGEX, (_, d) => {
    const key = d.trim();
    return data[key];
  });
  return newValue;
};
