import { component0, component3 } from "./component-examples";
import assert from "assert";
import { JSDOM } from "jsdom";

describe("Component", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM(
      '<!DOCTYPE html><html><head></head><body><div id="page"></div></body></html>'
    ).window.document;
    global.document = d;
  });
  it("Component (1)", () => {
    assert.equal(component0._getStyle, "");
  });
  it("Component (2)", () => {
    assert.equal(component0._getSelector, "new-component");
  });
  it("Component (3)", () => {
    assert.throws(
      () => {
        component3.render();
      },
      Error,
      "Property 'selector' is required"
    );
  });
});
