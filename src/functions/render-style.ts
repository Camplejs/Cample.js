"use-strict";
import { StyleType } from "../types/types";

export const renderStyle = (renderingStyle : StyleType) : void => {
  if (typeof renderingStyle === "undefined") return;
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.insertAdjacentHTML("afterbegin", renderingStyle);
  document.head.appendChild(style);
};
