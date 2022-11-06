import { Cycle } from "./../../../src/components/cycle/cycle";
export const cycle = new Cycle("new-cycle", ["component"], 2, {
  attributes: {
    id: "id"
  },
  style: "",
  element: {
    selector: "div",
    id: "",
    class: "",
    attributes: {
      id: ""
    }
  }
});
export const cycle1 = new Cycle("new-cycle1", ["component"], 2, {
    attributes: {
      id: "id"
    },
    style: "#id{}"
  });
export const cycle2 = new Cycle("new-cycle2", [], 2);
