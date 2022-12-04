import { If } from "../../../../../src/core/components/operators/if/if";
import { ifComponent } from "../../../../../src/core/functions/class/operators/if/if";
export const newIf = ifComponent("new-if", ["component"], true, {
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
});
export const newIf1 = new If("new-if1", ["component"], true);
export const newIf2 = new If("new-if2", [], true);
