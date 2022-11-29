import { Addition } from "./../../../src/operator/addition/addition";
export const addition = new Addition(
  "new-addition",
  ["component", "component"],
  {
    style: "",
    attributes: {
      id: ""
    },
    element: {
      selector: "div",
      class: "",
      id: "",
      attributes: {
        id: ""
      }
    }
  }
);
export const addition1 = new Addition("new-addition1", [
  "component",
  "component"
]);
export const addition2 = new Addition("new-addition2", []);
