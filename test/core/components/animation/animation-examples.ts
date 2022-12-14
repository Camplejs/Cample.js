import { AnimationComponent } from "../../../../src/core/components/animation/animation";
import { animationComponent } from "../../../../src/core/functions/class/animation/animation";

export const animation = animationComponent("new-animation", "component", {
  event: "click",
  styleAnimation: ``,
  attributes: {
    id: "id"
  },
  class: "animation-class",
  transition: "2s all",
  style: "",
  element: {
    selector: "div",
    id: "id",
    class: "class",
    transition: "2s all",
    attributes: {
      align: "center"
    }
  }
});
export const animation1 = new AnimationComponent(
  "new-animation1",
  "component",
  {
    event: "hover",
    styleAnimation: "",
    class: "",
    style: ".component{}"
  }
);
export const animation2 = new AnimationComponent("new-animation2", undefined, {
  event: "",
  styleAnimation: "",
  class: ""
});
