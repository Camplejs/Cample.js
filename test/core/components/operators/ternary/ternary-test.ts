import assert from "assert";
import { JSDOM } from "jsdom";
import { ternary0, ternary2 } from "./ternary-examples";

describe("Ternary", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM(
      "<!DOCTYPE html><html><head></head><body><component1></component1><component2></component2></body></html>"
    ).window.document;
    global.document = d;
  });
  it("Ternary (1)", () => {
    assert.equal(ternary0._getStyle, "");
  });
  it("Ternary (2)", () => {
    assert.equal(ternary0._getSelector, "new-ternary");
  });
  it("Ternary (3)", () => {
    assert.throws(
      () => {
        ternary2.render();
      },
      Error,
      "Ternary operator renders two components"
    );
  });
});
