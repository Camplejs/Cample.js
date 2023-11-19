"use-strict";
import { updText } from "../../../config/config";
import { TextArrayType } from "../../../types/types";

export const updateText = (value: any, texts: TextArrayType) => {
  for (let i = 0; i < texts.length; i++) {
    const e = texts[i];
    updText.call(e, value);
  }
};
