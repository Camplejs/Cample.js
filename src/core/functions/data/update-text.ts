"use-strict";
import { TextArrayType } from "../../../types/types";

export const updateText = (value: any, texts: TextArrayType) => {
  texts.forEach((e, i) => {
    if (e) {
      e.textContent = value;
    } else {
      texts.splice(i, 1);
    }
  });
};
