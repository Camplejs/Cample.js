import { createError } from "./../utils/utils";
export const renderRouteLink = (element: any, path: string): void => {
  if (element && path) {
    element.addEventListener("click", () => {
      window.history.pushState({}, "", path);
      window.dispatchEvent(new Event("pathnamechange"));
    });
  } else {
    createError("Error: Properties 'element', 'path' is required");
  }
};
