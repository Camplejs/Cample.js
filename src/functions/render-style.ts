"use-strict";
import { StyleType } from "../types/types";

export const renderStyle = (
  renderingStyle: StyleType,
  watch = false,
  id: undefined | string = "style-watch-mode"
): void => {
  if (typeof renderingStyle === "undefined") return;
  const styleEl = document.getElementById(id);
  if (styleEl !== null) {
    if (!(styleEl.innerHTML === renderingStyle)) {
      styleEl.innerHTML = renderingStyle;
    }
  } else {
    const style = document.createElement("style");
    style.setAttribute("type", "text/css");
    if (watch) {
      style.setAttribute("id", id);
    }
    style.insertAdjacentHTML("afterbegin", renderingStyle);
    document.head.appendChild(style);
  }
};
