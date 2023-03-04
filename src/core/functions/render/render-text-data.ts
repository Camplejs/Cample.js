"use strict";

import { AttrValueType } from "../../../types/types";

export const renderTextData = (text: string, data: AttrValueType) => {
  const regex = /\{{(.*?)}}/g;
  const newValue = text.replace(regex, (str, d) => {
    const key = d.trim();
    return data[key];
  });
  return newValue;
};
