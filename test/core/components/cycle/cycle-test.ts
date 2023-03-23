import assert from "assert";
import { JSDOM } from "jsdom";
import { cycle0, cycle1, cycle2 } from "./cycle-examples";

describe("Cycle", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM(
      "<!DOCTYPE html><html><head></head><body><component></component></body></html>"
    ).window.document;
    global.document = d;
  });
  it("Cycle (1)", () => {
    assert.equal(cycle0._getStyle, "");
  });
  it("Cycle (2)", () => {
    assert.equal(cycle0._getSelector, "new-cycle");
  });
  it("Cycle (3)", () => {
    assert.equal(cycle1._getStyle, "#id{}");
  });
  it("Cycle (4)", () => {
    assert.throws(
      () => {
        cycle2.render();
      },
      Error,
      "Cycle1 component renders one and more components"
    );
  });
});
