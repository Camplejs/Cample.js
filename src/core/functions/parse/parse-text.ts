"use-strict";
import { TEXT_REGEX } from "../../../config/config";
import { getTextArray, testRegex } from "../../../shared/utils";

export const parseText = (el: Element | null) => {
  if (el) {
    const arrayText = getTextArray(Array.from(el.childNodes));
    const textRegex = arrayText
      .map((n) => n.textContent)
      .join()
      .trim();
    if (arrayText.length && testRegex(textRegex)) {
      arrayText.forEach((t) => {
        if (t.textContent && t.nodeValue && testRegex(t.textContent)) {
          const text = t.textContent;
          const regexAttr = [...text.matchAll(TEXT_REGEX)];
          regexAttr.map((txt, i) => {
            const val = txt[0];
            const newNode = document.createTextNode(val);
            if (i === regexAttr.length - 1) {
              el.replaceChild(newNode, t);
            } else {
              el.insertBefore(newNode, t);
            }
          });
        }
      });
    }
  }
};
