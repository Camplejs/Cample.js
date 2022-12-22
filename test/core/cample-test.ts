import { addition1 } from "./components/operators/addition/addition-examples";
import { newIf, newIf1 } from "./components/operators/if/if-examples";
import {
  ternary0,
  ternary1
} from "./components/operators/ternary/ternary-examples";
import { cycle0, cycle1 } from "./components/cycle/cycle-examples";
import {
  component0,
  component1,
  component2
} from "./components/component/component-examples";
import { Cample } from "../../src/core/cample";
import { cample } from "../../src/core/functions/class/cample/cample";
import assert from "assert";
import { JSDOM } from "jsdom";
import { addition0 } from "./components/operators/addition/addition-examples";
import {
  animation,
  animation1
} from "./components/animation/animation-examples";

describe("core", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM(
      '<!DOCTYPE html><html><head></head><body><div id="page"></div></body></html>'
    ).window.document;
    global.document = d;
  });
  it("core (1)", () => {
    cample("#page").render("{{component0}}", { component0 });
    assert.equal(
      document.querySelector("#page")?.outerHTML,
      '<div id="page"><new-component id="id">{{component_text}}</new-component></div>'
    );
  });
  it("core (2)", () => {
    new Cample(undefined);
    assert.equal(
      document.querySelector("#page")?.outerHTML,
      '<div id="page"></div>'
    );
  });

  it("core (3)", () => {
    new Cample("#page").render(
      `
        {{newIf}},
        {{newIf1}},
        {{cycle0}},
        {{addition0}},
        {{addition1}},
        {{component1}},
        {{animation}},
        {{animation1}},
        {{ternary0}},
        {{component2}},
        {{ternary1}},
        {{cycle1}}`,
      {
        newIf,
        newIf1,
        cycle0,
        addition0,
        addition1,
        component1,
        animation,
        animation1,
        ternary0,
        component2,
        ternary1,
        cycle1
      }
    );
    assert.equal(null, null);
  });
});
