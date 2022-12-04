import { Component } from "../../../../src/core/components/component/component";
import { component } from "../../../../src/core/functions/class/component/component";

export const component0 = component("new-component", `{{component_text}}`, {
  script: [
    (elements) => elements,
    {
      start: "afterLoad",
      elements: [{ component: ".component" }]
    }
  ],
  attributes: {
    id: "id"
  },
  data: {
    component_text: "Component"
  },
  style: ""
});

export const component1 = new Component(
  "new-component1",
  `{{component_text}}`,
  {
    script: [
      (elements) => elements,
      {
        start: undefined,
        elements: [{ component: ".component" }]
      }
    ]
  }
);

export const component2 = new Component(
  "new-component2",
  `{{component_text}}`,
  {
    script: [
      (elements) => elements,
      {
        start: "beforeLoad",
        elements: [{ component: ".component" }]
      }
    ]
  }
);
export const component3 = new Component(undefined, "");
