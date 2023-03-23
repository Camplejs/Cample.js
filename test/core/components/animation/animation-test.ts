import assert from "assert";
import { JSDOM } from "jsdom";
import { animation, animation1, animation2 } from "./animation-examples";

describe("Animation", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM(
      "<!DOCTYPE html><html><head></head><body><component></component></body></html>"
    ).window.document;
    global.document = d;
  });
  it("Animation (1)", () => {
    assert.equal(animation._getStyle, ".animation-class{}");
  });
  it("Animation (2)", () => {
    assert.equal(animation._getSelector, "new-animation");
  });
  it("Animation (3)", () => {
    assert.equal(animation1._getSelector, "new-animation1");
  });
  it("Animation (4)", () => {
    assert.throws(
      () => {
        animation2.render();
      },
      Error,
      "Properties 'component', 'options', 'options.class', 'options.styleAnimation', 'options.event' or 'selector' is required"
    );
  });
});
