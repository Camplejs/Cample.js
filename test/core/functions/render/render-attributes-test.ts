import { renderAttributes } from "../../../../src/core/functions/render/render-attributes";
import assert from "assert";
import { JSDOM } from "jsdom";

describe("renderAttributes", () => {
  let d, el;
  beforeEach(() => {
    d = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>")
      .window.document;
    el = d.createElement("div");
  });
  it("renderAttributes (1)", () => {
    assert.equal(renderAttributes(undefined, undefined), undefined);
  });
  it("renderAttributes (2)", () => {
    assert.equal(renderAttributes(el, undefined), undefined);
  });
  it("renderAttributes (3)", () => {
    renderAttributes(el, { id: "id" });
    assert.equal(el.outerHTML, '<div id="id"></div>');
  });
});
