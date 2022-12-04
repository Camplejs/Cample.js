import { Ternary } from "../../../../../src/core/components/operators/ternary/ternary";
import { ternary } from "../../../../../src/core/functions/class/operators/ternary/ternary";

export const ternary0 = ternary(
  "new-ternary",
  ["component1", "component2"],
  true,
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
export const ternary1 = new Ternary(
  "new-ternary1",
  ["component1", "component2"],
  false
);
export const ternary2 = new Ternary("new-ternary2", ["component1"], true);
