"use-strict";
export const renderStyle = (renderingStyle) => {
  if (typeof renderingStyle === "undefined") return;
  const style = document.createElement("style");
  style.setAttribute("type", "text/css");
  style.insertAdjacentHTML("afterbegin", renderingStyle);
  document.head.appendChild(style);
};
