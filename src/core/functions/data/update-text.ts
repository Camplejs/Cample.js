"use-strict";
import { TextArrayType } from "../../../types/types";

export const updateText = (value: any, texts: TextArrayType) => {
  for (const e of texts) {
    e.textContent = value;
  }
};
