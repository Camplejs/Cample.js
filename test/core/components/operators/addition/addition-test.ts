import assert from "assert";
import { JSDOM } from "jsdom";
import { addition0, addition1, addition2 } from "./addition-examples";
describe("Addition", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM(
      "<!DOCTYPE html><html><head></head><body><component></component></body></html>"
    ).window.document;
    global.document = d;
  });
  it("Addition (1)", () => {
    assert.equal(addition0._getStyle, "");
  });
  it("Addition (2)", () => {
    assert.equal(addition0._getSelector, "new-addition");
  });
  it("Addition (3)", () => {
    assert.equal(addition1._getSelector, "new-addition1");
  });
  it("Addition (4)", () => {
    assert.throws(
      () => {
        addition2.render();
      },
      Error,
      "Error: Addition operator renders two and more components"
    );
  });
});
