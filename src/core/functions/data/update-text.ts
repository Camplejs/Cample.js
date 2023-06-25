"use-strict";
import { TextArrayType } from "../../../types/types";

export const updateText = (value: any, texts: TextArrayType) => {
  if (texts.length) {
    texts.forEach((e, i) => {
      if (e) {
        const newData: any = value;
        if (typeof e !== "number") e.textContent = newData;
      } else {
        texts.splice(i, 1);
      }
    });
  }
};
