import { Cycle } from "../../../../src/core/components/cycles/cycle/cycle";
import { cycle } from "../../../../src/core/functions/class/cycles/cycle/cycle";
export const cycle0 = cycle("new-cycle", ["component"], 2, {
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
