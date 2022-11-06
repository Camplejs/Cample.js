import { RouteLink } from "./../../../src/routing/routelink/routelink";
export const routelink = new RouteLink("new-routelink", "new-component", "/new-component", {
  attributes: {
    id: "id"
  },
  style: ".test{}",
  element: {
    selector: "div",
    id: "",
    class: "",
    attributes: {
      id: ""
    }
  }
});
export const routelink1 = new RouteLink("new-routelink1", "new-component1", "/new-component1");
export const routelink2 = new RouteLink("new-routelink2", undefined, "/new-component2");
